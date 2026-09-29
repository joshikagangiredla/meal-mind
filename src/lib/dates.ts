/** Calendar helpers for the Planner. Dates are local "YYYY-MM-DD" strings. */

export function toKey(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey() {
  return toKey(new Date());
}

/** Monday of the week containing `d`, shifted by `offset` weeks. */
export function weekStart(d: Date, offset = 0) {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (start.getDay() + 6) % 7; // Mon = 0 … Sun = 6
  start.setDate(start.getDate() - day + offset * 7);
  return start;
}

/** The 7 dates (Mon–Sun) of a week. */
export function weekDays(start: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function weekLabel(start: Date) {
  const end = weekDays(start)[6];
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function weekdayShort(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

/** Whole weeks between two dates' Mondays. */
export function weeksBetween(a: Date, b: Date) {
  return Math.round((weekStart(b).getTime() - weekStart(a).getTime()) / (7 * 24 * 3600 * 1000));
}
