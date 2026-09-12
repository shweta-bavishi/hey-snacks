"use client";

import { CommandPaletteTrigger } from "@/components/command-palette/CommandPaletteTrigger";
import { useCommandPalette } from "@/components/command-palette/CommandPaletteProvider";

export function CommandPaletteStory() {
  const { openPalette } = useCommandPalette();

  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-5)" }}>
      <h2>CommandPalette</h2>
      <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
        ⌘K / Ctrl+K, the pill below, or &ldquo;/&rdquo; anywhere outside an input. Try typing{" "}
        <code>peri</code>, <code>pudina</code>, or <code>mint</code> — the last two both find
        Pudina Pehelwan. Select &ldquo;Notify me&rdquo; to see it morph into the inline form
        in place.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)" }}>
        <CommandPaletteTrigger />
        <button
          type="button"
          onClick={openPalette}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-label)",
            textDecoration: "underline",
          }}
        >
          or click here
        </button>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-label)", opacity: 0.6 }}>
        The mobile floating bubble only shows below 640px — resize the viewport to see it.
      </p>
    </section>
  );
}
