"use client";

import { useState } from "react";
import { ComicPanel } from "@/components/comic-panel/ComicPanel";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";

const PANELS = [
  { flavour: "pataka" as const, line: "Ekdum pataka, first bite se hi." },
  { flavour: "malai" as const, line: "Malai jaisa smooth, dil jaisa soft." },
  { flavour: "jaadu" as const, line: "Jaadu chal gaya, wapas nahi aana." },
  { flavour: "pehelwan" as const, line: "Pehelwan ki khurak, tera snack." },
];

export function ComicPanelStory() {
  const [layout, setLayout] = useState<"grid" | "solo">("grid");
  const [active, setActive] = useState(0);

  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-5)" }}>
      <h2>ComicPanel</h2>

      <div style={{ display: "flex", gap: "var(--s-3)" }}>
        <button type="button" onClick={() => setLayout("grid")}>
          Grid
        </button>
        <button type="button" onClick={() => setLayout("solo")}>
          Solo
        </button>
      </div>

      {/*
        All four panels stay mounted regardless of layout; only sizing
        changes via CSS. Each mascot is the same element/props in both
        modes, so its idle animation is never remounted by the toggle.
      */}
      <div
        style={
          layout === "grid"
            ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }
            : { display: "grid" }
        }
      >
        {PANELS.map((p, i) => (
          <div
            key={p.flavour}
            style={
              layout === "solo"
                ? { display: i === active ? "block" : "none" }
                : undefined
            }
            onClick={() => setActive(i)}
          >
            <ComicPanel
              flavour={p.flavour}
              aspect={layout === "solo" ? "16:9" : "1:1"}
              layout={layout}
              panelIndex={i}
              speech={p.line}
              mascot={<MascotAvatar flavour={p.flavour} size={56} animateIdle alt={p.flavour} />}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
