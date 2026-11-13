"use client";

import { useEffect, useRef, useState } from "react";
import { BEATS, FINALE_PROGRESS, SHAKE, SHAKE_PROGRESS } from "@/data/jarStoryBeats";
import { FLAVOURS } from "@/data/flavours";
import { JOIN_LABEL } from "@/data/launch";
import { Grain } from "@/components/grain/Grain";
import { useNotifyModal } from "@/components/notify-form/NotifyModalProvider";
import { IngredientSprite } from "./ingredientSprites";
import { JAR_PARTICLES, JarContents } from "./JarContents";
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
const TWO_COLUMN_MIN_WIDTH = 900;

// How far above the rim the lid waits before the shake slams it on. GSAP
// transforms an inner SVG <g> in the drawing's own user units, not CSS px,
// so this is measured against the 306-unit-tall viewBox.
const LID_LIFT_UNITS = 16;

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
 * - The drawn artwork behind every particle is shared through one `<use>` reference
 *   (see ingredientSprites.tsx), so the sprite count — not the linework — sets the DOM cost
 *
 * **Scroll map:**
 * - 0.00–0.10: Jar fades in + scales (0.9→1), lid hovering above the rim
 * - 0.10–0.95: Each ingredient pours in sequence, settles, then next ingredient starts
 * - 0.74–0.86: Masala beat also washes the stage background over to the flavour tint
 * - 0.86–0.95: THE SHAKE — lid slams on, jar rotates ±8° × 6 oscillations, stage shakes 4px
 * - 0.95–1.00: Settles; finale copy fades in beside the jar
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

// Flat ink-stroke speaker glyph, same register as the rest of the site's
// hand-drawn icon work (Stamp, MakhanaPuff) rather than a generic system
// mute icon. Two sound-wave arcs when on; a single strike-through when off
// — a plain text label alone was too easy to miss against the pinned
// stage's other overlays, this makes the control read as a control.
function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="var(--ink)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5V14.5H7L12.5 19V5L7 9.5H3Z" fill="var(--ink)" stroke="var(--ink)" />
      {on ? (
        <>
          <path d="M16.5 8.5C17.7 9.7 18.3 11.3 18.3 12C18.3 12.7 17.7 14.3 16.5 15.5" />
          <path d="M19.3 5.7C21.2 7.6 22 9.9 22 12C22 14.1 21.2 16.4 19.3 18.3" />
        </>
      ) : (
        <path d="M16 8.5L21.5 15.5M21.5 8.5L16 15.5" />
      )}
    </svg>
  );
}

export function JarStage({ onSkip, skipLinkRef }: JarStageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const jarWrapRef = useRef<HTMLDivElement>(null);
  const jarCenterRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<SVGGElement>(null);
  const particleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const introRef = useRef<HTMLParagraphElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const { enabled: soundEnabled, toggle: toggleSound, playCrunch } = useJarSound();
  const { openNotify } = useNotifyModal();
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

      // Lid waits off the rim, tilted, for the whole pour. It is drawn closed
      // in JarIllustration so the static fallback shows a sealed jar; the
      // stage is the only thing that lifts it.
      if (lidRef.current) {
        gsap.set(lidRef.current, { transformOrigin: "50% 50%", y: -LID_LIFT_UNITS, rotate: -5 });
      }

      // Centre every sprite on its settle point up front. Done through GSAP
      // (not a CSS transform) so the drop-in tween below composes with it
      // rather than clobbering it.
      JAR_PARTICLES.forEach(({ key, spot }) => {
        const el = particleRefs.current[key];
        if (!el) return;
        gsap.set(el, { xPercent: -50, yPercent: -50, rotation: spot.rotation, scale: spot.scale });
      });

      // Each ingredient beat: particles drop in (transform + opacity only),
      // the label card swaps text via opacity crossfade.
      BEATS.slice(1).forEach((beat) => {
        const [start, end] = beat.progress;
        const span = end - start;
        JAR_PARTICLES.filter((p) => p.beat.id === beat.id).forEach(({ key }) => {
          const el = particleRefs.current[key];
          if (!el) return;
          tl.fromTo(el, { opacity: 0, y: -34 }, { opacity: 1, y: 0, duration: span * 0.8 }, start);
        });
      });

      // The masala beat is where the spec turns the whole stage the flavour
      // colour. A flat colour wash fading up over the paper, not a gradient.
      const spice = BEATS[BEATS.length - 1];
      if (washRef.current) {
        tl.fromTo(
          washRef.current,
          { opacity: 0 },
          { opacity: 1, duration: spice.progress[1] - spice.progress[0] },
          spice.progress[0]
        );
      }

      // The shake: rotate + translate the whole jar, oscillating, transform-only.
      // Added directly onto the master timeline (not a nested sub-timeline)
      // with durations expressed as fractions of the 0-1 scroll range, the
      // same unit every other tween on `tl` uses — a nested timeline added
      // via tl.add() carries its own real-second duration, which silently
      // stretches the master timeline's total length and desyncs every
      // tween positioned after it from the scrollbar.
      const [shakeStart, shakeEnd] = SHAKE_PROGRESS;
      const shakeSpan = shakeEnd - shakeStart;
      const steps = SHAKE.oscillations * 2 + 1; // + 1 to return to rest
      const stepSpan = shakeSpan / steps;

      // The lid lands first, in the opening step, so the shake reads as a
      // consequence of sealing the jar rather than something that happens
      // next to it.
      if (lidRef.current) {
        tl.to(lidRef.current, { y: 0, rotate: 0, duration: stepSpan * 0.8, ease: "power3.in" }, shakeStart);
      }

      for (let i = 0; i < steps; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        const atRest = i === steps - 1;
        const at = shakeStart + i * stepSpan;
        if (jarWrapRef.current) {
          tl.to(
            jarWrapRef.current,
            {
              rotate: atRest ? 0 : dir * SHAKE.rotationDeg,
              x: atRest ? 0 : dir * SHAKE.translatePx,
              duration: stepSpan,
              ease: "sine.inOut",
            },
            at
          );
        }
        // Screen shake, per the spec: a quarter of the jar's throw, on the
        // stage itself, so the copy and the rail feel the hit too.
        if (stickyRef.current) {
          tl.to(
            stickyRef.current,
            { x: atRest ? 0 : -dir * 4, duration: stepSpan, ease: "sine.inOut" },
            at
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
      <div ref={stickyRef} className={styles.sticky}>
        {/* Flat flavour wash for the masala beat. Sits under everything. */}
        <div ref={washRef} className={styles.wash} aria-hidden="true">
          <Grain scope="panel" intensity="heavy" />
        </div>

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
          <SoundIcon on={soundEnabled} />
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>

        <p ref={introRef} className={styles.introQuestion}>
          Curious what&apos;s actually inside?
        </p>

        <div ref={jarCenterRef} className={styles.jarCenter}>
          <div ref={jarWrapRef} className={[styles.jarWrap, styles.stageJar].join(" ")}>
            <JarIllustration fillLevel={activeBeat?.fillLevel ?? 0} tint={activeBeat?.tint} lidRef={lidRef} />
            <JarContents
              registerRef={(key, el) => {
                particleRefs.current[key] = el;
              }}
            />
          </div>
        </div>

        {showLabel ? (
          <div key={activeBeat.id} className={styles.labelCard} aria-hidden="true">
            <div className={styles.labelHead}>
              {activeBeat.particleShape ? (
                <IngredientSprite kind={activeBeat.particleShape} size={60} className={styles.labelSprite} />
              ) : null}
              <p className={styles.labelName}>{activeBeat.name}</p>
            </div>
            <p className={styles.labelShare}>{activeBeat.share}</p>
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
          <p className={styles.finaleSub}>Zero cholesterol. No palm oil. No words you need to Google.</p>
          {/* Was <a href="#notify">, which pointed at an id that never
              existed. Opens the same join modal as every other CTA. */}
          <button
            type="button"
            className={styles.finaleCta}
            onClick={() => {
              openNotify(FLAVOURS[0].slug, "jar_finale").catch(() => {});
            }}
          >
            {JOIN_LABEL} →
          </button>
        </div>
      </div>
    </div>
  );
}
