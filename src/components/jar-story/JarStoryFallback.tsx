"use client";

import { Card } from "@/components/card/Card";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { MakhanaPuff } from "@/components/makhana-puff/MakhanaPuff";
import { ScrollReveal } from "@/components/scroll-reveal/ScrollReveal";
import { BEATS } from "@/data/jarStoryBeats";
import { JarIllustration } from "./JarIllustration";
import styles from "./jar-story.module.css";

/**
 * The static stacked infographic from the design spec: jar illustration on
 * the left, seven ingredient cards on the right, revealed with ScrollReveal.
 * No pinning, no scroll-jacking. This is what runs under
 * prefers-reduced-motion and is what non-JS / crawler agents see — it must
 * be independently correct, not a degraded copy of the pinned stage.
 */
export function JarStoryFallback() {
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
        <ScrollReveal>
          <ul className={styles.fallbackCards}>
            {ingredientBeats.map((beat) => (
              <li key={beat.id} className={styles.fallbackCardItem}>
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
        </ScrollReveal>
        <p className={styles.fallbackFinale}>
          That&apos;s it. That&apos;s the ingredient list.
          <br />
          <span className={styles.fallbackSub}>No maida. No palm oil. No words you need to Google.</span>
        </p>
      </div>
    </div>
  );
}
