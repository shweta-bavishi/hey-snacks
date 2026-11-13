"use client";

import { FlavourGrid } from "@/components/flavour-grid/FlavourGrid";

export function FlavourGridStory() {
  return (
    <section style={{ padding: "var(--s-6) 0", display: "grid", gap: "var(--s-5)" }}>
      <div style={{ padding: "0 var(--s-5)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Flavour Grid</h2>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          §05 — the 4-column wrapper around FlavourColumn. Hover or tab through each column.
        </p>
      </div>
      <FlavourGrid />
    </section>
  );
}
