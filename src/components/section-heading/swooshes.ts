// Three hand-drawn underline variants so repeated headings on one page
// don't all wear the exact same squiggle. Paths are loose single-stroke
// sketches (a couple of dips like a marker moving fast), not a straight
// rule with rounded ends.
export const SWOOSH_PATHS = [
  "M2 10 C 40 2, 90 2, 140 9 S 230 18, 278 8",
  "M2 7 C 30 16, 70 -2, 118 8 S 210 4, 278 12",
  "M2 12 C 50 1, 100 14, 150 4 S 240 2, 278 10",
] as const;

export type SwooshVariant = 1 | 2 | 3;
