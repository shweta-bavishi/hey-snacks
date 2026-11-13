"use client";

import { FLAVOURS } from "@/data/flavours";
import { BATCH, JOIN_LABEL } from "@/data/launch";
import { Button } from "@/components/button/Button";
import { Pill } from "@/components/pill/Pill";
import { Grain } from "@/components/grain/Grain";
import { HeatMeter } from "@/components/heat-meter/HeatMeter";
import { useNotifyModal } from "@/components/notify-form/NotifyModalProvider";
import { Starburst } from "./Starburst";
import styles from "./hero.module.css";

// Hero flavour default, per spec §14: Pataka Peri Peri, Chilli Red.
const HERO_FLAVOUR = FLAVOURS[0];

// Photographic hero art from the Hero Pataka export: the pouch, a bowl of the
// mix and real chillies. Placed as percentages of the square stage so the
// whole composition scales as one piece.
const HERO_ART = {
  pouch: "/hero/pataka-pouch.webp",
  bowl: "/hero/pataka-bowl.webp",
  chillies: "/hero/chillies.png",
  flakes: "/hero/chilli-flakes.png",
} as const;

/**
 * Real text, not a picture of text: the line, flavour, price and drop date
 * are live HTML, so they can change without new artwork, stay sharp and
 * readable on a phone, and reach screen readers and search engines. Only
 * the pack, starburst and scattered ingredients are illustration.
 *
 * No motion here beyond the shared Button's own hover/press states, so
 * there is no separate reduced-motion path to maintain.
 */
export function Hero() {
  const { openNotify } = useNotifyModal();

  const handleJoin = () => {
    openNotify(HERO_FLAVOUR.slug, "hero").catch(() => {});
  };

  return (
    <section
      className={`${styles.hero} snap-section`}
      data-theme={HERO_FLAVOUR.theme}
      aria-labelledby="hero-title"
    >
      <div className={styles.poster}>
        <Grain scope="panel" intensity="subtle" className={styles.grain} />

        <div className={styles.copy}>
          <Pill glyph className={styles.eyebrow}>
            CHOLESTEROL-FREE ✱ GLUTEN-FREE ✱ ROASTED, NOT FRIED
          </Pill>

          <p className={styles.tagline}>
            Hawa nahi, <span className={styles.taglineEmphasis}>protein hai.</span>
          </p>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.titleLine}>{HERO_FLAVOUR.short}</span>{" "}
            <span className={styles.titleLine}>{HERO_FLAVOUR.flavour}</span>
          </h1>

          <div className={styles.meta}>
            <HeatMeter value={HERO_FLAVOUR.heat} size="sm" />
            <span className={styles.heatLabel} aria-hidden="true">
              HEAT {HERO_FLAVOUR.heat} / 5
            </span>
            <span className={styles.mrp}>
              <span className={styles.srOnly}>MRP </span>₹{HERO_FLAVOUR.mrp}
            </span>
            <span className={styles.price}>
              <span className={styles.srOnly}>Launch price </span>₹{HERO_FLAVOUR.price}
            </span>
          </div>

          <div className={styles.drop}>
            <p className={styles.dropText}>
              <span className={styles.dropBatch}>{BATCH.name}</span>
              <span>
                drops <time dateTime={BATCH.dropDate}>{BATCH.dropDateLong}</time>
              </span>
            </p>
            <Button variant="primary" size="lg" className={styles.cta} onClick={handleJoin}>
              {JOIN_LABEL}
            </Button>
          </div>
        </div>

        <div className={styles.stage}>
          <Starburst className={styles.starburst} />
          {/* eslint-disable @next/next/no-img-element -- static hero art, same as ProductCard */}
          <img src={HERO_ART.chillies} alt="" width={812} height={638} className={styles.chillies} />
          <img src={HERO_ART.flakes} alt="" width={216} height={109} className={styles.flakes} />
          <img
            src={HERO_ART.pouch}
            alt={`${HERO_FLAVOUR.name} pouch`}
            width={860}
            height={1151}
            className={styles.pack}
            fetchPriority="high"
          />
          <img
            src={HERO_ART.bowl}
            alt={`Bowl of ${HERO_FLAVOUR.name} mix`}
            width={1100}
            height={809}
            className={styles.bowl}
          />
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PARKED: the animated hero extras, switched off before this rewrite and kept
// here because this file has no git history to recover them from.
//   * MascotCutout peeking in from the edge (shoulders and eyes only)
//   * makhana puffs that drift on a sine path and dodge the cursor
//   * Pack3D, the pack as a real 3D box you can drag or arrow-key to spin
// The live hero above already renders the Starburst and the real text, so
// restoring these means adding the pieces below back into its JSX.
// ---------------------------------------------------------------------------
// --- Disabled: interactive hero (rotating Pack3D, mascot peek, cursor-
// reactive puffs). Swapped for the static banner image rendered in the JSX
// below. To restore: uncomment this block, the imports above, `ref` and
// state in Hero(), and the JSX further down — then remove the <img> and the
// sr-only heading that replaced it.
//
// // All four sit in the right-hand half, around the pack. The text column is
// // deliberately left clear — a puff drifting across the tagline or the
// // display type reads as a rendering bug, not as decoration.
// const PUFF_LAYOUT = [
// { top: "16%", left: "58%", size: 28, rotation: -8 },
// { top: "72%", left: "54%", size: 20, rotation: 14 },
// { top: "24%", left: "92%", size: 24, rotation: 22 },
// { top: "68%", left: "88%", size: 18, rotation: -16 },
// ];
// --- end disabled ---
//
// --- Disabled: puff physics + reduced-motion tracking (see block above) ---
// const sectionRef = useRef<HTMLElement>(null);
// const [reducedMotion, setReducedMotion] = useState(false);
//
// useEffect(() => {
// const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
// setReducedMotion(mq.matches);
// const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
// mq.addEventListener("change", onChange);
// return () => mq.removeEventListener("change", onChange);
// }, []);
//
// // Puffs drift on a sine path and repel from the cursor within 120px.
// // Reduced motion: they sit still at their base position, no listener.
// useEffect(() => {
// if (reducedMotion) return;
// const section = sectionRef.current;
// if (!section) return;
//
// let raf = 0;
// let pointer: { x: number; y: number } | null = null;
// const start = performance.now();
//
// const onMove = (e: PointerEvent) => {
// const rect = section.getBoundingClientRect();
// pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
// };
// section.addEventListener("pointermove", onMove);
//
// const puffEls = Array.from(section.querySelectorAll<HTMLElement>("[data-hero-puff]"));
//
// const tick = (now: number) => {
// const t = (now - start) / 1000;
// puffEls.forEach((el, i) => {
// const baseX = parseFloat(el.dataset.baseX ?? "0");
// const baseY = parseFloat(el.dataset.baseY ?? "0");
// let dx = Math.sin(t * 0.6 + i) * 10;
// let dy = Math.cos(t * 0.5 + i) * 8;
//
// if (pointer) {
// const cx = baseX + dx;
// const cy = baseY + dy;
// const distX = cx - pointer.x;
// const distY = cy - pointer.y;
// const dist = Math.hypot(distX, distY);
// if (dist < 120 && dist > 0) {
// const push = (120 - dist) / 120;
// dx += (distX / dist) * push * 30;
// dy += (distY / dist) * push * 30;
// }
// }
// el.style.transform = `translate(${dx}px, ${dy}px)`;
// });
// raf = requestAnimationFrame(tick);
// };
// raf = requestAnimationFrame(tick);
//
// return () => {
// section.removeEventListener("pointermove", onMove);
// cancelAnimationFrame(raf);
// };
// }, [reducedMotion]);
//
// const visiblePuffs = PUFF_LAYOUT.slice(0, reducedMotion ? 2 : 4);
// --- end disabled ---
//
//       {/*
//         Disabled: interactive hero — Starburst, mascot peek, cursor-reactive
//         puffs, rotating Pack3D, and the real text/price column. Replaced below
//         by a static banner (flavour-only marketing asset) plus a sr-only
//         heading and the still-functional CTA. To restore, delete the <img> +
//         sr-only heading below and uncomment this block along with the
//         imports/state/effects above.
//
//       <Grain scope="panel" intensity="subtle" className={styles.grain} />
//       <div className={styles.starburstWrap} aria-hidden="true">
//         <Starburst />
//       </div>
//
//       <MascotCutout
//         flavour={HERO_FLAVOUR.theme}
//         height={320}
//         className={styles.mascotPeek}
//       />
//
//       {visiblePuffs.map((puff, i) => (
//         <span
//           key={i}
//           data-hero-puff
//           data-base-x={puff.left}
//           data-base-y={puff.top}
//           className={styles.puff}
//           style={{ top: puff.top, left: puff.left }}
//         >
//           <MakhanaPuff size={puff.size} rotation={puff.rotation} shape={i % 2 === 0 ? "a" : "b"} />
//         </span>
//       ))}
//
//       <div className={styles.packStage}>
//         <Pack3D
//           front={packImageSrc(HERO_FLAVOUR.slug)}
//           back={packBackImageSrc(HERO_FLAVOUR.slug)}
//           theme={HERO_FLAVOUR.theme}
//           alt={`${HERO_FLAVOUR.name} pack`}
//         />
//       </div>
//
//       <div className={styles.content}>
//         <Pill glyph className={styles.eyebrow}>
//           CHOLESTEROL-FREE ✱ GLUTEN-FREE ✱ ROASTED, NOT FRIED
//         </Pill>
//         <p className={styles.tagline}>Roasted right, snacked light.</p>
//         <h1 className={styles.title}>
//           {HERO_FLAVOUR.short.toUpperCase()}
//           <br />
//           {HERO_FLAVOUR.flavour.toUpperCase()}
//         </h1>
//         <div className={styles.priceRow}>
//           <span className={styles.mrp}>₹{HERO_FLAVOUR.mrp}</span>
//           <span className={styles.price}>₹{HERO_FLAVOUR.price}</span>
//         </div>
//         <Button
//           variant="primary"
//           size="lg"
//           className={styles.cta}
//           onClick={() => {
//             openNotify(HERO_FLAVOUR.slug, "hero").catch(() => {});
//           }}
//         >
//           Notify Me
//         </Button>
//       </div>
//       */}
