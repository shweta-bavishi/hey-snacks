"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BEATS, FINALE_PROGRESS, JAR_PARTICLES, SHAKE, SHAKE_PROGRESS } from "@/data/jarStoryBeats";
import { FLAVOURS } from "@/data/flavours";
import { JOIN_LABEL } from "@/data/launch";
import { Grain } from "@/components/grain/Grain";
import { useNotifyModal } from "@/components/notify-form/NotifyModalProvider";
import { IngredientSprite } from "./ingredientSprites";
import { JarContents, type JarContentsTargets } from "./JarContents";
import { JarIllustration, JarShadow } from "./JarIllustration";
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

// Where the cap waits during the pour: lifted clear of the rim, nudged to
// one side and tipped, the way you'd hold it while someone fills the jar.
// GSAP transforms an inner SVG <g> in the drawing's own user units, not CSS
// px, so these are measured against the cap's 140 x 56 viewBox.
const LID_PARKED = { x: 34, y: -62, rotate: 14 };

// The mouth of the jar sits this far above the top of the particle field,
// as a share of the field's height (the field starts at the jar's shoulder,
// 24% down the photo; the rim is at about 2%). Pieces enter here.
const MOUTH_ABOVE_FIELD = 0.32;

// Shape of each beat's pour, as shares of the beat's scroll span.
const POUR = {
  /** One piece's fall from the mouth to its settle point. */
  fallShare: 0.32,
  /** Window over which the beat's pieces start, bottom-most first. */
  staggerShare: 0.56,
  /** Width of the pour stream at the mouth, percent of the field. */
  streamWidth: 28,
  /** Spin a piece sheds on the way down. */
  tumbleDeg: 140,
  /** Height of the landing bounce, share of the field height. */
  bounce: 0.014,
};

// Pieces whose settle point is above this line (percent of the field from
// the top) are the top of the pile, and catch the masala cloud before the
// shake mixes it through.
const DUSTED_ABOVE_Y = 46;

// How far a beat's back pile drops as it settles in, as a share of the
// field height. Small: it should read as the pile slumping into place, not
// a slab sliding down.
const BACK_SETTLE = 0.05;

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
 * - Particles are absolutely-positioned photographed sprites; all animation is transform-only (`will-change`)
 * - Particle settle positions pre-computed (no live physics engine — prevents jank on Android)
 * - Eleven small WebP cutouts are shared by every particle (see ingredientSprites.tsx)
 *
 * **Scroll map:**
 * - 0.00–0.10: Jar fades in + scales (0.9→1), cap parked up and to one side
 * - 0.10–0.74: Each ingredient pours in through the mouth: pieces fall under
 *   gravity, tumble, bounce once, bottom-most first, while the shaded back
 *   pile rises behind them
 * - 0.74–0.86: Masala: a powder cloud drifts in and dusts the top of the
 *   pile; the stage washes over to the flavour tint
 * - 0.86–0.95: THE SHAKE: cap slams on, jar lifts and rocks ±8° × 6, stage
 *   shakes 4px. Every piece tumbles to a shuffled slot and comes out coated
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
  const standRef = useRef<HTMLDivElement>(null);
  const jarWrapRef = useRef<HTMLDivElement>(null);
  const jarCenterRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<SVGSVGElement>(null);
  const lidRef = useRef<SVGGElement>(null);
  const particleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const backFillRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const mixedFillRef = useRef<HTMLImageElement | null>(null);
  const cloudRef = useRef<HTMLImageElement | null>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const { enabled: soundEnabled, toggle: toggleSound, playCrunch } = useJarSound();
  const { openNotify } = useNotifyModal();
  const hasShaken = useRef(false);

  // Stable across renders so React never detaches and re-attaches every
  // particle ref (and GSAP never loses its targets) on a label change.
  const contentTargets = useMemo<JarContentsTargets>(
    () => ({
      particle: (key, el) => {
        particleRefs.current[key] = el;
      },
      backFill: (beatId, el) => {
        backFillRefs.current[beatId] = el;
      },
      mixedFill: (el) => {
        mixedFillRef.current = el;
      },
      cloud: (el) => {
        cloudRef.current = el;
      },
    }),
    []
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const field = cloudRef.current?.parentElement;
    if (!section || !field) return;

    // Pour and mix offsets are measured in the field's own size, read
    // lazily so a resize (invalidateOnRefresh) recomputes them.
    const fieldW = () => field.offsetWidth;
    const fieldH = () => field.offsetHeight;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
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

      // Jar (and its shadow on the counter) scales/fades in once the question has gone.
      if (standRef.current) {
        tl.fromTo(standRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.045 }, 0.055);
      }

      // The cap sits parked up and off to one side for the whole pour, so
      // nothing falls *through* it. It is drawn closed in JarIllustration so
      // the static fallback shows a sealed jar; the stage is the only thing
      // that lifts it.
      if (lidRef.current) {
        gsap.set(lidRef.current, { transformOrigin: "50% 50%", ...LID_PARKED });
      }

      // Centre every sprite on its settle point up front. Done through GSAP
      // (not a CSS transform) so the pour and mix tweens below compose with
      // it rather than clobbering it.
      JAR_PARTICLES.forEach(({ key, spot }) => {
        const el = particleRefs.current[key];
        if (!el) return;
        gsap.set(el, { xPercent: -50, yPercent: -50, rotation: spot.rotation, scale: spot.scale, "--coat": 0 });
      });

      BEATS.slice(1).forEach((beat) => {
        const [start, end] = beat.progress;
        const span = end - start;

        // The pour. Pieces enter at the mouth from a narrow stream, fall
        // under gravity (accelerating, power2.in), tumbling, and land with
        // one small bounce. Bottom-most pieces first, so the pile builds up
        // from the base instead of things appearing mid-jar.
        const pieces = JAR_PARTICLES.filter((p) => p.beat.id === beat.id).sort((a, b) => b.spot.y - a.spot.y);
        const fall = span * POUR.fallShare;
        pieces.forEach(({ key, spot }, k) => {
          const el = particleRefs.current[key];
          if (!el) return;
          const at = start + (pieces.length > 1 ? k / (pieces.length - 1) : 0) * span * POUR.staggerShare;
          const streamX = 50 + (((k * 37) % 11) / 10 - 0.5) * POUR.streamWidth;
          const spin = (k % 2 ? 1 : -1) * POUR.tumbleDeg;
          tl.fromTo(
            el,
            {
              x: () => ((streamX - spot.x) / 100) * fieldW(),
              y: () => -(spot.y / 100 + MOUTH_ABOVE_FIELD) * fieldH(),
              rotation: spot.rotation + spin,
            },
            { x: 0, y: 0, rotation: spot.rotation, duration: fall, ease: "power2.in" },
            at
          );
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: fall * 0.15 }, at);
          tl.to(el, { y: () => -POUR.bounce * fieldH(), duration: fall * 0.1, ease: "power1.out" }, at + fall);
          tl.to(el, { y: 0, duration: fall * 0.1, ease: "power1.in" }, at + fall * 1.1);
        });

        // The body of the pile settles in behind the falling pieces: it
        // fades up and drops a touch as the front pieces land on it. Never
        // clipped, so it has no cut edge; its outline is only ever the
        // pieces themselves. (A clip-path reveal drew straight-edged spikes
        // through the nuts.)
        const back = backFillRefs.current[beat.id];
        if (back) {
          tl.fromTo(
            back,
            { opacity: 0, y: () => -BACK_SETTLE * fieldH() },
            { opacity: 1, y: 0, duration: span * 0.6, ease: "power1.inOut" },
            start + span * 0.3
          );
        }
      });

      // The masala beat. Per the spec it is a *cloud*, not particles: powder
      // drifts in through the mouth, spreads, and settles onto the top of
      // the pile, so the upper pieces pick up a first dusting before the
      // shake works it all the way through.
      const spice = BEATS[BEATS.length - 1];
      const [spiceStart, spiceEnd] = spice.progress;
      const spiceSpan = spiceEnd - spiceStart;
      if (washRef.current) {
        tl.fromTo(washRef.current, { opacity: 0 }, { opacity: 1, duration: spiceSpan }, spiceStart);
      }
      const cloud = cloudRef.current;
      if (cloud) {
        gsap.set(cloud, { xPercent: -50, yPercent: -50 });
        tl.fromTo(
          cloud,
          { y: () => -MOUTH_ABOVE_FIELD * fieldH(), scale: 0.6 },
          { y: () => 0.14 * fieldH(), scale: 1.2, duration: spiceSpan * 0.8, ease: "power1.out" },
          spiceStart
        );
        tl.fromTo(cloud, { opacity: 0 }, { opacity: 0.9, duration: spiceSpan * 0.22 }, spiceStart);
        tl.to(cloud, { opacity: 0, duration: spiceSpan * 0.4 }, spiceStart + spiceSpan * 0.5);
      }
      JAR_PARTICLES.forEach(({ key, spot }) => {
        const el = particleRefs.current[key];
        if (!el || spot.y > DUSTED_ABOVE_Y) return;
        tl.to(el, { "--coat": 0.35, duration: spiceSpan * 0.45 }, spiceStart + spiceSpan * 0.45);
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
      const steps = SHAKE.oscillations * 2 + 1; // + 1 to return to rest
      const stepSpan = shakeSpan / steps;

      // The lid lands first, in the opening step, so the shake reads as a
      // consequence of sealing the jar rather than something that happens
      // next to it.
      if (lidRef.current) {
        tl.to(lidRef.current, { x: 0, y: 0, rotate: 0, duration: stepSpan * 0.8, ease: "power3.in" }, shakeStart);
      }

      for (let i = 1; i < steps; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        const atRest = i === steps - 1;
        const at = shakeStart + i * stepSpan;
        if (jarWrapRef.current) {
          tl.to(
            jarWrapRef.current,
            {
              rotate: atRest ? 0 : dir * SHAKE.rotationDeg,
              x: atRest ? 0 : dir * SHAKE.translatePx,
              y: atRest ? 0 : -SHAKE.liftPx,
              duration: stepSpan,
              ease: "sine.inOut",
            },
            at
          );
        }
        // Screen shake, per the spec: a quarter of the jar's throw, on the
        // stage itself, so the copy and the rail feel the hit too.
        if (stickyRef.current) {
          tl.to(stickyRef.current, { x: atRest ? 0 : -dir * 4, duration: stepSpan, ease: "sine.inOut" }, at);
        }
      }

      // Lifted off the counter, the jar's shadow shrinks and fades, then
      // comes back as it is set down.
      if (shadowRef.current) {
        tl.to(shadowRef.current, { scaleX: 0.84, opacity: 0.5, duration: stepSpan }, shakeStart + stepSpan);
        tl.to(shadowRef.current, { scaleX: 1, opacity: 1, duration: stepSpan }, shakeEnd - stepSpan);
      }

      // The mix. Every piece tumbles through a jittered midpoint to its slot
      // in the shuffled final arrangement while the coating comes up, so by
      // the time the jar is set down the layers are gone and every piece is
      // dusted. The masala flakes dissolve into that coating, and the baked
      // back pile crossfades from layers to the mixed, coated blend.
      const mixStart = shakeStart + stepSpan;
      const mixSpan = shakeSpan - stepSpan * 1.5;
      JAR_PARTICLES.forEach(({ key, spot, mixed }, i) => {
        const el = particleRefs.current[key];
        if (!el) return;
        const lag = (i % 5) * stepSpan * 0.12;
        if (!mixed) {
          tl.to(el, { opacity: 0, scale: spot.scale * 0.4, duration: mixSpan * 0.45 }, mixStart + lag);
          return;
        }
        const dx = () => ((mixed.x - spot.x) / 100) * fieldW();
        const dy = () => ((mixed.y - spot.y) / 100) * fieldH();
        const jitter = (((i * 53) % 17) / 16 - 0.5) * 0.12;
        tl.to(
          el,
          {
            x: () => dx() * 0.5 + jitter * fieldW(),
            y: () => dy() * 0.5 - Math.abs(jitter) * fieldH(),
            rotation: (spot.rotation + mixed.rotation) / 2 + (i % 2 ? 50 : -50),
            duration: mixSpan * 0.45,
            ease: "sine.inOut",
          },
          mixStart + lag
        );
        tl.to(
          el,
          { x: dx, y: dy, rotation: mixed.rotation, scale: mixed.scale, duration: mixSpan * 0.45, ease: "power2.out" },
          mixStart + lag + mixSpan * 0.45
        );
        tl.to(el, { "--coat": 1, duration: mixSpan * 0.7 }, mixStart + mixSpan * 0.1 + lag);
      });

      Object.values(backFillRefs.current).forEach((el) => {
        if (el) tl.to(el, { opacity: 0, duration: mixSpan * 0.5 }, mixStart + mixSpan * 0.25);
      });
      if (mixedFillRef.current) {
        tl.fromTo(
          mixedFillRef.current,
          { opacity: 0 },
          { opacity: 1, duration: mixSpan * 0.5, immediateRender: false },
          mixStart + mixSpan * 0.2
        );
      }

      // A puff of the loose powder kicked up inside the sealed jar.
      if (cloud) {
        tl.fromTo(
          cloud,
          { y: () => 0.35 * fieldH(), scale: 1.4, opacity: 0 },
          { opacity: 0.5, duration: mixSpan * 0.2, immediateRender: false },
          mixStart
        );
        tl.to(cloud, { opacity: 0, duration: mixSpan * 0.45 }, mixStart + mixSpan * 0.3);
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

    // The stage mounts after hydration (only once we know motion is
    // allowed), and on a cold load ScrollTrigger never measured it: start and
    // end stayed unset until a resize, so the scrub ran out of step with the
    // scrollbar. Measure once the stage has laid out, and again whenever the
    // page above it changes height as its images arrive.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      ctx.revert();
    };
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
          <div ref={standRef} className={[styles.jarStand, styles.stageJar].join(" ")}>
            <JarShadow shadowRef={shadowRef} />
            <div ref={jarWrapRef} className={styles.jarWrap}>
              <JarIllustration lidRef={lidRef} />
              <JarContents state="layered" bindTargets={contentTargets} />
            </div>
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
