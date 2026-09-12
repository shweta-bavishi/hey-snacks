import { HTMLAttributes, ReactNode } from "react";
import styles from "./stamp.module.css";

export type StampVariant = "sold-out" | "coming-soon" | "limited" | "new";

const DEFAULT_LABEL: Record<StampVariant, string> = {
  "sold-out": "Sold out",
  "coming-soon": "Coming soon",
  limited: "Limited",
  new: "New",
};

// Screen-reader context so the mark reads as a fact about the product
// ("Availability: sold out"), not a bare fragment of caps text.
const ANNOUNCE_PREFIX: Record<StampVariant, string> = {
  "sold-out": "Availability: ",
  "coming-soon": "Availability: ",
  limited: "Availability: ",
  new: "Availability: ",
};

export interface StampProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  variant?: StampVariant;
  /** Overrides the default caps label for the variant. */
  children?: ReactNode;
  /** Degrees. Negative tilts counter-clockwise. */
  rotation?: number;
  /**
   * Plays a single 200ms shake when an ancestor carrying `stampHoverGroup`
   * (exported below) is hovered. Set false to disable entirely.
   */
  jitter?: boolean;
  className?: string;
}

// Applied to whatever wraps the Stamp (usually the product image container)
// so `.stamp:hover` can't be used directly — the stamp itself isn't what's
// hovered, the card around it is.
export const stampHoverGroup = styles.hoverGroup;

export function Stamp({
  variant = "sold-out",
  children,
  rotation = -12,
  jitter = true,
  className,
  style,
  ...rest
}: StampProps) {
  const label = children ?? DEFAULT_LABEL[variant];

  return (
    <span
      {...rest}
      data-variant={variant}
      className={[styles.stamp, jitter ? styles.jitterEnabled : "", className].filter(Boolean).join(" ")}
      style={{ ...style, "--stamp-rotation": `${rotation}deg` } as React.CSSProperties}
    >
      {/* Not decorative: availability is meaningful product information. */}
      <span className={styles.srPrefix}>{ANNOUNCE_PREFIX[variant]}</span>
      {label}
    </span>
  );
}
