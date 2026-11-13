"use client";

import { Faq } from "@/components/faq/Faq";

export function FaqStory() {
  return (
    <section style={{ padding: "var(--s-6) 0", display: "grid", gap: "var(--s-5)" }}>
      <div style={{ padding: "0 var(--s-5)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>FAQ</h2>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          §10 — native details/summary accordion, free keyboard + screen-reader behaviour.
        </p>
      </div>
      <Faq />
    </section>
  );
}
