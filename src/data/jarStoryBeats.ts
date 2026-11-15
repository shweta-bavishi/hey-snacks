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
  /**
   * The dense, shaded pile baked *behind* this beat's pieces (see
   * scripts/build-jar-assets.py). The animated pieces are the ones pressed
   * against the glass; this is everything further back, darker because less
   * light reaches it. Null when the beat adds no layer.
   */
  backFill: string | null;
}

// The glass interior (the particle field) is 411 x 542 in jar-glass.webp.
// Distances are measured in that real aspect, or the packing would pull
// pieces closer together vertically than across.
const FIELD_ASPECT = 542 / 411;

// How much higher a poured pile sits in the middle than against the glass,
// in percent of the field height. A dead-flat top reads as a cut-away.
const MOUND_RISE = 6;

interface PackOptions {
  count: number;
  seed: number;
  /**
   * Vertical band the *centres* of this ingredient settle into, percent of
   * the field from the top. Mirrors BANDS in scripts/build-jar-assets.py,
   * which bakes the shaded pile behind these pieces: change one, change both.
   */
  yMin: number;
  yMax: number;
  xMin?: number;
  xMax?: number;
  /** One entry means every piece wears the same sprite; more than one cycles. */
  shapes: SpriteKind[];
}

/** Seeded LCG. The jar must look identical on every render and every machine. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const surface = (yMin: number, x: number) => yMin + MOUND_RISE * ((x - 50) / 50) ** 2;

// Mitchell's best-candidate scatter: each new piece tries a dozen spots and
// keeps the one furthest from everything already placed. Pure random clumped
// into piles with bare glass between them; a stratified grid looked
// hand-placed. This gives even cover with no visible pattern, and it is still
// a fixed array, never physics at runtime.
function pack({ count, seed, yMin, yMax, xMin = 12, xMax = 88, shapes }: PackOptions): JarParticleSpot[] {
  const rand = seeded(seed);
  const placed: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    let best = { x: 50, y: yMax };
    let bestDistance = -1;
    for (let c = 0; c < (placed.length ? 12 : 1); c++) {
      const x = xMin + rand() * (xMax - xMin);
      const top = surface(yMin, x);
      const y = top + rand() * (yMax - top);
      const distance = placed.reduce(
        (min, p) => Math.min(min, (x - p.x) ** 2 + ((y - p.y) * FIELD_ASPECT) ** 2),
        Infinity
      );
      if (distance > bestDistance) {
        best = { x, y };
        bestDistance = distance;
      }
    }
    placed.push(best);
  }
  return placed.map(({ x, y }, i) => ({
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    // Nuts lie every which way in a jar, so the photographs spin through the
    // full circle rather than sitting near upright like drawn icons did.
    rotation: Math.round(-180 + rand() * 360),
    scale: Math.round((0.86 + rand() * 0.26) * 100) / 100,
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
// Each band sits just under its beat's `fillLevel` surface (surface y =
// 100 - fillLevel * 100), so a beat's pieces land *on* the pile below them
// rather than hanging above it. Particle counts are the pieces pressed
// against the glass; the baked `backFill` supplies the density behind them,
// which is what keeps the DOM inside the spec's ~140 node budget.
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
    backFill: null,
  },
  {
    id: "makhana",
    progress: [0.1, 0.25],
    name: "Makhana",
    share: "20%",
    copy: "Popped lotus seeds. The crunch everything else sits on.",
    fillLevel: 0.35,
    particleShape: "makhana",
    particleSize: 24,
    particleColor: "var(--seed-makhana-sh)",
    particleCount: 10,
    tint: "var(--paper-2)",
    settlePositions: pack({ count: 10, seed: 11, yMin: 70, yMax: 96, shapes: ["makhana", "makhanaB", "makhanaC"] }),
    backFill: "/jar/fill/makhana.webp",
  },
  {
    id: "almonds",
    progress: [0.25, 0.38],
    name: "Almonds",
    share: "20%",
    copy: "For the crunch that fights back.",
    fillLevel: 0.5,
    particleShape: "almond",
    particleSize: 25,
    particleColor: "var(--nut-almond)",
    particleCount: 7,
    tint: "var(--paper-2)",
    settlePositions: pack({ count: 7, seed: 23, yMin: 55, yMax: 70, shapes: ["almond", "almondB"] }),
    backFill: "/jar/fill/almond.webp",
  },
  {
    id: "cashews",
    progress: [0.38, 0.5],
    name: "Cashews",
    share: "20%",
    copy: "Because we're not monsters.",
    fillLevel: 0.62,
    particleShape: "cashew",
    particleSize: 25,
    particleColor: "var(--nut-cashew-sh)",
    particleCount: 7,
    tint: "var(--paper-2)",
    settlePositions: pack({ count: 7, seed: 37, yMin: 43, yMax: 56, shapes: ["cashew", "cashewB"] }),
    backFill: "/jar/fill/cashew.webp",
  },
  {
    id: "peanuts",
    progress: [0.5, 0.62],
    name: "Peanuts",
    share: "30%",
    copy: "The reliable one.",
    fillLevel: 0.72,
    particleShape: "peanut",
    particleSize: 21,
    particleColor: "var(--nut-peanut-sh)",
    particleCount: 9,
    tint: "var(--paper-2)",
    settlePositions: pack({ count: 9, seed: 41, yMin: 32, yMax: 45, shapes: ["peanut"] }),
    backFill: "/jar/fill/peanut.webp",
  },
  {
    id: "seeds",
    progress: [0.62, 0.74],
    name: "Seeds",
    share: "9%",
    copy: "Pumpkin, sunflower, flax. Tiny but loud.",
    fillLevel: 0.82,
    particleShape: "seed",
    particleSize: 15,
    particleColor: "var(--seed-pumpkin-sh)",
    particleCount: 12,
    tint: "var(--paper-2)",
    // Alternating the two husks is what stops this beat reading as one shape
    // stamped over and over — the copy says "pumpkin, sunflower", so the
    // picture had better show both.
    settlePositions: pack({ count: 12, seed: 53, yMin: 22, yMax: 33, shapes: ["seed", "seedStripe"] }),
    backFill: "/jar/fill/seed.webp",
  },
  {
    id: "spice",
    progress: [0.74, 0.86],
    name: "Masala",
    share: "1%",
    copy: "The part we won't explain.",
    fillLevel: 0.86,
    particleShape: "dust",
    particleSize: 16,
    particleColor: "var(--accent)",
    particleCount: 6,
    tint: "var(--accent-tint)",
    // A few flakes land on top of the pile; the rest of the beat is the
    // powder cloud (MASALA_CLOUD). The shake then works all of it into the
    // coating, so these pieces dissolve rather than getting mixed in.
    settlePositions: pack({ count: 6, seed: 67, yMin: 16, yMax: 22, xMin: 20, xMax: 80, shapes: ["dust"] }),
    backFill: null,
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
  /** How far the jar comes up off the counter while it is being shaken. */
  liftPx: 12,
  oscillations: 6,
  durationMs: 900,
};

/** The whole pile after the shake: every kind shuffled together and coated. */
export const MIXED_BACK_FILL = "/jar/fill/mixed.webp";

/** Loose powder that drifts into the jar during the masala beat. */
export const MASALA_CLOUD = "/jar/masala-cloud.webp";

/** Sprite kinds the shake turns into coating instead of mixing in. */
const DISSOLVES_IN_MIX: ReadonlySet<SpriteKind> = new Set<SpriteKind>(["dust"]);

export interface JarParticle {
  key: string;
  beat: JarBeat;
  /** Where the piece lands when its beat pours in (layered, pre-shake). */
  spot: JarParticleSpot;
  /** Where the shake leaves it. Null for masala flakes, which dissolve into the coating. */
  mixed: JarParticleSpot | null;
}

// After the shake every piece gets a fresh slot from one even scatter across
// the whole fill, handed out in shuffled order, so makhana from the bottom can
// surface at the top and seeds sink to the base: a mix, not the old layers
// nudged about. Fixed seed, so the static fallback shows the same final jar.
function buildParticles(): JarParticle[] {
  const layered = BEATS.flatMap((beat) =>
    beat.settlePositions.map((spot, i) => ({ key: `${beat.id}-${i}`, beat, spot }))
  );
  const mixers = layered.filter((p) => !DISSOLVES_IN_MIX.has(p.spot.shape));
  const slots = pack({ count: mixers.length, seed: 89, yMin: 17, yMax: 96, shapes: ["makhana"] });

  const rand = seeded(97);
  const order = mixers.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const mixedByKey = new Map(
    mixers.map((p, i) => {
      const slot = slots[order[i]];
      return [p.key, { ...slot, shape: p.spot.shape }] as const;
    })
  );

  return layered.map((p) => ({ ...p, mixed: mixedByKey.get(p.key) ?? null }));
}

export const JAR_PARTICLES: JarParticle[] = buildParticles();

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
 * the stage at ~140 DOM nodes; each particle is a wrapper plus one <img>
 * (its masala coat is a pseudo-element, not a node), plus one image per
 * baked back layer and the powder cloud.
 */
export const TOTAL_PARTICLE_COUNT = BEATS.reduce((sum, b) => sum + b.particleCount, 0);
