import siteData from '../content/site.json';

/** Typed, single-import access to global site config (src/content/site.json). */
export const site = siteData;

/** "$19.50" from 19.5; "$4" from 4. */
export function formatPrice(usd: number): string {
  return usd % 1 === 0 ? `$${usd}` : `$${usd.toFixed(2)}`;
}

/** Primary site navigation (Order Online is a separate CTA, not in this list). */
export const navLinks = [
  { label: 'Menu', href: '/menu' },
  { label: 'Mobile Espresso', href: '/mobile-espresso' },
  { label: 'About', href: '/about' },
  { label: 'Visit', href: '/visit' },
] as const;
