// Generates public/og-default.png (1200x630) from an inline SVG using sharp.
// Re-run with `node scripts/gen-og.mjs` if brand colors or tagline change.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../public/og-default.png');

const bg = '#f5f0e6';
const ink = '#1a1613';
const accent = '#b5502f';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="0" y="0" width="1200" height="12" fill="${accent}"/>
  <text x="80" y="150" font-family="Georgia, serif" font-size="30" letter-spacing="6" fill="${accent}">TRAVERSE CITY, MICHIGAN</text>
  <text x="80" y="290" font-family="Georgia, serif" font-size="88" font-weight="600" fill="${ink}">Water Bearer Coffee</text>
  <text x="80" y="380" font-family="Georgia, serif" font-size="40" fill="${ink}" opacity="0.8">Roasted in house. Poured by the</text>
  <text x="80" y="435" font-family="Georgia, serif" font-size="40" fill="${ink}" opacity="0.8">person who roasts it.</text>
  <circle cx="1050" cy="480" r="90" fill="none" stroke="${accent}" stroke-width="4"/>
  <path d="M1010 480 q40 -55 80 0 q-40 55 -80 0 z" fill="${accent}"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
