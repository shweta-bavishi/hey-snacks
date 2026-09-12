import { SectionHeading } from "@/components/section-heading/SectionHeading";

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
      {children}
    </div>
  );
}

export function SectionHeadingStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-7)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          SectionHeading
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Eyebrow + headline + lede + swoosh, composed. Semantic level and visual size are set
          separately so a page keeps one true h1 while every section still looks h1-scale.
        </p>
      </div>

      <Row label="Default, left-aligned">
        <SectionHeading eyebrow="05 // flavours" level={2} lede="Hawa nahi, protein hai. Chaar flavour, ek hi jazba.">
          Our Makhanas
        </SectionHeading>
      </Row>

      <Row label="Centered, with swoosh">
        <SectionHeading align="center" level={2} swoosh>
          Our Makhanas
        </SectionHeading>
      </Row>

      <Row label="Misregister (default --rani offset)">
        <SectionHeading align="center" level={2} misregister swoosh>
          Roasted in Bihar
        </SectionHeading>
      </Row>

      <Row label="Misregister with custom colour">
        <SectionHeading align="left" level={2} misregister misregisterColor="var(--peacock)">
          Ruined for Anything Else
        </SectionHeading>
      </Row>

      <Row label="Swoosh variants (1, 2, 3)">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
          <SectionHeading level={3} swoosh swooshVariant={1}>
            Variant one
          </SectionHeading>
          <SectionHeading level={3} swoosh swooshVariant={2}>
            Variant two
          </SectionHeading>
          <SectionHeading level={3} swoosh swooshVariant={3}>
            Variant three
          </SectionHeading>
        </div>
      </Row>

      <Row label="Level h1 semantics, small visual size (decoupled)">
        <SectionHeading level={1} size={3} eyebrow="Section 01">
          Reads h1 to a screen reader, sized like an h3
        </SectionHeading>
      </Row>

      <Row label="Level h4 semantics, large visual size (decoupled)">
        <SectionHeading level={4} size={1}>
          Reads h4 to a screen reader, sized like an h1
        </SectionHeading>
      </Row>
    </div>
  );
}
