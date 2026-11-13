"use client";

import { ComicIntro } from "@/components/comic-intro/ComicIntro";

export function ComicIntroStory() {
  return (
    <section style={{ padding: "var(--s-6) 0", display: "grid", gap: "var(--s-5)" }}>
      <div style={{ padding: "0 var(--s-5)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Comic Intro</h2>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          §04 — arrow-key the mascot tab row (a real tablist) to swap to a solo panel; ↻ shuffles
          the 2×2 order.
        </p>
      </div>
      <ComicIntro />
    </section>
  );
}
