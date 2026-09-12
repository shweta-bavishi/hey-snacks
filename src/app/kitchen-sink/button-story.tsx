import { Button, ButtonVariant, ButtonSize } from "@/components/button/Button";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "danger"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];

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

export function ButtonStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Button
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Polymorphic, presses into the page on click, ring stays visible on any flavour.
        </p>
      </div>

      <Row label="Variants">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            Order now
          </Button>
        ))}
      </Row>

      <Row label="Sizes">
        {SIZES.map((size) => (
          <Button key={size} size={size}>
            Order now
          </Button>
        ))}
      </Row>

      <Row label="Icon-only (44px touch target even at sm)">
        {SIZES.map((size) => (
          <Button key={size} size={size} iconOnly aria-label="Next">
            →
          </Button>
        ))}
      </Row>

      <Row label="States">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Placing order</Button>
      </Row>

      <Row label="Polymorphic (as='a')">
        <Button as="a" href="#kitchen-sink">
          Go to link
        </Button>
      </Row>

      <Row label="Focus ring across flavours">
        <div data-theme="pataka" style={{ padding: "var(--s-4)", background: "var(--accent)" }}>
          <Button variant="secondary">Pataka</Button>
        </div>
        <div data-theme="malai" style={{ padding: "var(--s-4)", background: "var(--accent)" }}>
          <Button variant="secondary">Malai</Button>
        </div>
        <div data-theme="jaadu" style={{ padding: "var(--s-4)", background: "var(--accent)" }}>
          <Button variant="secondary">Jaadu</Button>
        </div>
        <div data-theme="pehelwan" style={{ padding: "var(--s-4)", background: "var(--accent)" }}>
          <Button variant="secondary">Pehelwan</Button>
        </div>
      </Row>
    </div>
  );
}
