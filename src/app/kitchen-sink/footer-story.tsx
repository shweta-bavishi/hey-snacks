"use client";

import { Footer } from "@/components/footer/Footer";
import { FLAVOURS } from "@/data/flavours";

export function FooterStory() {
  return (
    <section style={{ marginBottom: "var(--s-8)" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Footer</h2>
      <p style={{ maxWidth: "62ch", marginBottom: "var(--s-4)" }}>
        Full-bleed ink panel. Shop column reads live from <code>src/data/flavours.ts</code>. Resize below 900px to see the two-column layout.
      </p>
      <Footer flavours={FLAVOURS} />
    </section>
  );
}
