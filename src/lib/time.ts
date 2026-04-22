/**
 * Business timezone — the one all admin displays are formatted in.
 * Store UTC in the DB (timestamptz), format for humans here.
 * Change once if the business relocates; don't sprinkle the value.
 */
export const BUSINESS_TZ = "America/New_York";

export function formatDateLong(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: BUSINESS_TZ,
  }).format(d);
}

export function formatTimeShort(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: BUSINESS_TZ,
  }).format(d);
}

export function formatDayKey(d: Date): string {
  // YYYY-MM-DD in BUSINESS_TZ — used as a grouping key
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: BUSINESS_TZ,
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${day}`;
}
