import styles from "./mascot-avatar.module.css";

export type MascotFlavour = "pataka" | "malai" | "dadi" | "pehelwan";
export type MascotSize = 20 | 32 | 56 | 88;
export type MascotExpression = "default" | "happy" | "idle";

interface MascotAvatarProps {
  /** Flavour identity. Drives the ink border's tint background and the source art. */
  flavour: MascotFlavour;
  size?: MascotSize;
  expression?: MascotExpression;
  /**
   * Enables the idle loop (blink/bounce). Off by default — a wall of
   * looping mascots is a wall of nausea. Even when true, the loop only
   * plays while an ancestor carrying `.mascotHoverScope` is hovered or
   * focus-within; see the module CSS comment for how to wire that up.
   */
  animateIdle?: boolean;
  /**
   * Set only when this avatar is the sole identifier of who/what it
   * represents (e.g. the notify-modal corner, a command-palette row with
   * no adjacent flavour name). Leave unset — the avatar renders
   * aria-hidden — when it sits next to text that already names the same
   * flavour (chip label, comic tab row), since a screen reader would
   * otherwise hear the flavour name twice.
   */
  alt?: string;
  className?: string;
}

/**
 * One master illustration per flavour/expression — a purpose-drawn bust
 * (head + shoulders, 1:1 viewBox, art already fills the frame edge to
 * edge) rather than a crop of the full-body art. Each size still renders
 * through the same background-size (zoom) / background-position (pan)
 * mechanism so a mascot can be nudged per size without a fifth export, but
 * because the source is already correctly framed, every size shares one
 * light, near-1:1 crop — just enough to trim the source's own margin,
 * nowhere near the aggressive zoom a rescue-crop of full-body art needed.
 */
const SIZE_FRAMES: Record<MascotSize, { zoom: number; panY: number }> = {
  20: { zoom: 112, panY: 46 },
  32: { zoom: 110, panY: 46 },
  56: { zoom: 108, panY: 47 },
  88: { zoom: 106, panY: 48 },
};

export function MascotAvatar({
  flavour,
  size = 32,
  expression = "default",
  animateIdle = false,
  alt,
  className,
}: MascotAvatarProps) {
  const frame = SIZE_FRAMES[size];
  const src = `/mascots/bust/${flavour}-${expression}.svg`;

  return (
    <span
      className={[styles.avatar, className].filter(Boolean).join(" ")}
      data-flavour={flavour}
      data-idle={animateIdle ? "true" : undefined}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : "true"}
      style={
        {
          width: size,
          height: size,
          "--mascot-src": `url(${src})`,
          "--mascot-zoom": `${frame.zoom}%`,
          "--mascot-pan-y": `${frame.panY}%`,
        } as React.CSSProperties
      }
    >
      <span className={styles.art} />
    </span>
  );
}
