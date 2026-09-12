"use client";

import { useEffect, useRef, useState } from "react";
import { BEATS, FINALE_PROGRESS, SHAKE, SHAKE_PROGRESS, type JarBeat } from "@/data/jarStoryBeats";
import { JarIllustration } from "./JarIllustration";
import { useJarSound } from "./useJarSound";
import styles from "./jar-story.module.css";

// Named import keeps the bundle to gsap's core + ScrollTrigger only — never
// `import gsap from "gsap/all"`.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const RAIL_BEATS = BEATS; // 7 notches, one per beat (intro + 6 ingredient stops)

interface Particle {
  key: string;
  beat: JarBeat;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  shape: "a" | "b" | "c" | "dust";
}

const PARTICLES: Particle[] = BEATS.flatMap((beat) =>
  beat.particleShape
    ? beat.settlePositions.map((spot, i) => ({
        key: `${beat.id}-${i}`,
        beat,
        x: spot.x,
        y: spot.y,
        rotation: spot.rotation,
        scale: spot.scale,
        shape: beat.particleShape as "a" | "b" | "c" | "dust",
      }))
    : []
);

interface JarStageProps {
  onSkip: () => void;
  skipLinkRef: React.RefObject<HTMLAnchorElement | null>;
}

/**
 * The pinned, scroll-driven build sequence. Mounted only when JS is
 * available and the user hasn't asked for reduced motion — JarStory always
 * renders JarStoryFallback underneath as the accessible, readable content;
 * this layer is a progressive visual enhancement on top of it.
 */
export function JarStage({ onSkip, skipLinkRef }: JarStageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const jarWrapRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const labelRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const { enabled: soundEnabled, toggle: toggleSound, playCrunch } = useJarSound();
  const hasShaken = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // -1 once scroll has moved past the last ingredient beat (into
            // the shake/finale) — the label card should disappear then, not
            // freeze on whichever beat was last active.
            const idx = RAIL_BEATS.findIndex((b) => p >= b.progress[0] && p < b.progress[1]);
            setActiveBeatIndex(idx);
            if (p >= SHAKE_PROGRESS[0] && !hasShaken.current) {
              hasShaken.current = true;
              playCrunch();
            }
            if (p < SHAKE_PROGRESS[0]) hasShaken.current = false;
          },
        },
        defaults: { ease: "none" },
      });

      // Intro question is visible the moment the stage pins, then fades out
      // as the jar arrives — not faded in from zero, or it's invisible at
      // scroll progress exactly 0.
      if (introRef.current) {
        tl.set(introRef.current, { opacity: 1 }, 0).to(introRef.current, { opacity: 0, duration: 0.05 }, 0.08);
      }

      // Jar scales/fades in over the intro beat.
      if (jarWrapRef.current) {
        tl.fromTo(jarWrapRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.1 }, 0);
      }

      // Each ingredient beat: particles drop in (transform + opacity only),
      // the label card swaps text via opacity crossfade.
      BEATS.slice(1).forEach((beat) => {
        const [start, end] = beat.progress;
        const span = end - start;
        PARTICLES.filter((p) => p.beat.id === beat.id).forEach((particle) => {
          const el = particleRefs.current[particle.key];
          if (!el) return;
          tl.fromTo(
            el,
            { opacity: 0, y: -32, x: 0 },
            { opacity: 1, y: 0, duration: span * 0.8 },
            start
          );
        });
      });

      // The shake: rotate + translate the whole jar, oscillating, transform-only.
      // Added directly onto the master timeline (not a nested sub-timeline)
      // with durations expressed as fractions of the 0-1 scroll range, the
      // same unit every other tween on `tl` uses — a nested timeline added
      // via tl.add() carries its own real-second duration, which silently
      // stretches the master timeline's total length and desyncs every
      // tween positioned after it from the scrollbar.
      const [shakeStart, shakeEnd] = SHAKE_PROGRESS;
      const shakeSpan = shakeEnd - shakeStart;
      if (jarWrapRef.current) {
        const steps = SHAKE.oscillations * 2 + 1; // + 1 to return to rest
        const stepSpan = shakeSpan / steps;
        for (let i = 0; i < steps; i++) {
          const dir = i % 2 === 0 ? 1 : -1;
          const atRest = i === steps - 1;
          tl.to(
            jarWrapRef.current,
            {
              rotate: atRest ? 0 : dir * SHAKE.rotationDeg,
              x: atRest ? 0 : dir * SHAKE.translatePx,
              duration: stepSpan,
              ease: "sine.inOut",
            },
            shakeStart + i * stepSpan
          );
        }
      }

      // Finale: product pack + CTA fade in.
      if (finaleRef.current) {
        tl.fromTo(finaleRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: FINALE_PROGRESS[1] - FINALE_PROGRESS[0] }, FINALE_PROGRESS[0]);
      }
    }, section);

    return () => ctx.revert();
  }, [playCrunch]);

  const activeBeat = RAIL_BEATS[activeBeatIndex];

  return (
    <div ref={sectionRef} className={styles.stage}>
      <div className={styles.sticky}>
        <a
          ref={skipLinkRef}
          href="#jar-story-end"
          className={styles.skipLink}
          onClick={(e) => {
            e.preventDefault();
            onSkip();
          }}
        >
          Skip →
        </a>

        <button
          type="button"
          className={styles.soundToggle}
          onClick={toggleSound}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>

        <p ref={introRef} className={styles.introQuestion}>
          Curious what&apos;s actually inside?
        </p>

        <div className={styles.jarCenter}>
          <div ref={jarWrapRef} className={styles.jarWrap}>
            <JarIllustration fillLevel={activeBeat?.fillLevel ?? 0} tint={activeBeat?.tint} />
            <div className={styles.particleField} aria-hidden="true">
              {PARTICLES.map((p) => (
                <div
                  key={p.key}
                  ref={(el) => {
                    particleRefs.current[p.key] = el;
                  }}
                  className={[styles.particle, styles[`shape-${p.shape}`]].join(" ")}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {activeBeat?.label ? (
          <div ref={labelRef} className={styles.labelCard} aria-hidden="true">
            <p className={styles.labelTitle}>{activeBeat.label}</p>
            <p className={styles.labelCopy}>{activeBeat.copy}</p>
          </div>
        ) : null}

        <div className={styles.rail} aria-hidden="true">
          {RAIL_BEATS.map((beat, i) => (
            <span key={beat.id} className={[styles.notch, i <= activeBeatIndex ? styles.notchFilled : ""].join(" ")} />
          ))}
        </div>

        <div ref={finaleRef} className={styles.finale}>
          <p className={styles.finaleHeadline}>That&apos;s it. That&apos;s the ingredient list.</p>
          <p className={styles.finaleSub}>No maida. No palm oil. No words you need to Google.</p>
          <a href="#notify" className={styles.finaleCta}>
            Notify Me →
          </a>
        </div>
      </div>
    </div>
  );
}
