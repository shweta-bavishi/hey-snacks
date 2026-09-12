import { CSSProperties, ReactNode } from "react";
import { Pill, PillTone } from "@/components/pill/Pill";
import { SWOOSH_PATHS, SwooshVariant } from "./swooshes";
import styles from "./section-heading.module.css";

export type SectionHeadingAlign = "left" | "center";
export type SectionHeadingLevel = 1 | 2 | 3 | 4;

export interface SectionHeadingProps {
  /** The headline copy. */
  children: ReactNode;
  /** Small Pill label above the headline, e.g. "05 // flavours". */
  eyebrow?: ReactNode;
  eyebrowTone?: PillTone;
  /** Supporting paragraph under the headline. */
  lede?: ReactNode;
  align?: SectionHeadingAlign;
  /**
   * Semantic heading level for document outline (h1-h4). Independent of
   * visual size — a page can only have one true h1, but a later section
   * still wants h1-scale type. Use `size` to set the look.
   */
  level?: SectionHeadingLevel;
  /** Visual size, defaults to matching `level` but can be set separately. */
  size?: SectionHeadingLevel;
  /** Bad-offset-printing duplicate behind the headline. */
  misregister?: boolean;
  /** Colour of the misregister duplicate. Any --token or CSS colour. */
  misregisterColor?: string;
  /** Hand-drawn underline beneath the headline. */
  swoosh?: boolean;
  /** Pick which of the 3 swoosh sketches to draw. Defaults to a stable pick derived from the headline text. */
  swooshVariant?: SwooshVariant;
  swooshColor?: string;
  className?: string;
}

const TAGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4" } as const;

function pickSwooshVariant(children: ReactNode): SwooshVariant {
  const text = typeof children === "string" ? children : "";
  if (!text) return 1;
  const sum = Array.from(text).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return ((sum % 3) + 1) as SwooshVariant;
}

export function SectionHeading({
  children,
  eyebrow,
  eyebrowTone = "accent",
  lede,
  align = "left",
  level = 2,
  size,
  misregister = false,
  misregisterColor,
  swoosh = false,
  swooshVariant,
  swooshColor,
  className,
}: SectionHeadingProps) {
  const Tag = TAGS[level];
  const visualSize = size ?? level;
  const resolvedSwooshVariant = swooshVariant ?? pickSwooshVariant(children);

  const headingStyle: CSSProperties = misregisterColor
    ? ({ "--misregister-color": misregisterColor } as CSSProperties)
    : {};

  const wrapClasses = [styles.wrap, align === "center" ? styles.center : styles.left, className]
    .filter(Boolean)
    .join(" ");

  const headingClasses = [
    styles.heading,
    styles[`size-h${visualSize}`],
    misregister ? styles.misregister : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapClasses}>
      {eyebrow ? (
        <Pill tone={eyebrowTone} glyph className={styles.eyebrow}>
          {eyebrow}
        </Pill>
      ) : null}

      <Tag className={headingClasses} style={headingStyle}>
        {children}
      </Tag>

      {swoosh ? (
        <svg
          className={styles.swoosh}
          viewBox="0 0 280 20"
          fill="none"
          aria-hidden="true"
          style={swooshColor ? { color: swooshColor } : undefined}
        >
          <path
            d={SWOOSH_PATHS[resolvedSwooshVariant - 1]}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ) : null}

      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </div>
  );
}
