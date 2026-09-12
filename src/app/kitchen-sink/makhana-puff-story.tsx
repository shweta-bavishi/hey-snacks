import { MakhanaPuff, MakhanaPuffShape, MakhanaPuffVariant } from "@/components/makhana-puff/MakhanaPuff";
import styles from "@/components/makhana-puff/makhana-puff.module.css";

const VARIANTS: MakhanaPuffVariant[] = ["default", "toasted", "spiced"];
const SHAPES: MakhanaPuffShape[] = ["a", "b", "c"];
const SIZES = [8, 16, 24, 40, 64, 96, 140, 200];

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

export function MakhanaPuffStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          MakhanaPuff
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          One puffed-seed SVG, four jobs: decoration, particle, spinner, confetti. Outline
          thickness eases non-linearly with size so it never disappears at 8px or turns fat at
          200px.
        </p>
      </div>

      <Row label="Sizes (default, shape a)">
        {SIZES.map((size) => (
          <MakhanaPuff key={size} size={size} shape="a" />
        ))}
      </Row>

      <Row label="Variants">
        {VARIANTS.map((variant) => (
          <MakhanaPuff key={variant} size={64} variant={variant} shape="b" />
        ))}
      </Row>

      <Row label="Shapes (scatter, not copy-pasted)">
        {SHAPES.map((shape) => (
          <MakhanaPuff
            key={shape}
            size={56}
            shape={shape}
            rotation={shape === "b" ? 25 : shape === "c" ? -18 : 0}
          />
        ))}
      </Row>

      <Row label="Loading spinner (respects prefers-reduced-motion)">
        <div role="status" aria-label="Loading">
          <MakhanaPuff size={40} shape="a" className={styles.spin} />
        </div>
      </Row>

      <Row label="Confetti scatter">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-3)" }} aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <MakhanaPuff
              key={i}
              size={14 + (i % 3) * 6}
              shape={SHAPES[i % SHAPES.length]}
              variant={VARIANTS[i % VARIANTS.length]}
              rotation={(i * 47) % 360}
            />
          ))}
        </div>
      </Row>

      <Row label="Labelled (rare, when it carries meaning)">
        <MakhanaPuff size={40} shape="a" label="hey. brand mark" />
      </Row>
    </div>
  );
}
