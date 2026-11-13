// The seven-beat ingredient sequence from the design spec (§06 · Ingredient
// scrollytelling). This is the single source of truth for both the static
// fallback (JarStory renders these as real, readable cards) and the
// scroll-driven stage (each beat's `progress` range drives GSAP ScrollTrigger).
// No component should hardcode an ingredient — read from BEATS instead.

import type { SpriteKind } from "@/components/jar-story/ingredientSprites";

export type JarBeatId =
  | "intro"
  | "makhana"
  | "almonds"
  | "cashews"
  | "peanuts"
  | "seeds"
  | "spice";

export interface JarParticleSpot {
  /** Pre-computed settle position, percent of the jar's inner width/height. */
  x: number;
  y: number;
  /** Degrees, applied once on settle — no live rotation. */
  rotation: number;
  /** 0-1, scales the particle sprite. */
  scale: number;
  /** Flip the silhouette so a beat's pieces don't read as one stamp repeated. */
  mirror: boolean;
  /** Which sprite this piece wears. Beats with a mixed shape list cycle through them. */
  shape: SpriteKind;
}

export interface JarBeat {
  id: JarBeatId;
  /** [start, end) of the 0-1 scroll progress this beat owns. */
  progress: [number, number];
  /** Ingredient name, title case. e.g. "Almonds". Empty for the intro beat. */
  name: string;
  /** Share of the mix, e.g. "12%". Empty for the intro beat. */
  share: string;
  /** Composed stamp line, e.g. "MAKHANA ✱ 20%". Derived — never hand-written. */
  label: string;
  /** One-line copy under the label. */
  copy: string;
  /** Fill level of the jar contents at the end of this beat, 0-1. */
  fillLevel: number;
  /** The sprite this beat is *about* — what the fallback card shows. Null for the intro. */
  particleShape: SpriteKind | null;
  /**
   * Sprite width as a percent of the particle field, not a px size. A fixed
   * px size looked right on a 420px jar and absurd on a 260px one; a
   * percentage keeps every piece in proportion to the glass at any width.
   */
  particleSize: number;
  /** The beat's accent, used for the label card rule and the progress rail. */
  particleColor: string;
  /** How many particle sprites this beat adds. */
  particleCount: number;
  /** Tint applied to the jar contents once this beat has fully played. */
  tint: string;
  /** Pre-computed settle positions, one per particle. Deterministic — no runtime physics. */
  settlePositions: JarParticleSpot[];
}

interface SpreadOptions {
  count: number;
  seed: number;
  /**
   * Vertical band this ingredient settles into, percent of the jar interior
   * measured from the top. Each band has to sit *below* its beat's
   * `fillLevel` surface line, or the pieces float above the contents like
   * they're still in mid-air. The masala cloud is the deliberate exception.
   */
  yMin: number;
  yMax: number;
  /** Horizontal band. Narrower near the top, where the glass pulls in to the neck. */
  xMin: number;
  xMax: number;
  /** One entry means every piece wears the same sprite; more than one cycles. */
  shapes: SpriteKind[];
}

// Deterministic pseudo-random spread so particles don't look hand-placed in
// a grid, but never move at runtime — this array IS the physics.
//
// The horizontal axis is *stratified*, not random: each piece gets its own
// slice of the band and jitters inside it. Pure random x clumped every beat
// into a narrow column down the middle of the glass with bare walls either
// side, which looks like a spill, not a jar someone filled.
function spread({ count, seed, yMin, yMax, xMin, xMax, shapes }: SpreadOptions): JarParticleSpot[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    x: xMin + ((i + 0.2 + rand() * 0.6) / count) * (xMax - xMin),
    y: yMin + rand() * (yMax - yMin),
    // Nuts lie every which way in a jar, but a *fully* random spin makes the
    // almonds read as an explosion. ±52° off upright keeps the pile legible.
    rotation: Math.round(-52 + rand() * 104),
    scale: 0.82 + rand() * 0.34,
    mirror: rand() < 0.5,
    shape: shapes[i % shapes.length],
  }));
}

type BeatSeed = Omit<JarBeat, "label">;

// `share` values below are the product's stated composition: makhana 20%,
// almonds 20%, cashews 20%, peanuts 30%, seeds 9%, masala 1%. Note these are
// display percentages, not derived from the 50/75/50/50/35g recipe used for
// the nutrition panel (§7 of docs/packaging-back-panel-plan.md) — that ratio
// works out closer to 18/19/18/28/13/4. The two aren't required to match to
// the decimal, but if that gap ever looks like a real discrepancy rather
// than rounding, it's because it is one — flag it rather than assume.
//
// Beats are declared without `label` and it is composed below, so the stamp
// line can never disagree with the name and share it is built from.
const SEEDS: BeatSeed[] = [
  {
    id: "intro",
    progress: [0, 0.1],
    name: "",
    share: "",
    copy: "Curious what's actually inside?",
    fillLevel: 0,
    particleShape: null,
    particleSize: 0,
    particleColor: "transparent",
    particleCount: 0,
    tint: "transparent",
    settlePositions: [],
  },
  {
    id: "makhana",
    progress: [0.1, 0.25],
    name: "Makhana",
    share: "20%",
    copy: "Popped lotus seeds. The crunch everything else sits on.",
    fillLevel: 0.35,
    particleShape: "makhana",
    particleSize: 20,
    particleColor: "var(--seed-makhana-sh)",
    particleCount: 20,
    tint: "var(--paper-2)",
    settlePositions: spread({ count: 20, seed: 11, yMin: 66, yMax: 98, xMin: 14, xMax: 86, shapes: ["makhana"] }),
  },
  {
    id: "almonds",
    progress: [0.25, 0.38],
    name: "Almonds",
    share: "20%",
    copy: "For the crunch that fights back.",
    fillLevel: 0.5,
    particleShape: "almond",
    particleSize: 22,
    particleColor: "var(--nut-almond)",
    particleCount: 9,
    tint: "var(--paper-2)",
    settlePositions: spread({ count: 9, seed: 23, yMin: 52, yMax: 72, xMin: 14, xMax: 86, shapes: ["almond"] }),
  },
  {
    id: "cashews",
    progress: [0.38, 0.5],
    name: "Cashews",
    share: "20%",
    copy: "Because we're not monsters.",
    fillLevel: 0.62,
    particleShape: "cashew",
    particleSize: 23,
    particleColor: "var(--nut-cashew-sh)",
    particleCount: 8,
    tint: "var(--paper-2)",
    settlePositions: spread({ count: 8, seed: 37, yMin: 40, yMax: 58, xMin: 14, xMax: 86, shapes: ["cashew"] }),
  },
  {
    id: "peanuts",
    progress: [0.5, 0.62],
    name: "Peanuts",
    share: "30%",
    copy: "The reliable one.",
    fillLevel: 0.72,
    particleShape: "peanut",
    particleSize: 22,
    particleColor: "var(--nut-peanut-sh)",
    particleCount: 10,
    tint: "var(--paper-2)",
    settlePositions: spread({ count: 10, seed: 41, yMin: 30, yMax: 46, xMin: 16, xMax: 84, shapes: ["peanut"] }),
  },
  {
    id: "seeds",
    progress: [0.62, 0.74],
    name: "Seeds",
    share: "9%",
    copy: "Pumpkin, sunflower, flax. Tiny but loud.",
    fillLevel: 0.82,
    particleShape: "seed",
    particleSize: 13,
    particleColor: "var(--seed-pumpkin-sh)",
    particleCount: 14,
    tint: "var(--paper-2)",
    // Alternating the two husks is what stops this beat reading as one shape
    // stamped fourteen times — the copy says "pumpkin, sunflower", so the
    // picture had better show both.
    settlePositions: spread({ count: 14, seed: 53, yMin: 20, yMax: 34, xMin: 18, xMax: 82, shapes: ["seed", "seedStripe"] }),
  },
  {
    id: "spice",
    progress: [0.74, 0.86],
    name: "Masala",
    share: "1%",
    copy: "The part we won't explain.",
    fillLevel: 0.86,
    particleShape: "dust",
    particleSize: 18,
    particleColor: "var(--accent)",
    particleCount: 9,
    tint: "var(--accent-tint)",
    settlePositions: spread({ count: 9, seed: 67, yMin: 2, yMax: 20, xMin: 20, xMax: 80, shapes: ["dust"] }),
  },
];

export const BEATS: JarBeat[] = SEEDS.map((beat) => ({
  ...beat,
  label: beat.name ? `${beat.name.toUpperCase()} ✱ ${beat.share}` : "",
}));

// Non-ingredient beats — kept out of BEATS above because they don't own an
// ingredient card, but the timeline needs them to add up to 1.
export const SHAKE_PROGRESS: [number, number] = [0.86, 0.95];
export const FINALE_PROGRESS: [number, number] = [0.95, 1];

export const SHAKE = {
  rotationDeg: 8,
  translatePx: 14,
  oscillations: 6,
  durationMs: 900,
};

// Sanity check the timeline is contiguous and covers 0-1 — run at import
// time so a bad edit to the beat table fails loudly in dev, not in a demo.
if (process.env.NODE_ENV !== "production") {
  const all = [...BEATS.map((b) => b.progress), SHAKE_PROGRESS, FINALE_PROGRESS];
  all.forEach(([start], i) => {
    if (i > 0 && Math.abs(start - all[i - 1][1]) > 1e-9) {
      throw new Error(`JarStory beat timeline has a gap/overlap at index ${i}`);
    }
  });
  BEATS.forEach((b) => {
    if (b.settlePositions.length !== b.particleCount) {
      throw new Error(`JarStory beat "${b.id}" has ${b.settlePositions.length} spots for ${b.particleCount} particles`);
    }
  });
}

/**
 * Total animated particle elements across the whole sequence. The spec caps
 * the stage at ~140 DOM nodes; the count below is what actually gets
 * transformed on scroll, and the artwork behind each one is shared through a
 * single <use> reference rather than inlined per particle (see
 * ingredientSprites.tsx), so drawn detail costs one extra node, not seven.
 */
export const TOTAL_PARTICLE_COUNT = BEATS.reduce((sum, b) => sum + b.particleCount, 0);
