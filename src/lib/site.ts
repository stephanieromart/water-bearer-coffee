import siteData from '../content/site.json';

/** Typed, single-import access to global site config (src/content/site.json). */
export const site = siteData;

export type Hours = (typeof siteData.hours)[number];

/** "$19.50" from 19.5; "$4" from 4. */
export function formatPrice(usd: number): string {
  return usd % 1 === 0 ? `$${usd}` : `$${usd.toFixed(2)}`;
}

/** Primary site navigation, used by both the header and footer. */
export const navLinks = [
  { label: 'Coffee', href: '/coffee' },
  { label: 'Menu', href: '/menu' },
  { label: 'Pantry', href: '/pantry' },
  { label: 'Mobile Espresso', href: '/mobile-espresso' },
  { label: 'About', href: '/about' },
  { label: 'Rewards', href: '/rewards' },
  { label: 'Visit', href: '/visit' },
] as const;
