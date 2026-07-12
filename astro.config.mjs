// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// NOTE: Update `site` to the real production domain before launch.
// It is used for sitemap URLs, canonical tags, and OG image URLs.
export default defineConfig({
  site: 'https://waterbearercoffee.com',
  integrations: [
    sitemap({
      // Keep noindex utility pages out of the sitemap.
      filter: (page) => !page.includes('/thank-you'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
