import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/* ----------------------------------------------------------------------------
   Content collections. All site content is typed here so a bad edit fails the
   build loudly instead of silently rendering wrong. See README for how a
   non-developer edits these files safely.
   ---------------------------------------------------------------------------- */

const roastLevels = ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'] as const;

/** Shared shape for anything you can buy: coffee bags + pantry retail. */
const productBase = {
  name: z.string(),
  origin: z.string().optional(),
  process: z.string().optional(),
  tastingNotes: z.array(z.string()),
  price: z.number(), // USD, e.g. 19.5
  bagSize: z.string().optional(), // "12 oz", "32 oz concentrate"
  squareUrl: z.string().url().optional(), // deep-link to the Square product page
  heroImage: z.string().optional(), // path under /src/assets when real photos land
  heroAlt: z.string().optional(),
  story: z.string(), // one-paragraph story shown on cards / detail
  order: z.number().default(999), // manual sort weight
  featured: z.boolean().default(false),
};

const coffee = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/coffee' }),
  schema: z.object({
    ...productBase,
    roastLevel: z.enum(roastLevels),
    brewGuidance: z.string().optional(),
  }),
});

const pantry = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pantry' }),
  schema: z.object({
    ...productBase,
    category: z.enum(['Syrup', 'Chai', 'Cold Brew', 'Other']),
    // Coming-soon items render a "Coming Soon" treatment + email capture
    // instead of a Buy button. See brief constraint #1 and the pantry page.
    status: z.enum(['available', 'coming-soon']),
  }),
});

const menu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/menu' }),
  schema: z.object({
    category: z.string(), // "Espresso", "Not Coffee", "From the Kitchen", ...
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

/** Long-form page copy (About, Mobile Espresso, Rewards) as Markdown body. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: z.string().optional(),
  }),
});

export const collections = { coffee, pantry, menu, pages };
