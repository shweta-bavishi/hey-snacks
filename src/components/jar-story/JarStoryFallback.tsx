"use client";

import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { ScrollReveal } from "@/components/scroll-reveal/ScrollReveal";
import { BEATS } from "@/data/jarStoryBeats";
import { IngredientSprite } from "./ingredientSprites";
import { JarContents } from "./JarContents";
import { JarIllustration, JarShadow } from "./JarIllustration";
import styles from "./jar-story.module.css";

/**
 * The static stacked infographic from the design spec: jar illustration on
 * the left, six ingredient cards on the right, revealed with ScrollReveal.
 * No pinning, no scroll-jacking. This is what runs under
 * prefers-reduced-motion and is what non-JS / crawler agents see — it must
 * be independently correct, not a degraded copy of the pinned stage.
 *
 * The cards don't use the shared Card component: they carry a full-bleed
 * ingredient plate on the left edge, which a padded Card can't do without
 * fighting its own padding.
 */
export function JarStoryFallback() {
  const ingredientBeats = BEATS.slice(1); // drop the intro beat, it has no card

  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackJar}>
        {/* The finished jar, not the layered pour: mixed and coated, the
            same state the stage ends on, told without the movement. */}
        <div className={styles.jarStand}>
          <JarShadow />
          <div className={styles.jarWrap}>
            <JarIllustration />
            <JarContents state="mixed" />
          </div>
        </div>
      </div>
      <div className={styles.fallbackList}>
        <SectionHeading eyebrow="06 // ingredients" level={2}>
          Curious what&apos;s actually inside?
        </SectionHeading>
        <ScrollReveal>
          <ul className={styles.fallbackCards}>
            {ingredientBeats.map((beat) => (
              <li key={beat.id} className={styles.fallbackCardItem}>
                {beat.particleShape ? (
                  <span className={styles.fallbackPlate} aria-hidden="true">
                    <IngredientSprite kind={beat.particleShape} size={56} />
                  </span>
                ) : null}
                <div className={styles.fallbackCardBody}>
                  <p className={styles.fallbackLabel}>
                    <span>{beat.name}</span>
                    <span className={styles.fallbackShare}>{beat.share}</span>
                  </p>
                  <p className={styles.fallbackCopy}>{beat.copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>
        <p className={styles.fallbackFinale}>
          That&apos;s it. That&apos;s the ingredient list.
          <br />
          <span className={styles.fallbackSub}>Zero cholesterol. No palm oil. No words you need to Google.</span>
        </p>
      </div>
    </div>
  );
}
