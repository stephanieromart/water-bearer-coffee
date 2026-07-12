import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ----------------------------------------------------------------------------
   Content collections. All site content is typed here so a bad edit fails the
   build loudly instead of silently rendering wrong.

   CMS-editable collections (Specials, Events, Hours, About blocks, hero) are
   added in step 2 alongside the Sveltia CMS config. See README for how Azure
   edits these safely.
   ---------------------------------------------------------------------------- */

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

export const collections = { menu, pages };
