import { useId } from "react";
import styles from "./jar-story.module.css";

interface JarIllustrationProps {
  /** 0-1, how full the jar reads. Purely visual — the real fill state lives in particle count. */
  fillLevel?: number;
  tint?: string;
  /** Lets JarStage grab the lid group so it can slam it on at the shake. */
  lidRef?: React.Ref<SVGGElement>;
  className?: string;
}

// A wide-mouth storage jar — a barni, the thing a Bihari kitchen actually
// keeps makhana in, not a lab bottle. Everything is flat colour planes and
// ink linework: the "glass" is three hard-edged paper highlight strokes, the
// contents get a hand-drawn surface wave rather than a rectangle's top edge,
// and a lotus roundel is etched into the body (makhana is a lotus seed — the
// motif is the origin story, not decoration).
//
// Shared by the static fallback and the pinned stage so the two never drift
// apart visually.

// Outer silhouette: rim, shoulder, body, rolled base.
const BODY =
  "M66 44 L66 66 C66 80 44 88 44 110 L44 266 C44 286 58 296 78 296 L162 296 C182 296 196 286 196 266 L196 110 C196 88 174 80 174 66 L174 44 Z";
// The glass interior, inset by the wall thickness. Contents are clipped to it.
const INNER =
  "M74 48 L74 66 C74 78 52 88 52 112 L52 264 C52 280 64 288 80 288 L160 288 C176 288 188 280 188 264 L188 112 C188 88 166 78 166 66 L166 48 Z";

// Where the contents can sit, in viewBox units. Keep in sync with the
// .particleField insets in jar-story.module.css — the sprites are positioned
// as a percentage of that box, so if these two drift the nuts settle outside
// the glass.
const FILL_TOP = 74;
const FILL_BOTTOM = 288;

/** The contents surface: an irregular settle line, not a ruled edge. */
function surface(y: number) {
  return `M40 ${y} C72 ${y - 11} 96 ${y + 9} 128 ${y - 5} C158 ${y - 16} 178 ${y + 5} 200 ${y - 1}`;
}

export function JarIllustration({
  fillLevel = 0,
  tint = "var(--paper-2)",
  lidRef,
  className,
}: JarIllustrationProps) {
  // Namespaced per instance: the fallback and the stage both render a jar,
  // and two elements sharing a clipPath id makes one of them silently blank.
  const uid = useId().replace(/:/g, "");
  const clipId = `jar-inner-${uid}`;
  const fillY = FILL_BOTTOM - fillLevel * (FILL_BOTTOM - FILL_TOP);

  return (
    <svg
      // Cropped to the drawing rather than a generous 240x320 canvas: the old
      // box left ~37% of its width as dead air, which is most of why the jar
      // read as a small object marooned in a large stage.
      viewBox="32 0 176 306"
      className={[styles.jarSvg, className].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id={clipId}>
        <path d={INNER} />
      </clipPath>

      {/* Glass reads as paper, one step off the page behind it. */}
      <path d={BODY} fill="var(--paper)" />

      {fillLevel > 0 ? (
        <g clipPath={`url(#${clipId})`}>
          <path d={`${surface(fillY)} L200 320 L40 320 Z`} fill={tint} />
          <path
            d={surface(fillY)}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>
      ) : null}

      {/* Etched lotus roundel — Mithila motif, pressed into the glass. */}
      <g
        transform="translate(120 132)"
        opacity="0.13"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <path key={k} d="M0 -30 C9 -19 9 -8 0 0 C-9 -8 -9 -19 0 -30 Z" transform={`rotate(${k * 45})`} />
        ))}
        <circle r="5.5" />
      </g>

      {/* Three hard-edged highlights. This is the whole trick that makes a
          flat shape read as glass — no gradient needed, and they sit above
          the contents so the nuts look like they are behind the wall. */}
      <path
        d="M70 128 C64 172 64 236 70 270"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M88 142 C84 180 84 230 88 256"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M172 150 C176 186 176 236 172 262"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.55"
      />

      <path d={BODY} fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      {/* Rim seam and the rolled foot. */}
      <path d="M66 64 C92 70 148 70 174 64" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
      <path
        d="M56 276 C90 283 150 283 184 276"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Knurled screw lid. Drawn closed; JarStage lifts it off and slams it
          back on at the shake. */}
      <g ref={lidRef} className={styles.jarLid}>
        <rect x="54" y="8" width="132" height="40" rx="6" fill="var(--accent)" stroke="var(--ink)" strokeWidth="4" />
        {Array.from({ length: 11 }, (_, i) => 64 + i * 11.2).map((x) => (
          <path key={x} d={`M${x} 14 L${x} 42`} stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
        ))}
        <path d="M54 38 L186 38" stroke="var(--ink)" strokeWidth="3.4" />
      </g>
    </svg>
  );
}
