import React from "react";
import {
  IngredientSprite,
  SpriteKind,
} from "../../src/components/jar-story/ingredientSprites";

/**
 * The mix, mid-air. This is the beat that says "here is what is actually in
 * the bag", so the on-screen proportions are the product's stated composition
 * (makhana 20 / almonds 20 / cashews 20 / peanuts 30 / seeds 9 / masala 1)
 * rather than whatever looked balanced — see src/data/jarStoryBeats.ts.
 */
const RECIPE: readonly { kind: SpriteKind; n: number }[] = [
  { kind: "peanut", n: 5 },
  { kind: "makhana", n: 4 },
  { kind: "almond", n: 3 },
  { kind: "cashew", n: 3 },
  { kind: "seed", n: 2 },
  { kind: "seedStripe", n: 1 },
];

/** Deterministic PRNG. Renders must be byte-identical across machines. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Piece {
  kind: SpriteKind;
  /** Resting position in the suspend beat, percent of frame. */
  x: number;
  y: number;
  /** Unit vector out of the pack mouth, for the burst beat. */
  dx: number;
  dy: number;
  size: number;
  rot: number;
  spin: number;
  mirror: boolean;
  /** Staggers launch so the burst is not one synchronised wall of nuts. */
  delay: number;
  drift: number;
}

/**
 * Where the mix leaves the bag, percent of frame. This sits on the pack's top
 * edge, not on its face — launching from the centre sends pieces sailing
 * across the wordmark and the mascot roundel, which reads as the bag bursting
 * open rather than being poured from.
 */
export const MOUTH = { x: 50, y: 45 } as const;

/**
 * Pieces are laid out on a ring rather than at random. A random scatter reads
 * as confetti; a composed arrangement with jitter reads as art direction, and
 * that difference is most of what separates this from a cartoon.
 */
export function buildMix(seed = 7): Piece[] {
  const rand = mulberry32(seed);
  const kinds = RECIPE.flatMap(({ kind, n }) => Array<SpriteKind>(n).fill(kind));
  const total = kinds.length;

  return kinds.map((kind, i) => {
    // Golden-angle stepping keeps neighbours from clumping by kind.
    const angle = (i * 137.508 + rand() * 26) * (Math.PI / 180);
    // Inner bound clears the pack silhouette so nothing sits flat on the
    // artwork like a sticker; outer bound keeps the ring off the frame edge
    // and out of the corners, which is what stops it reading as confetti.
    const radius = 28 + rand() * 10;
    const small = kind === "seed" || kind === "seedStripe";
    return {
      kind,
      x: 50 + Math.cos(angle) * radius * 1.2,
      y: 46 + Math.sin(angle) * radius * 0.92,
      // Launch is an even upward fan, independent of where the piece later
      // rests. Every piece clears the top of frame; none travels downward
      // into the pack it just came out of.
      ...(() => {
        const fan = ((-158 + (i / (total - 1)) * 136 + (rand() - 0.5) * 12) * Math.PI) / 180;
        return { dx: Math.cos(fan), dy: Math.sin(fan) };
      })(),
      size: (small ? 3.1 : 5.2) + rand() * (small ? 0.9 : 1.9),
      rot: rand() * 360,
      spin: (rand() - 0.5) * 2,
      mirror: rand() < 0.5,
      delay: (i / total) * 0.4 + rand() * 0.06,
      drift: 0.6 + rand() * 0.8,
    };
  });
}

interface MixFieldProps {
  pieces: Piece[];
  /**
   * "burst": pieces leave the mouth and exit frame.
   * "suspend": pieces hold their ring, moving only a few pixels.
   */
  phase: "burst" | "suspend";
  /** 0-1 through the current phase. */
  progress: number;
  /** Frame-level scale so the mix tracks the pack's crop. */
  scale: number;
}

export const MixField: React.FC<MixFieldProps> = ({ pieces, phase, progress, scale }) => (
  <>
    {pieces.map((p, i) => {
      let x: number;
      let y: number;
      let rot: number;
      let opacity = 1;

      if (phase === "burst") {
        const t = Math.max(0, (progress - p.delay) / (1 - p.delay));
        // Decelerating, so pieces are still airborne and slowing as the beat
        // ends and we cut on motion. This is the one place real physics is
        // welcome: a piece losing speed near the top of its arc is believable,
        // where a bounce or an overshoot would read as cartoon.
        const travel = (1 - (1 - t) * (1 - t)) * 62;
        x = MOUTH.x + p.dx * travel;
        y = MOUTH.y + p.dy * travel;
        rot = p.rot + p.spin * t * 46;
        opacity = t <= 0 ? 0 : 1;
      } else {
        // Near-frozen. Three seconds of this moves a piece about four pixels,
        // which is what makes it read as suspended rather than floating.
        const sway = Math.sin(progress * Math.PI * 2 + i) * p.drift;
        x = p.x + sway * 0.18;
        y = p.y + sway * 0.3 - progress * 0.5;
        rot = p.rot + p.spin * progress * 5;
      }

      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: `${p.size * scale}%`,
            opacity,
            transform: `translate(-50%, -50%) rotate(${rot}deg)`,
          }}
        >
          <IngredientSprite kind={p.kind} mirror={p.mirror} />
        </div>
      );
    })}
  </>
);
