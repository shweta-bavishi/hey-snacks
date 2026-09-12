import styles from "./jar-story.module.css";

interface JarIllustrationProps {
  /** 0-1, how full the jar reads. Purely visual — the real fill state lives in particle count. */
  fillLevel?: number;
  tint?: string;
  className?: string;
}

// A single hand-drawn glass jar outline (2px ink, cream highlight) shared by
// both the static fallback and the pinned stage, so the two never drift out
// of sync visually.
export function JarIllustration({ fillLevel = 0, tint = "var(--paper-2)", className }: JarIllustrationProps) {
  const innerTop = 30;
  const innerBottom = 168;
  const fillY = innerBottom - fillLevel * (innerBottom - innerTop);

  return (
    <svg
      viewBox="0 0 160 200"
      className={[styles.jarSvg, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <clipPath id="jar-inner-clip">
        <path d="M32 30 L30 168 Q30 180 44 180 L116 180 Q130 180 130 168 L128 30 Z" />
      </clipPath>
      {fillLevel > 0 ? (
        <rect x="28" y={fillY} width="104" height={innerBottom - fillY + 20} fill={tint} clipPath="url(#jar-inner-clip)" />
      ) : null}
      <path
        d="M56 10 L104 10 L104 26 L112 30 L118 34 Q130 40 130 168 Q130 188 110 188 L50 188 Q30 188 30 168 Q30 40 42 34 L48 30 L56 26 Z"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M52 12 L108 12" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 50 L44 150" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
