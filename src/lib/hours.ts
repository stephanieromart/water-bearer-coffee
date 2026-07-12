import hoursData from '../content/settings/hours.json';

/* ----------------------------------------------------------------------------
   Hours come from a single CMS-editable file (settings/hours.json) with one row
   per weekday. Everything derived here: the grouped human display AND the
   LocalBusiness JSON-LD both build from this, so Azure only ever edits one place.
   ---------------------------------------------------------------------------- */

export interface DayHours {
  day: string;
  closed: boolean;
  open: string; // "07:00"
  close: string; // "18:00"
}

const DAY_CODES: Record<string, string> = {
  Monday: 'Mo',
  Tuesday: 'Tu',
  Wednesday: 'We',
  Thursday: 'Th',
  Friday: 'Fr',
  Saturday: 'Sa',
  Sunday: 'Su',
};

export const week = hoursData.week as DayHours[];

/** "07:00" -> "7 AM"; "07:30" -> "7:30 AM". */
export function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  let h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return m === 0 ? `${h} ${period}` : `${h}:${String(m).padStart(2, '0')} ${period}`;
}

interface HoursRow {
  label: string; // "Monday – Friday"
  text: string; // "7 AM – 6 PM" or "Closed"
  closed: boolean;
}

/** Collapse consecutive days with identical hours into ranges for display. */
export function groupedHours(): HoursRow[] {
  const rows: HoursRow[] = [];
  let i = 0;
  while (i < week.length) {
    const d = week[i];
    let j = i;
    while (
      j + 1 < week.length &&
      week[j + 1].closed === d.closed &&
      week[j + 1].open === d.open &&
      week[j + 1].close === d.close
    ) {
      j++;
    }
    const label = i === j ? week[i].day : `${week[i].day} – ${week[j].day}`;
    rows.push({
      label,
      text: d.closed ? 'Closed' : `${formatTime(d.open)} – ${formatTime(d.close)}`,
      closed: d.closed,
    });
    i = j + 1;
  }
  return rows;
}

/** Schema.org openingHoursSpecification entries (one per grouped run). */
export function openingHoursSpec() {
  const specs: { '@type': string; dayOfWeek: string[]; opens: string; closes: string }[] = [];
  let i = 0;
  while (i < week.length) {
    const d = week[i];
    let j = i;
    while (
      j + 1 < week.length &&
      week[j + 1].closed === d.closed &&
      week[j + 1].open === d.open &&
      week[j + 1].close === d.close
    ) {
      j++;
    }
    if (!d.closed) {
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: week.slice(i, j + 1).map((x) => DAY_CODES[x.day]),
        opens: d.open,
        closes: d.close,
      });
    }
    i = j + 1;
  }
  return specs;
}
