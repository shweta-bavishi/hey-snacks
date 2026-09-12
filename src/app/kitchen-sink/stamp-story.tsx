import { Stamp, stampHoverGroup, StampVariant } from "@/components/stamp/Stamp";

const VARIANTS: StampVariant[] = ["sold-out", "coming-soon", "limited", "new"];

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
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--s-6)" }}>{children}</div>
    </div>
  );
}

function FakeProductCard({ variant, rotation }: { variant: StampVariant; rotation?: number }) {
  return (
    <div
      className={stampHoverGroup}
      style={{
        position: "relative",
        width: 160,
        height: 160,
        border: "var(--stroke) solid var(--ink)",
        borderRadius: "var(--radius)",
        background: "var(--accent-tint)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <Stamp variant={variant} rotation={rotation} />
    </div>
  );
}

export function StampStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>Stamp</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          The mark over every shop card. Every product is sold out — this is the difference between
          &ldquo;exclusive&rdquo; and &ldquo;broken&rdquo;. Hover a card for the one-shot jitter.
        </p>
      </div>

      <Row label="Variants (default rotation, -12deg)">
        {VARIANTS.map((variant) => (
          <FakeProductCard key={variant} variant={variant} />
        ))}
      </Row>

      <Row label="Custom rotation prop">
        <FakeProductCard variant="sold-out" rotation={8} />
        <FakeProductCard variant="sold-out" rotation={0} />
        <FakeProductCard variant="sold-out" rotation={-24} />
      </Row>

      <Row label="Custom label text">
        <div className={stampHoverGroup} style={{ position: "relative", width: 160, height: 160, border: "var(--stroke) solid var(--ink)", background: "var(--accent-tint)" }}>
          <Stamp variant="limited">Only 12 left</Stamp>
        </div>
      </Row>
    </div>
  );
}
