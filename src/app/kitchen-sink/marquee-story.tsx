import { Marquee } from "@/components/marquee/Marquee";

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

const DECORATIVE_ITEMS = ["100% BIHAR MAKHANA", "ZERO PALM OIL", "कुरकुरा"];
const SHIPPING_ITEMS = ["FREE SHIPPING OVER ₹499", "100% BIHAR MAKHANA", "ZERO PALM OIL"];

export function MarqueeStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>Marquee</p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--fs-body)",
            color: "var(--ink)",
            maxWidth: "62ch",
          }}
        >
          Three instances live on the page: the top announcement bar (real message, announced once) and two
          section-divider bars (decorative, alternating direction and tone).
        </p>
      </div>

      <Row label="01 — announcement bar (carries the shipping threshold)">
        <Marquee items={SHIPPING_ITEMS} tone="marigold" direction="left" speed={36} decorative={false} />
      </Row>

      <Row label="05→06 divider (decorative, reversed direction, peacock)">
        <Marquee items={DECORATIVE_ITEMS} tone="peacock" direction="right" speed={30} />
      </Row>

      <Row label="08→09 divider (decorative, rani)">
        <Marquee items={DECORATIVE_ITEMS} tone="rani" direction="left" speed={44} />
      </Row>

      <Row label="ink tone">
        <Marquee items={DECORATIVE_ITEMS} tone="ink" direction="left" speed={30} />
      </Row>

      <Row label="Pause on hover — hover over it to confirm it stops">
        <Marquee
          items={["HOVER OR TAB HERE", "SHOULD FREEZE"]}
          tone="marigold"
          direction="left"
          speed={20}
        />
      </Row>
    </div>
  );
}
