import { Pill, PillTone } from "@/components/pill/Pill";

const TONES: PillTone[] = ["default", "accent", "inverse"];

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

export function PillStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>Pill</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          The only fully-round shape on the page. Eyebrows, ⌘K, nutrition badges, the SKIP link.
        </p>
      </div>

      <Row label="Tones (variant: label)">
        {TONES.map((tone) => (
          <Pill key={tone} tone={tone}>
            Vegan
          </Pill>
        ))}
      </Row>

      <Row label="Leading glyph">
        <Pill glyph>Roasted, not fried</Pill>
        <Pill glyph tone="accent">
          Gluten-free
        </Pill>
      </Row>

      <Row label="Action (states: default / hover / focus / active / disabled)">
        <Pill variant="action">Skip</Pill>
        <Pill variant="action" tone="accent">
          Filter
        </Pill>
        <Pill variant="action" disabled>
          Sold out
        </Pill>
      </Row>

      <Row label="Kbd — squared, not round">
        <Pill variant="kbd" aria-label="Open command palette with Command K">
          ⌘K
        </Pill>
      </Row>

      <Row label="Focus ring across flavours">
        <div data-theme="pataka" style={{ padding: "var(--s-4)", background: "var(--accent)" }}>
          <Pill variant="action">Pataka</Pill>
        </div>
        <div data-theme="jaadu" style={{ padding: "var(--s-4)", background: "var(--accent)" }}>
          <Pill variant="action">Jaadu</Pill>
        </div>
      </Row>
    </div>
  );
}
