// Build-time image optimization backstop.
// Runs before `astro build` (see package.json). Walks public/images and, for any
// raster image that is too large (wide or heavy), resizes it to a sane web width
// and re-encodes it in place — so an oversized upload (e.g. a 5 MB phone photo)
// never reaches the deployed site at full size. Idempotent: already-small images
// are skipped, so re-running does not degrade quality.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/images';
const MAX_WIDTH = 1600; // downscale anything wider than this
const SIZE_LIMIT = 800 * 1024; // …or heavier than this (bytes)
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

let processed = 0;
let skipped = 0;
const files = walk(ROOT);

for (const file of files) {
  const bytes = statSync(file).size;
  const buf = readFileSync(file);
  let meta;
  try {
    meta = await sharp(buf).metadata();
  } catch {
    skipped++;
    continue;
  }
  const tooWide = (meta.width ?? 0) > MAX_WIDTH;
  const tooHeavy = bytes > SIZE_LIMIT;
  if (!tooWide && !tooHeavy) {
    skipped++;
    continue;
  }

  let pipeline = sharp(buf).rotate(); // respect EXIF orientation
  if (tooWide) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const fmt = (meta.format || '').toLowerCase();
  if (fmt === 'png') pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  else if (fmt === 'webp') pipeline = pipeline.webp({ quality: 80 });
  else pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true });

  const outBuf = await pipeline.toBuffer();
  // Only overwrite if we actually saved space (or had to downscale).
  if (tooWide || outBuf.length < bytes) {
    writeFileSync(file, outBuf);
    const kb = (n) => Math.round(n / 1024);
    console.log(`  optimized ${file}  ${kb(bytes)}KB -> ${kb(outBuf.length)}KB`);
    processed++;
  } else {
    skipped++;
  }
}

console.log(`[optimize-images] ${processed} optimized, ${skipped} left as-is (${files.length} scanned).`);