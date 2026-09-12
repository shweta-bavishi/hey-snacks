import { ScrollReveal } from "@/components/scroll-reveal/ScrollReveal";

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

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "var(--s-4) var(--s-5)",
        background: "var(--accent-tint)",
        border: "var(--stroke) solid var(--ink)",
        boxShadow: "var(--shadow-sm)",
        fontFamily: "var(--font-body)",
        color: "var(--ink)",
      }}
    >
      {children}
    </div>
  );
}

export function ScrollRevealStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>ScrollReveal</p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          The one reveal every section uses: translateY(24px) to 0, opacity 0 to 1, nothing else. Scroll this section
          into view to see it fire. Toggle reduced motion in your OS to see the no-animation path.
        </p>
      </div>

      <Row label="Single block, default threshold">
        <ScrollReveal>
          <Block>Ek hi reveal, har jagah — no scale, no blur, no rotation.</Block>
        </ScrollReveal>
      </Row>

      <Row label="Staggered direct children (stagger=90ms)">
        <ScrollReveal stagger={90}>
          <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
            <Block>Pehla</Block>
            <Block>Doosra</Block>
            <Block>Teesra</Block>
          </div>
        </ScrollReveal>
      </Row>

      <Row label="Delay (400ms) before it starts">
        <ScrollReveal delay={400}>
          <Block>Thoda ruk ke aata hai — delay is 400ms.</Block>
        </ScrollReveal>
      </Row>

      <Row label="once=false — re-arms every time it leaves and re-enters">
        <ScrollReveal once={false}>
          <Block>Scroll away and back — this one repeats.</Block>
        </ScrollReveal>
      </Row>
    </div>
  );
}
