import { HTMLAttributes, ReactNode } from "react";
import { Grain } from "@/components/grain/Grain";
import { buildBubblePath, thoughtTrail, SpeechBubbleTail, SpeechBubbleTone } from "./paths";
import styles from "./speech-bubble.module.css";

export type { SpeechBubbleTail, SpeechBubbleTone };

export interface SpeechBubbleProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  tail?: SpeechBubbleTail;
  tone?: SpeechBubbleTone;
  children: ReactNode;
  className?: string;
}

// The border-follows-an-irregular-shape problem: a CSS clip-path crops the
// box but a border is drawn on the box's own (rectangular) edge, so it never
// lines up with the clip. There is no clip-path in this component at all —
// the shape *is* an SVG <path>, stroked and filled in one draw, authored in
// a fixed viewBox and stretched with preserveAspectRatio="none" to match
// whatever size the real text forces the wrapper to. vector-effect
//="non-scaling-stroke" keeps that stroke a constant 3px on screen even
// though the path underneath it is scaled non-uniformly.
export function SpeechBubble({
  tail = "bottom-left",
  tone = "speech",
  children,
  className,
  ...rest
}: SpeechBubbleProps) {
  const d = buildBubblePath(tone, tail);
  const trail = tone === "thought" ? thoughtTrail(tail) : [];

  return (
    <div
      {...rest}
      data-tone={tone}
      data-tail={tail}
      className={[styles.bubble, className].filter(Boolean).join(" ")}
    >
      <svg
        className={styles.art}
        viewBox="0 0 240 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={d}
          className={styles.shape}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin={tone === "shout" ? "miter" : "round"}
        />
        {trail.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} className={styles.shape} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <Grain scope="panel" intensity="subtle" className={styles.grain} />
      <p className={styles.text}>{children}</p>
    </div>
  );
}
