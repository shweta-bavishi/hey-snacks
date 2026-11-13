"use client";

import { FLAVOURS } from "@/data/flavours";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { FlavourColumn } from "@/components/flavour-column/FlavourColumn";
import { useConnectModal } from "@/components/connect-form/ConnectModalProvider";
import styles from "./flavour-grid.module.css";

export function FlavourGrid() {
  const { openConnect, activeSlug } = useConnectModal();

  return (
    <section id="flavours" className={`${styles.section} snap-section`}>
      <SectionHeading level={2} size={3} align="center" swoosh swooshColor="var(--rani)" className={styles.heading}>
        {/* Devanagari as part of the line, not a translation of it (spec §2).
            lang lets screen readers switch voice for the Hindi word. */}
        Our <span lang="hi">मखाने</span>
      </SectionHeading>
      <div className={styles.grid}>
        {FLAVOURS.map((flavour, i) => (
          <FlavourColumn
            key={flavour.slug}
            flavour={flavour}
            index={i}
            total={FLAVOURS.length}
            pinned={activeSlug === flavour.slug}
            onConnect={(slug) => openConnect(slug)}
          />
        ))}
      </div>
    </section>
  );
}
