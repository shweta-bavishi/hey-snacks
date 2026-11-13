import { MASK_ANGLE, MASK_SIZE } from "../timeline";

/**
 * A hard-stopped band mask. Both colour stops sit at the same position on each
 * edge, so the band has no falloff of its own — the posterised look comes from
 * stacking three of these at different widths, not from blending any one of
 * them. Nothing here produces a visible gradient fill.
 */
export function bandMask([start, end]: readonly [number, number]): string {
  return `linear-gradient(${MASK_ANGLE}deg, transparent 0 ${start}%, #000 ${start}% ${end}%, transparent ${end}% 100%)`;
}

/** Shorthand for the mask properties every raked layer shares. */
export function maskStyle(
  band: readonly [number, number],
  positionPercent: number,
): React.CSSProperties {
  const image = bandMask(band);
  const size = `${MASK_SIZE}% 100%`;
  const position = `${positionPercent}% 0`;
  return {
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: size,
    WebkitMaskSize: size,
    maskPosition: position,
    WebkitMaskPosition: position,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
}
