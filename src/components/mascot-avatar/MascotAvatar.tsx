import styles from "./mascot-avatar.module.css";

export type MascotFlavour = "pataka" | "malai" | "jaadu" | "pehelwan";
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
 * One master illustration per flavour/expression, authored at a single
 * fixed frame (a 1:1 square, mascot centred, head at the top third). Each
 * size then crops into *that same bitmap* with a different background-size
 * (zoom) and background-position (pan) — no per-size export, no four SVGs.
 * SIZE_FRAMES below is the crop table; see the CSS file for how it's
 * applied. Swap in real per-mascot values once the illustrator delivers
 * final art — these are tuned for a mascot whose head occupies roughly the
 * top 40% of the master frame.
 */
const SIZE_FRAMES: Record<MascotSize, { zoom: number; panY: number }> = {
  // Illegible at this size if we show anything below the neck — zoom in
  // tight on the head only.
  20: { zoom: 260, panY: 12 },
  32: { zoom: 220, panY: 15 },
  // Wider frame starts including shoulders as the canvas grows.
  56: { zoom: 165, panY: 22 },
  88: { zoom: 130, panY: 28 },
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
  const src = `/mascots/${flavour}-${expression}.png`;

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
