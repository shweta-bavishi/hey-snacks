"use client";

import { useEffect, useRef, useState } from "react";
import { JarStoryFallback } from "./JarStoryFallback";
import { JarStage } from "./JarStage";
import styles from "./jar-story.module.css";

/**
 * §06 · Ingredient scrollytelling — the jar.
 *
 * JarStoryFallback is the source of truth for content: it always renders,
 * always readable, always independently correct. JarStage is a pure visual
 * enhancement pinned on top of it, only mounted once we know JS is running
 * and the user hasn't asked for reduced motion. Skipping the stage (via the
 * escape hatch, reduced motion, or JS never loading) must never lose copy.
 */
export function JarStory() {
  const [enhanced, setEnhanced] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnhanced(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnhanced(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleSkip = () => {
    setSkipped(true);
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showStage = enhanced && !skipped;

  return (
    <section aria-label="Ingredients" className={styles.section}>
      {showStage ? <JarStage onSkip={handleSkip} skipLinkRef={skipLinkRef} /> : null}
      <div className={[styles.fallbackWrap, showStage ? styles.srOnly : ""].join(" ")}>
        <JarStoryFallback />
      </div>
      <div id="jar-story-end" ref={endRef} />
    </section>
  );
}
