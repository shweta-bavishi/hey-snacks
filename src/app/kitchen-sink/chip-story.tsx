"use client";

import { useState } from "react";
import { Chip, ChipGroup, ChipTheme } from "@/components/chip/Chip";

const FLAVOURS: { theme: ChipTheme; short: string }[] = [
  { theme: "pataka", short: "Pataka" },
  { theme: "malai", short: "Malai" },
  { theme: "jaadu", short: "Jaadu" },
  { theme: "pehelwan", short: "Pehelwan" },
];

const THEMES = FLAVOURS.map((f) => f.theme);

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-label)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--ink)",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--s-4)" }}>{children}</div>
    </div>
  );
}

function NotifyFormDemo() {
  const [selected, setSelected] = useState<Set<ChipTheme>>(new Set(["pataka"]));

  const toggle = (theme: ChipTheme, next: boolean) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(theme);
      else copy.delete(theme);
      return copy;
    });
  };

  return (
    <ChipGroup label="Which flavour?">
      {FLAVOURS.map((f) => (
        <Chip key={f.theme} theme={f.theme} selected={selected.has(f.theme)} onToggle={(next) => toggle(f.theme, next)}>
          {f.short}
        </Chip>
      ))}
    </ChipGroup>
  );
}

function PollDemo() {
  const [selected, setSelected] = useState<ChipTheme | null>("jaadu");
  const votes: Record<ChipTheme, number> = { pataka: 41, malai: 18, jaadu: 27, pehelwan: 14 };

  return (
    <ChipGroup label="Design our next flavour poll">
      {FLAVOURS.map((f) => (
        <Chip
          key={f.theme}
          theme={f.theme}
          selected={selected === f.theme}
          onToggle={(next) => setSelected(next ? f.theme : null)}
          meta={`${votes[f.theme]}%`}
        >
          {f.short}
        </Chip>
      ))}
    </ChipGroup>
  );
}

export function ChipStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>Chip</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Toggleable flavour selector. A filter, not a form field — a{" "}
          <code>{"<button aria-pressed>"}</code>, not a checkbox. Used in the notify form and the next-flavour poll.
        </p>
      </div>

      <Row label="Unselected, all four themes">
        {THEMES.map((theme) => (
          <Chip key={theme} theme={theme} selected={false}>
            {theme}
          </Chip>
        ))}
      </Row>

      <Row label="Selected, all four themes">
        {THEMES.map((theme) => (
          <Chip key={theme} theme={theme} selected>
            {theme}
          </Chip>
        ))}
      </Row>

      <Row label="Disabled">
        <Chip theme="pataka" selected={false} disabled>
          pataka
        </Chip>
        <Chip theme="jaadu" selected disabled>
          jaadu
        </Chip>
      </Row>

      <Row label="With trailing meta (poll variant, arrow keys + space to vote)">
        <PollDemo />
      </Row>

      <Row label="Multi-select group (notify form variant, arrow keys move focus)">
        <NotifyFormDemo />
      </Row>
    </div>
  );
}
