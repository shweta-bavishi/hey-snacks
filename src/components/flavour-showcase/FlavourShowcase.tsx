"use client";

import { useRef, useState } from "react";
import { FLAVOURS } from "@/data/flavours";
import type { FlavourSlug } from "@/data/flavours";
import { Pill } from "@/components/pill/Pill";
import { Pack3D } from "@/components/hero/Pack3D";
import { Grain } from "@/components/grain/Grain";
import { ScrollReveal } from "@/components/scroll-reveal/ScrollReveal";
import { packBackImageSrc, packImageSrc } from "@/lib/packArt";
import styles from "./flavour-showcase.module.css";

// Base recipe every pack shares (docs/packaging-back-panel-plan.md §8,
// heaviest ingredient first) — only the seasoning changes per flavour, so
// it's spelled out once here rather than repeated in each tasteNote.
const BASE_INGREDIENTS = "Peanuts, Makhana, Almonds, Cashews, Seeds, Sunflower Oil, Salt";

export function FlavourShowcase() {
  const [active, setActive] = useState<FlavourSlug>(FLAVOURS[0].slug);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = FLAVOURS.findIndex((f) => f.slug === active);
  const activeFlavour = FLAVOURS[activeIndex];

  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % FLAVOURS.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      nextIndex = (index - 1 + FLAVOURS.length) % FLAVOURS.length;
    if (nextIndex !== null) {
      event.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      setActive(FLAVOURS[nextIndex].slug);
    }
  };

  return (
    <section id="range" className={`${styles.section} snap-section`} data-theme={activeFlavour.theme}>
      <Grain scope="panel" intensity="subtle" className={styles.grain} />
      <div className={styles.left}>
        <ScrollReveal>
          <Pill glyph className={styles.eyebrow}>
            OUR RANGE
          </Pill>
          <h2 className={styles.heading}>Chaar flavours, ek recipe.</h2>
          <p className={styles.body}>
            One roasted mix, four seasonings. No dairy, no palm oil, no added preservatives.
          </p>

          <div
            role="tablist"
            aria-label="Flavour range"
            aria-orientation="vertical"
          className={styles.tabList}
          >
            {FLAVOURS.map((flavour, i) => (
              <button
                key={flavour.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`range-tab-${flavour.slug}`}
                aria-selected={active === flavour.slug}
                aria-controls="range-panel"
                tabIndex={active === flavour.slug ? 0 : -1}
                className={styles.tab}
                data-active={active === flavour.slug || undefined}
                data-flavour-theme={flavour.theme}
                onClick={() => setActive(flavour.slug)}
                onKeyDown={(e) => handleTabKeyDown(e, i)}
              >
                <span className={styles.tabIndex}>
                  0{i + 1}/0{FLAVOURS.length}
                </span>
                <span className={styles.tabName}>{flavour.name}</span>
              </button>
            ))}
          </div>

          <div
            id="range-panel"
            role="tabpanel"
            aria-labelledby={`range-tab-${activeFlavour.slug}`}
          className={styles.panel}
          >
            <p className={styles.tasteNote}>{activeFlavour.tasteNote}</p>
            <p className={styles.ingredients}>
              <span className={styles.ingredientsLabel}>INGREDIENTS </span>
              {BASE_INGREDIENTS}, {activeFlavour.flavour} seasoning.
            </p>
            <div className={styles.priceRow}>
              <span className={styles.mrp}>₹{activeFlavour.mrp}</span>
              <span className={styles.price}>₹{activeFlavour.price}</span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className={styles.right}>
        <Pack3D
          key={activeFlavour.slug}
          front={packImageSrc(activeFlavour.slug)}
          back={packBackImageSrc(activeFlavour.slug)}
          theme={activeFlavour.theme}
          alt={`${activeFlavour.name} pack`}
          className={styles.pack}
        />
      </div>
    </section>
  );
}
