"use client";

import { Hero } from "@/components/hero/Hero";
import { Pack360 } from "@/components/hero/Pack360";
import { Pack3D } from "@/components/hero/Pack3D";
import { Starburst } from "@/components/hero/Starburst";
import { packBackImageSrc, packImageSrc } from "@/lib/packArt";
import { FLAVOURS } from "@/data/flavours";

export function HeroStory() {
  return (
    <section style={{ padding: "var(--s-6) 0", display: "grid", gap: "var(--s-5)" }}>
      <div style={{ padding: "0 var(--s-5)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Hero</h2>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          §03: live-text hero. Pack on a stepped starburst with scattered ingredients, the
          hero line, flavour, price, Batch 01 drop date and the Join button. Stacks pack-first
          on phones. The ingredient sprites come from the sheet JarStory mounts on the page.
          Pack3D below is parked from the hero (still live in Our Range).
        </p>
      </div>
      <Hero />

      <div style={{ padding: "0 var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          <strong>Pack3D</strong> — six faces built from the pack&apos;s own front/back/side art.
          Idle auto-rotate; drag or arrow keys to spin (Home resets to front); mouse wheel over
          the stage scrubs it instead of scrolling the page. Touch gets auto-rotate + keyboard
          only — drag is reserved for the page scroll. Reduced motion stops the idle spin but
          keeps drag and keyboard live.
        </p>
        <div style={{ display: "flex", gap: "var(--s-5)", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 160, height: 160, position: "relative" }}>
            <Starburst />
          </div>
          {FLAVOURS.map((flavour) => (
            <Pack3D
              key={flavour.slug}
              front={packImageSrc(flavour.slug)}
              back={packBackImageSrc(flavour.slug)}
              theme={flavour.theme}
              alt={`${flavour.name} pack`}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: "0 var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          <strong>Pack360</strong> — kept for the day a real photographed/rendered 36-frame
          sequence exists (spec §03 Path B). With no <code>frames</code> supplied it renders a
          flat static image only; every scrub/drag affordance hides itself rather than
          pretending to spin nothing.
        </p>
        <Pack360 staticSrc={packImageSrc(FLAVOURS[0].slug)} alt="Static pack, no frames supplied" />
      </div>
    </section>
  );
}
