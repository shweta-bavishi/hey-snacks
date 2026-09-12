"use client";

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { Grain } from "@/components/grain/Grain";
import { SpeechBubble, SpeechBubbleTail, SpeechBubbleTone } from "@/components/speech-bubble/SpeechBubble";
import { MascotFlavour } from "@/components/mascot-avatar/MascotAvatar";
import styles from "./comic-panel.module.css";

export type ComicPanelAspect = "1:1" | "4:3" | "16:9";
export type ComicPanelLayout = "grid" | "solo";

export interface ComicPanelProps {
  /** Flavour identity. Drives the tint background and the shadow colour. */
  flavour: MascotFlavour;
  aspect?: ComicPanelAspect;
  /** Extra delay (ms) added on top of the `panelIndex` stagger. */
  revealDelay?: number;
  /** Content for the internal SpeechBubble. */
  speech: ReactNode;
  tail?: SpeechBubbleTail;
  tone?: SpeechBubbleTone;
  /**
   * Mascot slot. Pass the same element (same props) in both 'grid' and
   * 'solo' layouts — swapping to a different element here remounts it and
   * restarts its idle loop. See module doc for why this is a slot rather
   * than a `flavour`-driven internal render.
   */
  mascot: ReactNode;
  /**
   * Sibling order, supplied by the parent (not inferred from DOM position)
   * so the 180ms stagger stays correct regardless of how grid/solo
   * reorders panels visually.
   */
  panelIndex?: number;
  /** Cosmetic only — border weight and padding. Never gates what mounts. */
  layout?: ComicPanelLayout;
  className?: string;
}

const ASPECT_RATIO: Record<ComicPanelAspect, string> = {
  "1:1": "1 / 1",
  "4:3": "4 / 3",
  "16:9": "16 / 9",
};

/**
 * The torn edge is one shared mask path per instance (not per aspect):
 * a jagged baseline near the bottom of a 0-100 x 0-100 box, referenced via
 * CSS mask-image so it scales non-uniformly with `aspect` the same way
 * SpeechBubble's path scales with its content box. The ink border is drawn
 * on a second, unmasked layer stacked underneath the masked fill+grain —
 * masking the bordered element directly would clip the stroke wherever the
 * mask cuts in, same "border vs irregular shape" problem SpeechBubble solves
 * with a stroked path instead.
 */
export function ComicPanel({
  flavour,
  aspect = "1:1",
  revealDelay = 0,
  speech,
  tail = "bottom-left",
  tone = "speech",
  mascot,
  panelIndex = 0,
  layout = "grid",
  className,
}: ComicPanelProps) {
  const maskId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = {
    "--panel-aspect": ASPECT_RATIO[aspect],
    "--panel-delay": `calc(${panelIndex} * 180ms + ${revealDelay}ms)`,
  } as React.CSSProperties;

  return (
    <div
      ref={panelRef}
      className={[styles.panel, className].filter(Boolean).join(" ")}
      data-flavour={flavour}
      data-layout={layout}
      data-revealed={revealed}
      style={style}
    >
      <svg className={styles.maskDefs} aria-hidden="true" focusable="false">
        <defs>
          <mask id={maskId} maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" />
            <polygon
              className={styles.tornCut}
              points="0,0.94 0.05,0.98 0.11,0.93 0.17,0.99 0.23,0.94 0.29,0.98 0.35,0.93 0.41,0.99 0.47,0.94 0.53,0.98 0.59,0.93 0.65,0.99 0.71,0.94 0.77,0.98 0.83,0.93 0.89,0.99 0.95,0.94 1,0.97 1,1 0,1"
              fill="black"
            />
          </mask>
        </defs>
      </svg>

      <div className={styles.border} aria-hidden="true" />
      <div className={styles.fill} style={{ maskImage: `url(#${maskId})`, WebkitMaskImage: `url(#${maskId})` }}>
        <Grain scope="panel" intensity="subtle" className={styles.grain} />
      </div>

      <div className={styles.mascotSlot}>{mascot}</div>
      <SpeechBubble tone={tone} tail={tail} className={styles.speech}>
        {speech}
      </SpeechBubble>
    </div>
  );
}
