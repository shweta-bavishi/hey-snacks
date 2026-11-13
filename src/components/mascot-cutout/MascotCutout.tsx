import type { MascotFlavour } from "@/components/mascot-avatar/MascotAvatar";
import styles from "./mascot-cutout.module.css";

export type MascotCutoutExpression = "default" | "happy";

interface MascotCutoutProps {
  /** Flavour identity. Drives which cutout art loads. */
  flavour: MascotFlavour;
  expression?: MascotCutoutExpression;
  /**
   * Rendered height in px; width follows automatically from the art's
   * native 3:4 (1200×1600) aspect ratio. There is no `size` union like
   * `MascotAvatar` — a cutout is used at whatever height a layout calls
   * for (a hero edge-peek, a comic panel, a flavour column), not from a
   * fixed small set of chrome sizes.
   */
  height?: number;
  /**
   * Same idle-loop contract as `MascotAvatar`: opt in here, but it only
   * plays while an ancestor carrying `.mascotHoverScope` (see
   * mascot-avatar.module.css) is hovered or focus-within.
   */
  animateIdle?: boolean;
  /**
   * Set only when this cutout is the sole identifier of who/what it
   * represents. Leave unset — the image renders with an empty `alt`,
   * which is the standard way to mark a decorative `<img>` — when it
   * sits next to text that already names the same flavour.
   */
  alt?: string;
  className?: string;
}

/**
 * Full-body art, uncropped, bottom-anchored — the counterpart to
 * `MascotAvatar`'s bust crop. Two components because they're two
 * different jobs: a bust fills a bordered circle at chrome sizes (header,
 * tabs, palette rows); a cutout stands in a scene (hero edge-peek, a
 * comic panel) with nothing hiding its feet.
 *
 * Rendered as a plain `<img>`, not `next/image` — these are small,
 * unoptimized local SVGs with a variable rendered size driven by layout,
 * not a fixed responsive `width`/`height`, so next/image's optimizer buys
 * nothing here (same reasoning `MascotAvatar` follows in using a CSS
 * background-image instead of `next/image`).
 */
export function MascotCutout({
  flavour,
  expression = "default",
  height = 160,
  animateIdle = false,
  alt,
  className,
}: MascotCutoutProps) {
  const src = `/mascots/cutout/${flavour}-${expression}.svg`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local unoptimized SVG, see doc comment above
    <img
      src={src}
      alt={alt ?? ""}
      draggable={false}
      data-idle={animateIdle ? "true" : undefined}
      className={[styles.cutout, className].filter(Boolean).join(" ")}
      style={{ height, width: "auto" }}
    />
  );
}
