import styles from "./jar-story.module.css";

// One drawn ingredient per kind, in the house style: flat ink outline, flat
// colour planes (base + shade + highlight, hard edges, no gradient) and a
// pass of etched linework for grain, seam and shell texture. The point of
// the linework is that an almond has to read as an *almond* at 40px inside a
// jar, not as a brown blob — that is what separates this from a silhouette.
//
// Delivery mechanism: the artwork is declared once, in a hidden <defs> sheet
// (`IngredientSpriteSheet`), and every instance is a two-node `<svg><use/></svg>`.
// Inlining the full art per particle would cost ~7 nodes each and blow the
// DOM budget from the spec; a CSS mask (what this file used to do) is a
// single node but only carries alpha, so it can't hold more than one colour.
// `<use>` is the only option that keeps both the node count and the tones.
//
// Colours are pantry tokens (see tokens.css) referenced as `var(--…)`. That
// works because same-document `<use>` content inherits custom properties from
// the referencing element, so a sprite recolours with the theme for free.

export type SpriteKind =
  | "makhana"
  | "almond"
  | "cashew"
  | "peanut"
  | "seed"
  | "seedStripe"
  | "dust";

export const SPRITE_KINDS: SpriteKind[] = [
  "makhana",
  "almond",
  "cashew",
  "peanut",
  "seed",
  "seedStripe",
  "dust",
];

/** DOM id of the clip that trims the particle field to the glass interior. */
export const JAR_FIELD_CLIP_ID = "hey-jar-field-clip";

/** DOM id of each sprite's <g> in the sheet. Namespaced so it can't collide. */
export const SPRITE_IDS: Record<SpriteKind, string> = {
  makhana: "hey-ing-makhana",
  almond: "hey-ing-almond",
  cashew: "hey-ing-cashew",
  peanut: "hey-ing-peanut",
  seed: "hey-ing-seed",
  seedStripe: "hey-ing-seed-stripe",
  dust: "hey-ing-dust",
};

// Everything below is drawn in a 48x48 box. Outline weights are baked in
// rather than scaled per instance: the seeds and the masala flakes carry a
// slightly heavier line because they render at roughly half the size of the
// nuts, which keeps the *visual* line weight even across the whole jar.
const OUTLINE = 2.2;
const HAIR = 1.15;
const OUTLINE_SM = 2.6;

const ART: Record<SpriteKind, React.ReactNode> = {
  // Popped lotus seed: irregular puffed body, wrinkle lines where the shell
  // split, and the dark hilum speck at the base where it was attached.
  makhana: (
    <>
      <path
        d="M24.4 3.4 C31.8 2.4 39.4 7.4 41.2 14.8 C42.4 19.8 40.6 23.4 41.8 28.6 C43.2 34.8 38.4 42.6 30.6 43.8 C25.8 44.6 22.4 42.8 18 43.6 C11 44.8 4.8 39.4 5.2 32.2 C5.4 27.4 8 24.6 7.2 19.8 C6 12.6 11.8 5.6 18.4 4.4 C20.6 4 22 3.7 24.4 3.4 Z"
        fill="var(--seed-makhana)"
        stroke="var(--ink)"
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <path
        d="M34.6 6.6 C38 8.8 40.4 11.6 41.2 14.8 C42.4 19.8 40.6 23.4 41.8 28.6 C43.2 34.8 38.4 42.6 30.6 43.8 C27.2 44.4 24.4 43.2 21.2 43 C26.8 40.8 32 39.4 35 34.8 C39 28.6 38.4 18.4 34.6 11 C34.2 9.4 34.2 8 34.6 6.6 Z"
        fill="var(--seed-makhana-sh)"
      />
      <path d="M18.6 7 C14 9.2 10.8 13.2 10 18 C9.2 12.4 13 7.8 18.6 7 Z" fill="var(--paper)" />
      <path
        d="M20.6 8.6 C17.4 15.4 16.4 23.6 17.8 31.4 M26.8 9.4 C29.6 16.6 30.2 24.8 28.4 32.4 M23.4 7.8 C22.4 15 22.4 24 23.8 32.8"
        fill="none"
        stroke="var(--ink)"
        strokeWidth={HAIR}
        strokeLinecap="round"
        opacity="0.34"
      />
      <ellipse cx="16.6" cy="40" rx="2.6" ry="1.9" transform="rotate(24 16.6 40)" fill="var(--seed-makhana-hilum)" />
    </>
  ),

  // Skin-on almond: pointed apex, broad base, centre seam plus the long
  // grain striations that run from base to tip.
  almond: (
    <>
      <path
        d="M24.5 3 C30.8 9.6 36.9 18.3 37.1 28.2 C37.3 37.6 31.4 45 24 45 C16.6 45 10.7 37.6 10.9 28.2 C11.1 18.3 18.2 9.6 24.5 3 Z"
        fill="var(--nut-almond)"
        stroke="var(--ink)"
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <path
        d="M27.2 6.2 C32.4 12.4 36.9 19.8 37.1 28.2 C37.3 37.6 31.4 45 24 45 C28.9 41 31.9 34.4 31.5 27 C31.1 19.2 29.4 12.1 27.2 6.2 Z"
        fill="var(--nut-almond-sh)"
      />
      <path d="M21.6 8.4 C18.2 13.6 15.6 19.6 15.2 26.4 C14.6 20.2 16.8 13.4 21.6 8.4 Z" fill="var(--nut-almond-hi)" />
      <path
        d="M22.6 10.5 C19.9 18.6 19 27.4 20.1 36.4 M17.4 38.6 C18.4 32.4 18.2 24.6 19.6 17.6 M27.4 39.2 C25.9 32.6 25.4 24.8 26.2 17.8 M15.6 33.8 C16.2 29 16.4 24.4 17.4 20"
        fill="none"
        stroke="var(--ink)"
        strokeWidth={HAIR}
        strokeLinecap="round"
        opacity="0.62"
      />
    </>
  ),

  // Cashew: chunky kidney with a shallow inner curve — deep enough to read
  // as a cashew, not so deep it turns into a crescent moon.
  cashew: (
    <>
      <path
        d="M11 14 C17 6 30 3 37.5 9.5 C44 15.5 44 30 37 38 C32.5 43.5 26 46 22.5 43 C26.6 39.4 28.6 33.6 28 27.4 C27.2 20 20.4 16 11 14 Z"
        fill="var(--nut-cashew)"
        stroke="var(--ink)"
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <path
        d="M38.4 15.4 C41.6 22 40.4 31.8 35 37.4 C31 41.8 26 44.4 22.6 42.8 C26 39.4 28 34 27.8 28.2 C32 30.6 36.6 24.8 38.4 15.4 Z"
        fill="var(--nut-cashew-sh)"
      />
      <path d="M13.4 12.6 C19.4 6 29.8 4 36.2 9.2 C30 6.6 21.4 8.2 16.6 14 Z" fill="var(--paper-2)" />
      <path
        d="M30.4 10.6 C36 16 37.2 23.8 34.6 31.6 M17.6 16.4 C22.8 19.2 25.8 23 26.6 27.6"
        fill="none"
        stroke="var(--ink)"
        strokeWidth={HAIR}
        strokeLinecap="round"
        opacity="0.42"
      />
    </>
  ),

  // Shelled peanut kernel: a single smooth oval body, no pinched-waist
  // shell silhouette and no shell cross-veins — just the two cotyledon
  // halves (the central seam) and the fine grain lines a bare kernel
  // actually has, in the same register as the almond's striations above.
  peanut: (
    <>
      <path
        d="M24 4.4 C31.4 4.4 36.8 11.2 37.4 20.4 C38 30.2 33.6 43.6 24 43.6 C14.4 43.6 10 30.2 10.6 20.4 C11.2 11.2 16.6 4.4 24 4.4 Z"
        fill="var(--nut-peanut)"
        stroke="var(--ink)"
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <path
        d="M27 5.6 C32.6 8.8 36.8 14.6 37.4 20.4 C38 30.2 33.6 43.6 24 43.6 C29 39.6 32 32.4 31.6 24 C31.2 16.2 29.6 10.2 27 5.6 Z"
        fill="var(--nut-peanut-sh)"
      />
      <path d="M17.6 7.4 C14.4 10.6 12.4 15 12 20 C11 14.6 13.4 9.6 17.6 7.4 Z" fill="var(--paper-2)" />
      <path
        d="M24 6.6 L24 41.4 M18.8 12.2 C17.6 19.6 17.6 27.4 18.8 35.2 M29.2 12.2 C30.4 19.6 30.4 27.4 29.2 35.2"
        fill="none"
        stroke="var(--ink)"
        strokeWidth={HAIR}
        strokeLinecap="round"
        opacity="0.4"
      />
    </>
  ),

  // Pumpkin seed: flat teardrop with the raised rim that makes it instantly
  // identifiable next to the sunflower seed below.
  seed: (
    <>
      <path
        d="M24 3.6 C31.4 6.4 36.4 14.6 35.2 24.4 C34 34.8 29.6 44 24 44 C18.4 44 14 34.8 12.8 24.4 C11.6 14.6 16.6 6.4 24 3.6 Z"
        fill="var(--seed-pumpkin)"
        stroke="var(--ink)"
        strokeWidth={OUTLINE_SM}
        strokeLinejoin="round"
      />
      <path
        d="M27.6 5.4 C33 9.4 36.1 16.4 35.2 24.4 C34 34.8 29.6 44 24 44 C28.4 39.2 30.8 31.4 30.8 23.4 C30.8 16 29.6 10 27.6 5.4 Z"
        fill="var(--seed-pumpkin-sh)"
        opacity="0.55"
      />
      <path
        d="M24 8.6 C29.8 11.2 32.8 17.6 31.8 25 C30.8 33 27.6 39.6 24 39.6 C20.4 39.6 17.2 33 16.2 25 C15.2 17.6 18.2 11.2 24 8.6 Z"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </>
  ),

  // Sunflower seed: dark husk with the pale stripes.
  seedStripe: (
    <>
      <path
        d="M24 3.4 C30.6 7 34.4 15.6 33.4 25.2 C32.5 34.2 28.8 44.4 24 44.4 C19.2 44.4 15.5 34.2 14.6 25.2 C13.6 15.6 17.4 7 24 3.4 Z"
        fill="var(--seed-sunflower)"
        stroke="var(--ink)"
        strokeWidth={OUTLINE_SM}
        strokeLinejoin="round"
      />
      <path
        d="M19.4 9.4 C17.6 16.4 17.4 26.4 19 36 M24.6 8 C24 16.4 24.2 27.6 25.4 37.6 M29.4 10.4 C30.6 17.4 30.4 26.6 29 35.4"
        fill="none"
        stroke="var(--seed-sunflower-hi)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </>
  ),

  // Masala: not a ball of dust but crushed spice — angular chilli and
  // chaat-masala flakes with loose turmeric powder around them.
  dust: (
    <>
      <path
        d="M9 17.4 L16.4 12 L21.6 16.6 L18.2 25 L10.4 26.2 Z"
        fill="var(--masala-chilli)"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M27 8.6 L35.4 10 L37 17.4 L30.6 20.6 L25.6 15 Z"
        fill="var(--masala-lal)"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 29.4 L27.8 27.8 L31.4 34 L26 39.8 L19 36.8 Z"
        fill="var(--masala-mirch)"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M35 27 L40.4 29 L38.6 34.6 L33.6 33 Z"
        fill="var(--masala-turmeric)"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="23.6" cy="21.8" r="1.7" fill="var(--masala-turmeric)" />
      <circle cx="12.4" cy="33.4" r="1.5" fill="var(--masala-lal)" />
      <circle cx="30.6" cy="43" r="1.3" fill="var(--masala-chilli)" />
      <circle cx="40.2" cy="21" r="1.3" fill="var(--masala-mirch)" />
      <circle cx="20.6" cy="6.4" r="1.2" fill="var(--masala-turmeric)" />
      <circle cx="6.4" cy="10.6" r="1.1" fill="var(--masala-chilli)" />
    </>
  ),
};

/**
 * The hidden artwork sheet. Render exactly once per document — `JarStory`
 * does it — then any number of `IngredientSprite`s can point at it.
 */
export function IngredientSpriteSheet() {
  return (
    <svg aria-hidden="true" focusable="false" className={styles.spriteSheet} width="0" height="0">
      <defs>
        {SPRITE_KINDS.map((kind) => (
          <g key={kind} id={SPRITE_IDS[kind]}>
            {ART[kind]}
          </g>
        ))}
        {/* The glass interior, traced in normalised units so CSS can clip the
            particle field to it at any jar size. A piece that overlaps a wall
            then gets cut off by the glass, the way it would in a real jar,
            instead of hanging outside the drawing. Kept in sync with INNER in
            JarIllustration and the .particleField insets. */}
        <clipPath id={JAR_FIELD_CLIP_ID} clipPathUnits="objectBoundingBox">
          <path d="M0.132 0 L0.868 0 L1 0.178 L1 0.888 C1 0.95 0.9 1 0.794 1 L0.206 1 C0.1 1 0 0.95 0 0.888 L0 0.178 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

interface IngredientSpriteProps {
  kind: SpriteKind;
  /** Rendered width/height in px. Omit to fill the parent box instead. */
  size?: number;
  /**
   * Flip horizontally. The shade plane moves to the other side with it, so
   * a mirrored almond reads as a genuinely different nut rather than a
   * copy-paste — cheaper than drawing a second outline for every kind.
   */
  mirror?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** One drawn ingredient. Two DOM nodes: the <svg> box and the <use> clone. */
export function IngredientSprite({ kind, size, mirror, className, style }: IngredientSpriteProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`#${SPRITE_IDS[kind]}`} transform={mirror ? "translate(48 0) scale(-1 1)" : undefined} />
    </svg>
  );
}
