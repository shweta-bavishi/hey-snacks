// The seven-beat ingredient sequence from the design spec (§07 · Ingredient
// scrollytelling). This is the single source of truth for both the static
// fallback (JarStory renders these as real, readable cards) and the
// scroll-driven stage (each beat's `progress` range drives GSAP ScrollTrigger).
// No component should hardcode an ingredient — read from BEATS instead.

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
}

export interface JarBeat {
  id: JarBeatId;
  /** [start, end) of the 0-1 scroll progress this beat owns. */
  progress: [number, number];
  /** Ingredient label, e.g. "MAKHANA ✱ 60%". Empty for the intro beat. */
  label: string;
  /** One-line copy under the label. */
  copy: string;
  /** Fill level of the jar contents at the end of this beat, 0-1. */
  fillLevel: number;
  /** Particle sprite shape reused from MakhanaPuff, or "dust" for the spice cloud. */
  particleShape: "a" | "b" | "c" | "dust" | null;
  /** How many particle sprites this beat adds. Spice cloud uses a handful of soft dust sprites, not one per percent. */
  particleCount: number;
  /** Tint applied to the jar contents once this beat has fully played. */
  tint: string;
  /** Pre-computed settle positions, one per particle, length === particleCount. Deterministic — no runtime physics. */
  settlePositions: JarParticleSpot[];
}

// Deterministic pseudo-random spread so particles don't look hand-placed in
// a grid, but never move at runtime — this array IS the physics.
function spread(count: number, seed: number, yMin: number, yMax: number): JarParticleSpot[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({
    x: 12 + rand() * 76,
    y: yMin + rand() * (yMax - yMin),
    rotation: Math.round(rand() * 360),
    scale: 0.7 + rand() * 0.5,
  }));
}

export const BEATS: JarBeat[] = [
  {
    id: "intro",
    progress: [0, 0.1],
    label: "",
    copy: "Curious what's actually inside?",
    fillLevel: 0,
    particleShape: null,
    particleCount: 0,
    tint: "transparent",
    settlePositions: [],
  },
  {
    id: "makhana",
    progress: [0.1, 0.25],
    label: "MAKHANA ✱ 60%",
    copy: "Hand-popped lotus seeds from Mithila, Bihar.",
    fillLevel: 0.35,
    particleShape: "a",
    particleCount: 40,
    tint: "var(--paper-2)",
    settlePositions: spread(40, 11, 66, 96),
  },
  {
    id: "almonds",
    progress: [0.25, 0.38],
    label: "ALMONDS ✱ 12%",
    copy: "For the crunch that fights back.",
    fillLevel: 0.5,
    particleShape: "b",
    particleCount: 12,
    tint: "var(--paper-2)",
    settlePositions: spread(12, 23, 50, 68),
  },
  {
    id: "cashews",
    progress: [0.38, 0.5],
    label: "CASHEWS ✱ 10%",
    copy: "Because we're not monsters.",
    fillLevel: 0.62,
    particleShape: "c",
    particleCount: 10,
    tint: "var(--paper-2)",
    settlePositions: spread(10, 37, 38, 54),
  },
  {
    id: "peanuts",
    progress: [0.5, 0.62],
    label: "PEANUTS ✱ 8%",
    copy: "The reliable one.",
    fillLevel: 0.72,
    particleShape: "a",
    particleCount: 14,
    tint: "var(--paper-2)",
    settlePositions: spread(14, 41, 28, 42),
  },
  {
    id: "seeds",
    progress: [0.62, 0.74],
    label: "SEEDS ✱ 6%",
    copy: "Pumpkin, sunflower, flax. Tiny but loud.",
    fillLevel: 0.82,
    particleShape: "b",
    particleCount: 16,
    tint: "var(--paper-2)",
    settlePositions: spread(16, 53, 16, 32),
  },
  {
    id: "spice",
    progress: [0.74, 0.86],
    label: "MASALA ✱ 4%",
    copy: "The part we won't explain.",
    fillLevel: 0.86,
    particleShape: "dust",
    particleCount: 8,
    tint: "var(--accent-tint)",
    settlePositions: spread(8, 67, 6, 20),
  },
];

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
}

// Total particle sprite budget across the whole sequence, used to enforce
// the "cap total DOM nodes at 140" rule from the spec.
export const TOTAL_PARTICLE_COUNT = BEATS.reduce((sum, b) => sum + b.particleCount, 0);
