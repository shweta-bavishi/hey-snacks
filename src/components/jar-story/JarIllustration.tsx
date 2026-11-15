import { useId } from "react";
import styles from "./jar-story.module.css";

interface JarIllustrationProps {
  /** Lets JarStage grab the lid group so it can park it and slam it on at the shake. */
  lidRef?: React.Ref<SVGGElement>;
  className?: string;
}

// A real glass jar photograph with a brand-coloured screw cap on top. The
// glass sits *above* the contents (see .jarGlass in the stylesheet), so the
// nuts read as being inside it, behind the wall and under the reflections.
//
// Shared by the static fallback and the pinned stage so the two never drift
// apart visually.

/** Intrinsic size of public/jar/jar-glass.webp. */
const JAR_WIDTH = 520;
const JAR_HEIGHT = 786;

// The cap is a cylinder seen from slightly above, the same camera angle as
// the jar photo: a thin elliptical top face over a ridged skirt. Its knurling
// is spaced by the cosine of the angle round the cylinder, so the ridges
// bunch up towards the edges the way they do on a real cap, instead of
// marching across evenly like a barcode. Shading is flat bands of the accent
// mixed with paper or ink, never a gradient.
const CAP_RX = 67;
const CAP_RY = 7;
const CAP_TOP = 9;
const CAP_BOTTOM = 44;
const CAP_LEFT = 70 - CAP_RX;
const CAP_RIGHT = 70 + CAP_RX;
// Rounded so the server and the browser print identical attributes.
const KNURLS = Array.from({ length: 34 }, (_, i) => Math.round((70 - CAP_RX * Math.cos(((i + 0.5) / 34) * Math.PI)) * 100) / 100);
const CAP_BODY = `M${CAP_LEFT} ${CAP_TOP} L${CAP_LEFT} ${CAP_BOTTOM} A${CAP_RX} ${CAP_RY} 0 0 0 ${CAP_RIGHT} ${CAP_BOTTOM} L${CAP_RIGHT} ${CAP_TOP} Z`;
const CAP_LIP = `M${CAP_LEFT} ${CAP_BOTTOM - 6} A${CAP_RX} ${CAP_RY} 0 0 0 ${CAP_RIGHT} ${CAP_BOTTOM - 6} L${CAP_RIGHT} ${CAP_BOTTOM} A${CAP_RX} ${CAP_RY} 0 0 1 ${CAP_LEFT} ${CAP_BOTTOM} Z`;

export function JarIllustration({ lidRef, className }: JarIllustrationProps) {
  // The fallback and the stage both mount a jar, so the clip id must be unique.
  const clipId = `jar-cap-${useId().replace(/:/g, "")}`;
  return (
    <>
      <img
        src="/jar/jar-glass.webp"
        alt=""
        width={JAR_WIDTH}
        height={JAR_HEIGHT}
        className={[styles.jarGlass, className].filter(Boolean).join(" ")}
        decoding="async"
        draggable={false}
      />

      {/* Drawn closed over the threads. JarStage parks it up and to the side
          for the pour and slams it back on at the shake, so it must be
          allowed to paint outside its own box. */}
      <svg viewBox="0 0 140 56" className={styles.jarLidSvg} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <path d={CAP_BODY} />
          </clipPath>
        </defs>
        <g ref={lidRef} className={styles.jarLid}>
          <g clipPath={`url(#${clipId})`}>
            <rect x="0" y="0" width="140" height="56" className={styles.capBase} />
            <rect x="12" y="0" width="9" height="56" className={styles.capHighlight} />
            <rect x="23" y="0" width="5" height="56" className={styles.capSheen} />
            <rect x="100" y="0" width="18" height="56" className={styles.capShade} />
            <rect x="118" y="0" width="22" height="56" className={styles.capShadeDeep} />
            {KNURLS.map((x) => (
              <line key={x} x1={x} y1={CAP_TOP + 6} x2={x} y2={CAP_BOTTOM - 7} className={styles.capKnurl} />
            ))}
            <path d={CAP_LIP} className={styles.capLip} />
          </g>
          <path d={CAP_BODY} className={styles.capOutline} />
          <ellipse cx="70" cy={CAP_TOP} rx={CAP_RX} ry={CAP_RY} className={styles.capTop} />
          <ellipse cx="70" cy={CAP_TOP + 0.5} rx={CAP_RX - 11} ry={CAP_RY - 2.4} className={styles.capPanel} />
          <path d={`M${CAP_LEFT + 12} ${CAP_TOP - 3.2} Q 46 ${CAP_TOP - 5.6} 70 ${CAP_TOP - 5.8}`} className={styles.capGlint} />
        </g>
      </svg>
    </>
  );
}

interface JarShadowProps {
  shadowRef?: React.Ref<SVGSVGElement>;
}

/**
 * Where the jar meets the counter. Two flat, stepped ellipses (a soft outer
 * and a dark contact core), posterised rather than blurred, so the jar sits
 * on something instead of floating in the middle of the paper. Kept outside
 * the shaking jar on the stage, so it can shrink while the jar is lifted.
 */
export function JarShadow({ shadowRef }: JarShadowProps) {
  return (
    <svg ref={shadowRef} viewBox="0 0 100 10" className={styles.jarShadow} aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="5" rx="49" ry="4.6" className={styles.jarShadowOuter} />
      <ellipse cx="50" cy="4.6" rx="41" ry="2.8" className={styles.jarShadowCore} />
    </svg>
  );
}
