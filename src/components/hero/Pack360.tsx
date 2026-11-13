"use client";

import { useEffect, useState } from "react";
import styles from "./pack360.module.css";

export interface Pack360Props {
  /** Static placeholder, always required — frame 0 / no-JS fallback. */
  staticSrc: string;
  alt: string;
  /**
   * 36-frame sequence, 10° apart. Absent in this build (see
   * docs/landing-page-plan.md §1.3) — when absent, Pack360 renders
   * `staticSrc` only and every drag/scrub/keyboard affordance hides
   * itself rather than pretending to spin nothing.
   */
  frames?: string[];
  className?: string;
}

// Written against the frame API from day one: passing `frames` later is a
// prop change, not a rewrite. With no frames, this is a plain, static,
// CLS-safe image — no drag cursor, no scrub arc, no idle rotation.
export function Pack360({ staticSrc, alt, frames, className }: Pack360Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const live = Boolean(frames && frames.length > 0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!live || reducedMotion) return;
    const id = setInterval(() => {
      setFrameIndex((i) => (i + 1) % (frames as string[]).length);
    }, 80);
    return () => clearInterval(id);
  }, [live, reducedMotion, frames]);

  const src = live ? (frames as string[])[frameIndex] : staticSrc;

  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")} data-live={live || undefined}>
      <img src={src} alt={alt} className={styles.pack} width={300} height={420} />
      {live && !reducedMotion && (
        <div className={styles.scrubHint} aria-hidden="true">
          <span className={styles.arc} />
          <span className={styles.label}>360°</span>
        </div>
      )}
    </div>
  );
}
