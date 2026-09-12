"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/card/Card";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { MakhanaPuff } from "@/components/makhana-puff/MakhanaPuff";
import { BEATS } from "@/data/jarStoryBeats";
import { JarIllustration } from "./JarIllustration";
import styles from "./jar-story.module.css";

/**
 * The static stacked infographic from the design spec: jar illustration on
 * the left, seven ingredient cards on the right, revealed with a simple
 * fade-in-on-intersection. No pinning, no scroll-jacking. This is what runs
 * under prefers-reduced-motion and is what non-JS / crawler agents see —
 * it must be independently correct, not a degraded copy of the pinned stage.
 */
export function JarStoryFallback() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(() => BEATS.slice(1).map(() => false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = cardRefs.current.indexOf(entry.target as HTMLElement);
          if (idx === -1) return;
          setRevealed((cur) => (cur[idx] ? cur : cur.map((v, i) => (i === idx ? true : v))));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ingredientBeats = BEATS.slice(1); // drop the intro beat, it has no card
  const finalFill = ingredientBeats[ingredientBeats.length - 1].fillLevel;

  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackJar}>
        <JarIllustration fillLevel={finalFill} tint="var(--accent-tint)" />
      </div>
      <div className={styles.fallbackList}>
        <SectionHeading eyebrow="06 // ingredients" level={2}>
          Curious what&apos;s actually inside?
        </SectionHeading>
        <ul className={styles.fallbackCards}>
          {ingredientBeats.map((beat, i) => (
            <li
              key={beat.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={[styles.fallbackCardItem, revealed[i] ? styles.revealed : ""].join(" ")}
            >
              <Card padding="md" elevation="raised">
                <div className={styles.fallbackCardRow}>
                  {beat.particleShape && beat.particleShape !== "dust" ? (
                    <MakhanaPuff shape={beat.particleShape} size={40} />
                  ) : (
                    <span className={styles.dustSwatch} aria-hidden="true" />
                  )}
                  <div>
                    <p className={styles.fallbackLabel}>{beat.label}</p>
                    <p className={styles.fallbackCopy}>{beat.copy}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <p className={styles.fallbackFinale}>
          That&apos;s it. That&apos;s the ingredient list.
          <br />
          <span className={styles.fallbackSub}>No maida. No palm oil. No words you need to Google.</span>
        </p>
      </div>
    </div>
  );
}
