import { HTMLAttributes } from "react";
import styles from "./heat-meter.module.css";

export type HeatMeterSize = "sm" | "md";
export type HeatMeterGlyph = "heat" | "crunch";

type SharedProps = {
  /** Filled squares out of `max`. */
  value: 1 | 2 | 3 | 4 | 5;
  max?: number;
  size?: HeatMeterSize;
  /** Show the mono-caps word ("HEAT" / "CRUNCH") before the squares. */
  label?: boolean;
  /** Swaps the filled glyph so heat and crunch are never confused at a glance. */
  glyph?: HeatMeterGlyph;
  className?: string;
};

export type HeatMeterProps = SharedProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof SharedProps>;

const GLYPH_WORD: Record<HeatMeterGlyph, string> = {
  heat: "Heat",
  crunch: "Crunch",
};

export function HeatMeter({
  value,
  max = 5,
  size = "md",
  label = false,
  glyph = "heat",
  className,
  ...rest
}: HeatMeterProps) {
  const word = GLYPH_WORD[glyph];
  const ariaLabel = `${word} level ${value} out of ${max}`;

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={[styles.meter, styles[size], className].filter(Boolean).join(" ")}
      {...rest}
    >
      {label ? <span className={styles.word}>{word}</span> : null}
      <span className={styles.squares} aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={[styles.square, i < value ? styles.filled : "", glyph === "crunch" ? styles.crunch : ""]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </span>
    </span>
  );
}
