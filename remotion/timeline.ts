/**
 * The hero film's timeline, in frames. Everything else in this folder reads
 * from here — there is no second place a beat boundary is written down.
 *
 * The film is 10s at 30fps. Three beats, hard cuts between them, and the
 * last frame is identical to frame 0 so the file loops with no crossfade.
 * See docs/hero-light-rake-plan.md for the design rationale.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;
export const DURATION_IN_FRAMES = 300;

/** A framing of the pack art: uniform scale plus an offset in percent of the
 *  art's own unscaled size. Applied as `scale() translate()`, in that order,
 *  about the art's centre — the same order the CSS prototype used. */
export interface Crop {
  scale: number;
  x: number;
  y: number;
}

export interface Beat {
  name: string;
  /** First frame of the beat, inclusive. */
  from: number;
  /** Number of frames. */
  durationInFrames: number;
  /** Framing at the beat's first frame. */
  fromCrop: Crop;
  /** Framing at the beat's last frame. Within a beat the camera only ever
   *  moves slowly and linearly; a change of framing between beats is a cut. */
  toCrop: Crop;
  /** Bezier control points for the light's pass across this beat. */
  rakeEasing: readonly [number, number, number, number];
}

/**
 * Beat 1 and 2 never show the whole pack. At these scales the Modak
 * letterforms stop reading as a cartoon typeface and become graphic shape,
 * which is the entire reason the crops are this tight.
 */
export const BEATS: readonly Beat[] = [
  {
    name: "type",
    from: 0,
    durationInFrames: 105,
    fromCrop: { scale: 4.3, x: 2.2, y: -33.2 },
    toCrop: { scale: 4.3, x: -2.2, y: -33.2 },
    rakeEasing: [0.4, 0, 0.5, 1],
  },
  {
    name: "wordmark",
    from: 105,
    durationInFrames: 105,
    fromCrop: { scale: 3.62, x: -1.5, y: 36.5 },
    toCrop: { scale: 3.95, x: -1.5, y: 36.5 },
    rakeEasing: [0.4, 0, 0.5, 1],
  },
  {
    name: "wide",
    from: 210,
    durationInFrames: 90,
    fromCrop: { scale: 0.78, x: 0, y: 0 },
    toCrop: { scale: 0.822, x: 0, y: 0 },
    rakeEasing: [0.35, 0, 0.45, 1],
  },
] as const;

/**
 * The beats must tile the composition exactly: no gap, no overlap, and the
 * last one ending on the final frame. A mistake here is invisible in a still
 * and obvious only as a stutter at one cut, which is an expensive way to find
 * a typo — so it is checked once at module load instead.
 */
(function assertBeatsTile() {
  let expected = 0;
  for (const beat of BEATS) {
    if (beat.from !== expected) {
      throw new Error(
        `Beat "${beat.name}" starts at frame ${beat.from}, expected ${expected}.`,
      );
    }
    expected += beat.durationInFrames;
  }
  if (expected !== DURATION_IN_FRAMES) {
    throw new Error(`Beats cover ${expected} frames, composition is ${DURATION_IN_FRAMES}.`);
  }
})();

export function beatAt(frame: number): Beat {
  // Clamped rather than modulo'd: Remotion never asks for a frame outside the
  // composition, and a silent wrap would hide a timeline bug rather than show it.
  for (let i = BEATS.length - 1; i >= 0; i--) {
    if (frame >= BEATS[i].from) return BEATS[i];
  }
  return BEATS[0];
}

/** The hairline rule under the pack. Beat 3 only. */
export const RULE = {
  drawFrom: 212,
  drawTo: 246,
  fadeFrom: 291,
  fadeTo: 300,
  opacity: 0.55,
} as const;

/**
 * Exposure steps. Four copies of the same art at four brightnesses; the masks
 * below decide which one you see where. Posterised falloff in three steps,
 * never a blend, so the page keeps its promise of no visible gradients.
 */
export const EXPOSURE = {
  night: [
    "brightness(0.36) saturate(0.8)",
    "brightness(0.66) saturate(0.92)",
    "brightness(1)",
    "brightness(1.14) saturate(1.08)",
  ],
  paper: [
    "saturate(0.22) opacity(0.58)",
    "saturate(0.55) opacity(0.78)",
    "saturate(0.9) opacity(0.95)",
    "saturate(1.06) brightness(1.04)",
  ],
} as const;

/**
 * Band edges as a percentage of the mask image, which is MASK_SIZE wide. At
 * 560% every band is wider than the frame, so at most one hard edge is ever on
 * screen — that is the difference between light passing over the pack and a
 * set of stripes sitting on top of it.
 */
export const MASK_SIZE = 560;
export const MASK_ANGLE = 100;
export const BANDS = [
  [32, 68],
  [41, 59],
  [46.6, 53.4],
] as const;
export const GROUND_BAND = [30, 70] as const;

/** Mask position travel, in percent. Right to left across the frame. */
export const RAKE_FROM = 74;
export const RAKE_TO = 26;

export const GROUND = { night: "#241F19", paper: "#FFF3D6" } as const;
export const BACKDROP = { night: "#14110F", paper: "#FFF8EE" } as const;
export const INK = "#14110F";
export const PAPER = "#FFF8EE";
