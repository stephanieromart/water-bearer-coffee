import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ----------------------------------------------------------------------------
   Content collections. All site content is typed here so a bad edit fails the
   build loudly instead of silently rendering wrong.

   Azure edits Specials, Events, Hours, About, and the hero photo through the CMS
   (see public/admin/config.yml). Those write to the files loaded below. Layout,
   colors, and navigation are NOT exposed to the CMS — they live only in code.
   ---------------------------------------------------------------------------- */

/** Specials — the homepage "pulse". Auto-hide once `end` has passed. */
const specials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/specials' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(), // "/images/uploads/…"
    imageAlt: z.string().optional(),
    start: z.coerce.date().optional(),
    end: z.coerce.date(), // required: drives auto-hide
  }),
});

/** Events — dated happenings shown in the pulse strip and (later) an events list. */
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    time: z.string().optional(), // "6–8 PM"
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const menu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/menu' }),
  schema: z.object({
    category: z.string(),
    order: z.number().default(999),
    items: z.array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().optional(),
        madeInHouse: z.boolean().default(false),
      }),
    ),
  }),
});

/** Long-form page copy (Mobile Espresso) as Markdown body. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: z.string().optional(),
  }),
});

export const collections = { specials, events, menu, pages };
