import styles from "./makhana-puff.module.css";

export type MakhanaPuffVariant = "default" | "toasted" | "spiced";
export type MakhanaPuffShape = "a" | "b" | "c";

interface MakhanaPuffProps {
  /** Rendered width/height in px. Scales cleanly from 8 to 200. */
  size?: number;
  /** Rotation in degrees, applied around the shape's own centre. */
  rotation?: number;
  /** Fill treatment. 'spiced' adds a red-orange speckle scatter. */
  variant?: MakhanaPuffVariant;
  /**
   * One of three hand-varied blob outlines. Cycle through 'a'/'b'/'c' when
   * scattering multiples so they don't read as copy-pasted.
   */
  shape?: MakhanaPuffShape;
  className?: string;
  /** Only set this when the puff carries real meaning (e.g. a standalone icon-button). */
  label?: string;
}

// Three irregular blob outlines, each a closed cubic-bezier loop — none of
// them a circle, none of them symmetric on any axis.
const SHAPES: Record<MakhanaPuffShape, string> = {
  a: "M20 4 C26 3 33 7 34 14 C35 20 32 24 35 29 C37 33 32 37 25 36 C20 35 18 38 12 36 C6 34 4 29 6 24 C3 20 4 14 8 10 C12 5 15 5 20 4 Z",
  b: "M18 3 C24 2 31 6 33 12 C36 17 33 22 36 27 C38 32 34 37 27 37 C22 38 19 35 13 37 C7 38 3 33 5 27 C2 22 6 18 4 12 C6 6 12 4 18 3 Z",
  c: "M22 4 C28 5 32 10 32 16 C33 22 38 25 35 31 C33 36 27 38 21 36 C16 38 9 37 6 32 C2 27 4 21 7 16 C6 10 11 5 17 4 C19 3 20 4 22 4 Z",
};

// The faint interior line suggesting where the seed popped open — varied
// per shape so it always sits inside that shape's silhouette.
const SEAMS: Record<MakhanaPuffShape, string> = {
  a: "M11 17 Q20 23 29 15",
  b: "M9 16 Q19 24 30 19",
  c: "M10 19 Q20 14 30 22",
};

// Speckle positions for the 'spiced' variant, kept inside every shape's
// silhouette across all three variants.
const SPECKLES: Record<MakhanaPuffShape, { cx: number; cy: number; r: number }[]> = {
  a: [
    { cx: 15, cy: 14, r: 1.6 },
    { cx: 24, cy: 12, r: 1.2 },
    { cx: 26, cy: 26, r: 1.4 },
    { cx: 14, cy: 27, r: 1.1 },
  ],
  b: [
    { cx: 13, cy: 15, r: 1.3 },
    { cx: 25, cy: 11, r: 1.5 },
    { cx: 27, cy: 25, r: 1.2 },
    { cx: 12, cy: 26, r: 1.4 },
  ],
  c: [
    { cx: 14, cy: 13, r: 1.5 },
    { cx: 23, cy: 15, r: 1.1 },
    { cx: 25, cy: 27, r: 1.3 },
    { cx: 13, cy: 25, r: 1.5 },
  ],
};

/**
 * Visual (post-scale) outline thickness in px, easing from 1.5px at 8px up
 * to 3px (the system's --stroke) by 48px, then holding flat. Sqrt easing
 * ramps thickness fast at first so the outline never gets swallowed by the
 * fill at tiny sizes, then levels off so large puffs still read as the
 * standard 3px ink line rather than growing a fat outline.
 */
function targetVisualStroke(size: number) {
  const t = Math.min(Math.max((size - 8) / (48 - 8), 0), 1);
  return 1.5 + 1.5 * Math.sqrt(t);
}

// Convert that visual target into viewBox units (viewBox is fixed at 40x40,
// so viewBox-space stroke-width must grow as rendered size shrinks).
function viewBoxStrokeWidth(size: number) {
  const visual = targetVisualStroke(size);
  return (visual * 40) / size;
}

export function MakhanaPuff({
  size = 40,
  rotation = 0,
  variant = "default",
  shape = "a",
  className,
  label,
}: MakhanaPuffProps) {
  const strokeWidth = viewBoxStrokeWidth(size);

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={[styles.puff, className].filter(Boolean).join(" ")}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <path
        d={SHAPES[shape]}
        className={[styles.fill, styles[variant]].join(" ")}
        stroke="var(--ink)"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d={SEAMS[shape]}
        className={styles.seam}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={strokeWidth * 0.5}
        strokeLinecap="round"
      />
      {variant === "spiced" &&
        SPECKLES[shape].map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} className={styles.speckle} />
        ))}
    </svg>
  );
}
