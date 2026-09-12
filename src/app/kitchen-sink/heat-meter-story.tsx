import { HeatMeter } from "@/components/heat-meter/HeatMeter";

const THEMES: { theme: "pataka" | "malai" | "jaadu" | "pehelwan"; tint: string }[] = [
  { theme: "pataka", tint: "var(--pataka-tint)" },
  { theme: "malai", tint: "var(--malai-tint)" },
  { theme: "jaadu", tint: "var(--jaadu-tint)" },
  { theme: "pehelwan", tint: "var(--pehelwan-tint)" },
];

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

export function HeatMeterStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>Heat Meter</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Five ink squares, not chilli icons — reads at a glance and survives a black-and-white print.
          Static rating, so it&apos;s <code>{'role="img"'}</code> with one full aria-label, not five
          decorative divs and not a live-measurement <code>{"<meter>"}</code>.
        </p>
      </div>

      <Row label="Values 1–5, md">
        {[1, 2, 3, 4, 5].map((v) => (
          <HeatMeter key={v} value={v as 1 | 2 | 3 | 4 | 5} />
        ))}
      </Row>

      <Row label="With label">
        <HeatMeter value={4} label />
        <HeatMeter value={2} glyph="crunch" label />
      </Row>

      <Row label="Sizes">
        <HeatMeter value={3} size="md" />
        <HeatMeter value={3} size="sm" />
      </Row>

      <Row label="Crunch variant (diagonal split, never mistaken for heat)">
        <HeatMeter value={5} glyph="crunch" />
        <HeatMeter value={3} glyph="crunch" label />
      </Row>

      <Row label="On every flavour tint — ink squares stay legible without colour">
        {THEMES.map(({ theme, tint }) => (
          <div
            key={theme}
            style={{
              padding: "var(--s-3)",
              background: tint,
              border: "var(--stroke) solid var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--s-2)",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-label)", color: "var(--ink)" }}>
              {theme}
            </span>
            <HeatMeter value={4} label />
          </div>
        ))}
      </Row>
    </div>
  );
}
