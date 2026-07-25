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

/** Menu — ONE FILE PER ITEM (CMS-friendly: add/edit/remove/reorder in the CMS).
    Grouped into sections on the page by `category`, ordered within a section by
    `order`. `hidden` pulls a (seasonal) item off the page without deleting it. */
const menu = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/menu' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(['Coffee', 'Teas', 'Smoothies', 'Food']),
    description: z.string().optional(),
    price: z.string().optional(), // editable in CMS; not shown on the site
    image: z.string().optional(), // "/images/menu/…"
    imageAlt: z.string().optional(),
    madeInHouse: z.boolean().default(false), // stored; badge display is off
    hidden: z.boolean().default(false), // true = pulled from the page (seasonal)
    order: z.number().default(999),
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

/** Retail products for the Shop page. Checkout is Square-hosted: `squareEmbed`
    holds the owner-pasted Square Payment Link snippet (empty until she adds it).
    We never build a cart or call a Square SDK. See README "Wiring up Square buy buttons". */
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.string().optional(), // display only, e.g. "$18" or "from $16"
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    squareEmbed: z.string().default(''), // owner-pasted Square buy-button HTML
    status: z.enum(['available', 'coming-soon']).default('available'),
    order: z.number().default(999),
  }),
});

export const collections = { specials, menu, pages, products };
