"use client";

import { useRef, useState } from "react";
import { FLAVOURS } from "@/data/flavours";
import type { FlavourSlug } from "@/data/flavours";
import { Pill } from "@/components/pill/Pill";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import mascotStyles from "@/components/mascot-avatar/mascot-avatar.module.css";
import { MascotCutout } from "@/components/mascot-cutout/MascotCutout";
import { ComicPanel } from "@/components/comic-panel/ComicPanel";
import { ScrollReveal } from "@/components/scroll-reveal/ScrollReveal";
import styles from "./comic-intro.module.css";

export function ComicIntro() {
  const [solo, setSolo] = useState<FlavourSlug>(FLAVOURS[0].slug);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const soloFlavour = FLAVOURS.find((f) => f.slug === solo)!;

  const shuffle = () => {
    const currentIndex = FLAVOURS.findIndex((f) => f.slug === solo);
    setSolo(FLAVOURS[(currentIndex + 1) % FLAVOURS.length].slug);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % FLAVOURS.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + FLAVOURS.length) % FLAVOURS.length;
    if (nextIndex !== null) {
      event.preventDefault();
      tabRefs.current[nextIndex]?.focus();
      setSolo(FLAVOURS[nextIndex].slug);
    }
  };

  return (
    <section id="mascots" className={styles.section} data-theme={soloFlavour?.theme}>
      <div className={styles.left}>
        <ScrollReveal>
          <Pill glyph className={styles.eyebrow}>
            MEET THE GANG
          </Pill>
          <h2 className={styles.heading}>Four flavours. Zero chill.</h2>
          <p className={styles.body}>
            Makhana is a lotus seed, popped and roasted until it crunches. We mix it with
            almonds, cashews, peanuts and seeds.
          </p>
          <p className={styles.body}>
            Hum ise roast karte hain, season karte hain hard, and put it in a box that four
            extremely opinionated characters refuse to share.
          </p>
          <div
            role="tablist"
            aria-label="Flavour mascots"
            className={[styles.tabRow, mascotStyles.mascotHoverScope].join(" ")}
          >
            {FLAVOURS.map((flavour, i) => (
              <button
                key={flavour.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`comic-tab-${flavour.slug}`}
                aria-selected={solo === flavour.slug}
                aria-controls="comic-panel-region"
                tabIndex={solo === flavour.slug ? 0 : -1}
                className={styles.tab}
                data-active={solo === flavour.slug || undefined}
                onClick={() => setSolo(flavour.slug)}
                onKeyDown={(e) => handleTabKeyDown(e, i)}
              >
                <MascotAvatar flavour={flavour.theme} size={56} animateIdle alt={flavour.short} />
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div
        className={[styles.right, mascotStyles.mascotHoverScope].join(" ")}
        id="comic-panel-region"
        role="tabpanel"
      >
        <button type="button" className={styles.shuffle} onClick={shuffle} aria-label="Shuffle panels">
          ↻
        </button>
        <ComicPanel
          key={soloFlavour.slug}
          flavour={soloFlavour.theme}
          layout="solo"
          speech={soloFlavour.line}
          mascot={
            <MascotCutout flavour={soloFlavour.theme} height={220} animateIdle alt={soloFlavour.short} />
          }
          aspect="4:3"
        />
      </div>
    </section>
  );
}
