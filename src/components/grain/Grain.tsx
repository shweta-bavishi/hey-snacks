import styles from "./grain.module.css";

export type GrainIntensity = "subtle" | "default" | "heavy";

interface GrainProps {
  /** Strength of the noise. Bump to 'heavy' inside a coloured panel that reads too flat. */
  intensity?: GrainIntensity;
  /**
   * 'fixed' covers the viewport once (the global overlay). 'panel' is
   * absolutely positioned so it can be dropped inside a `position: relative`
   * coloured section that wants extra texture on top of the global grain.
   */
  scope?: "fixed" | "panel";
  className?: string;
}

// feTurbulence fractal noise, colour-matrixed to flat ink so opacity alone
// controls strength. Tiled at 200x200 — no image file, no network request.
const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
      `<filter id='n'>` +
      `<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>` +
      `<feColorMatrix type='matrix' values='0 0 0 0 0.078  0 0 0 0 0.067  0 0 0 0 0.059  0 0 0 1 0'/>` +
      `</filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/>` +
      `</svg>`
  );

export function Grain({ intensity = "default", scope = "fixed", className }: GrainProps) {
  return (
    <div
      aria-hidden="true"
      className={[styles.grain, styles[scope], styles[intensity], className]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundImage: `url("${NOISE_SVG}")` }}
    />
  );
}
