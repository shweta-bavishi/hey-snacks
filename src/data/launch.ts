// The one place the launch batch lives. Hero, marquee, shop stamps, the
// notify modal all read from here, so moving
// the drop date is a one-line change.
//
// Batch 01 drop date, confirmed: 15 December 2026.
const DROP_DATE_ISO = "2026-12-15";

// Pinned to IST and an explicit locale so the server render and the
// browser always print the same string (no hydration mismatch, no date
// shifting by a day for a visitor in another timezone).
const DROP_INSTANT = new Date(`${DROP_DATE_ISO}T00:00:00+05:30`);

function formatDrop(options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...options }).format(DROP_INSTANT);
}

export interface LaunchBatch {
  /** "Batch 01" */
  name: string;
  /** ISO date, IST. */
  dropDate: string;
  /** "15 DEC", for stamps and marquee items. */
  dropDateShort: string;
  /** "15 December 2026", for sentences. */
  dropDateLong: string;
}

export const BATCH: LaunchBatch = {
  name: "Batch 01",
  dropDate: DROP_DATE_ISO,
  dropDateShort: formatDrop({ day: "numeric", month: "short" }).toUpperCase(),
  dropDateLong: formatDrop({ day: "numeric", month: "long", year: "numeric" }),
};

/** The label every primary CTA on the page uses. */
export const JOIN_LABEL = `Join ${BATCH.name}`;
