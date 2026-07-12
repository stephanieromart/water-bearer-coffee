import { getCollection } from 'astro:content';

/* ----------------------------------------------------------------------------
   The "pulse": current specials + upcoming events. Filtered at build time; the
   homepage strip ALSO hides items client-side by date, so a special vanishes the
   day it expires even between deploys. (Enable a daily Netlify build for tidy
   long-term behavior — see README.)
   ---------------------------------------------------------------------------- */

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Specials whose end date is today or later, soonest-ending first. */
export async function activeSpecials() {
  const today = startOfToday();
  return (await getCollection('specials'))
    .filter((s) => s.data.end >= today)
    .sort((a, b) => a.data.end.getTime() - b.data.end.getTime());
}

/** Events today or later, soonest first. */
export async function upcomingEvents() {
  const today = startOfToday();
  return (await getCollection('events'))
    .filter((e) => e.data.date >= today)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

const FMT = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
export const formatDate = (d: Date) => FMT.format(d);

/** ISO yyyy-mm-dd for data attributes / <time datetime>. */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
