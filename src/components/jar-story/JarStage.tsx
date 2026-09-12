"use client";

import { useEffect, useRef, useState } from "react";
import { BEATS, FINALE_PROGRESS, SHAKE, SHAKE_PROGRESS, type JarBeat } from "@/data/jarStoryBeats";
import { SPRITE_MASKS, type SpriteKind } from "./ingredientSprites";
import { JarIllustration } from "./JarIllustration";
import { useJarSound } from "./useJarSound";
import styles from "./jar-story.module.css";

// Named import keeps the bundle to gsap's core + ScrollTrigger only — never
// `import gsap from "gsap/all"`.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const RAIL_BEATS = BEATS; // 7 notches, one per beat (intro + 6 ingredient stops)

// Below this the pinned stage can't hold a jar and a column of copy side by
// side. Kept in sync with the matching breakpoint in jar-story.module.css.
const TWO_COLUMN_MIN_WIDTH = 860;

interface Particle {
  key: string;
  beat: JarBeat;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  shape: SpriteKind;
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
        shape: beat.particleShape as SpriteKind,
      }))
    : []
);

interface JarStageProps {
  onSkip: () => void;
  skipLinkRef: React.RefObject<HTMLAnchorElement | null>;
}

/**
 * Pinned, scroll-driven ingredient build sequence. Progressive enhancement over JarStoryFallback.
 *
 * **Implementation:**
 * - Built with GSAP ScrollTrigger (`scrub: 1` for smooth scrubbing)
 * - Scroll progress (0→1) drives all animations via `onUpdate` callback
 * - Particles are absolutely-positioned SVG sprites; all animation is transform-only (`will-change`)
 * - Particle settle positions pre-computed (no live physics engine — prevents jank on Android)
 * - ~140 total DOM nodes across all particles (heavily optimized)
 *
 * **Scroll map:**
 * - 0.00–0.10: Jar fades in + scales (0.9→1)
 * - 0.10–0.95: Each ingredient pours in sequence, settles, then next ingredient starts
 * - 0.86–0.95: THE SHAKE — lid slams, jar rotates ±8° × 6 oscillations, screen shakes 4px
 * - 0.95–1.00: Settles; product pack + finale headline fade in
 *
 * **Label card management:**
 * - Shows during ingredient sequences (0.10–0.86), hides during shake (0.86+)
 * - activeBeatIndex becomes -1 once scroll moves past the last ingredient beat
 * - This prevents the label card from freezing on the last ingredient during the shake
 *
 * **Progress rail (visual affordance):**
 * - 7 notches, one per ingredient beat
 * - Fills in accent colour as scroll progresses
 * - Stays filled at 100% even during shake/finale (activeBeatIndex === -1 check)
 *
 * **Reduced motion:**
 * - Entire component is unmounted when `prefers-reduced-motion: reduce`
 * - JarStoryFallback (static infographic) renders instead
 * - Same content, no pinning, no animation
 *
 * **Sound:**
 * - Optional crunch SFX on jar shake (shake progress 0.86–0.95)
 * - Synthesised via WebAudio (filtered noise burst), no audio file
 * - Off by default; toggle persists in localStorage
 */
export function JarStage({ onSkip, skipLinkRef }: JarStageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const jarWrapRef = useRef<HTMLDivElement>(null);
  const jarCenterRef = useRef<HTMLDivElement>(null);
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

      // Intro question is visible the moment the stage pins, then clears out
      // *before* the jar fades up — the two used to overlap, so the headline
      // sat on top of the jar outline for a chunk of the intro beat.
      if (introRef.current) {
        tl.set(introRef.current, { opacity: 1 }, 0).to(introRef.current, { opacity: 0, duration: 0.035 }, 0.02);
      }

      // Jar scales/fades in only once the question has gone.
      if (jarWrapRef.current) {
        tl.fromTo(jarWrapRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.045 }, 0.055);
      }

      // Centre every sprite on its settle point up front. Done through GSAP
      // (not a CSS transform) so the drop-in tween below composes with it
      // rather than clobbering it.
      PARTICLES.forEach((particle) => {
        const el = particleRefs.current[particle.key];
        if (!el) return;
        gsap.set(el, { xPercent: -50, yPercent: -50, rotation: particle.rotation, scale: particle.scale });
      });

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

      // Finale: the copy fades in *next to* the jar, per the spec — so the
      // jar has to get out of the way first. On a wide stage it slides into
      // the left half and the copy takes the right; on a narrow one there's
      // no room for two columns, so the jar drops back to a faint backdrop
      // and the copy centres over it. Previously both were centred and the
      // headline landed straight on top of the glass.
      const finaleSpan = FINALE_PROGRESS[1] - FINALE_PROGRESS[0];
      if (finaleRef.current) {
        tl.fromTo(
          finaleRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: finaleSpan },
          FINALE_PROGRESS[0]
        );
      }

      if (jarCenterRef.current) {
        const mm = gsap.matchMedia();
        mm.add(`(min-width: ${TWO_COLUMN_MIN_WIDTH}px)`, () => {
          tl.to(jarCenterRef.current, { xPercent: -26, duration: finaleSpan }, FINALE_PROGRESS[0]);
        });
        mm.add(`(max-width: ${TWO_COLUMN_MIN_WIDTH - 1}px)`, () => {
          tl.to(jarCenterRef.current, { opacity: 0.16, duration: finaleSpan }, FINALE_PROGRESS[0]);
        });
      }
    }, section);

    return () => ctx.revert();
  }, [playCrunch]);

  // Past the last ingredient beat (shake/finale), keep the jar's fill/tint
  // frozen at the final ingredient's values, but suppress the label card —
  // see the onUpdate comment above for why idx goes to -1 there.
  const activeBeat = activeBeatIndex >= 0 ? RAIL_BEATS[activeBeatIndex] : RAIL_BEATS[RAIL_BEATS.length - 1];
  const showLabel = activeBeatIndex >= 0 && !!RAIL_BEATS[activeBeatIndex]?.label;

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

        <div ref={jarCenterRef} className={styles.jarCenter}>
          <div ref={jarWrapRef} className={styles.jarWrap}>
            <JarIllustration fillLevel={activeBeat?.fillLevel ?? 0} tint={activeBeat?.tint} />
            <div className={styles.particleField} aria-hidden="true">
              {PARTICLES.map((p) => (
                <div
                  key={p.key}
                  ref={(el) => {
                    particleRefs.current[p.key] = el;
                  }}
                  className={styles.particle}
                  // left/top place the sprite's *centre* on its settle point
                  // (the -50% shift is applied by GSAP as xPercent/yPercent,
                  // so it composes with the drop-in tween instead of being
                  // overwritten by it). Without that, a sprite at x:88% hung
                  // its full width past the jar wall.
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.beat.particleSize}px`,
                    height: `${p.beat.particleSize}px`,
                    backgroundColor: p.beat.particleColor,
                    maskImage: SPRITE_MASKS[p.shape],
                    WebkitMaskImage: SPRITE_MASKS[p.shape],
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {showLabel ? (
          <div ref={labelRef} className={styles.labelCard} aria-hidden="true">
            <p className={styles.labelTitle}>{activeBeat.label}</p>
            <p className={styles.labelCopy}>{activeBeat.copy}</p>
          </div>
        ) : null}

        <div className={styles.rail} aria-hidden="true">
          {RAIL_BEATS.map((beat, i) => (
            <span
              key={beat.id}
              className={[styles.notch, i <= activeBeatIndex || activeBeatIndex === -1 ? styles.notchFilled : ""].join(" ")}
            />
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
