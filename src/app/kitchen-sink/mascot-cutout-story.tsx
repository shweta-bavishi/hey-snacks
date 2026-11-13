import { MascotCutout, MascotCutoutExpression } from "@/components/mascot-cutout/MascotCutout";
import { MascotFlavour } from "@/components/mascot-avatar/MascotAvatar";
import mascotStyles from "@/components/mascot-avatar/mascot-avatar.module.css";

const FLAVOURS: MascotFlavour[] = ["pataka", "malai", "dadi", "pehelwan"];
const EXPRESSIONS: MascotCutoutExpression[] = ["default", "happy"];

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
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--s-5)" }}>{children}</div>
    </div>
  );
}

export function MascotCutoutStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Mascot Cutout
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Full-body art, uncropped, bottom-anchored — the counterpart to MascotAvatar&apos;s bust crop. Used wherever
          a mascot stands in a scene rather than sits in a chip: the hero edge-peek, the comic panel.
        </p>
      </div>

      <Row label="All four flavours, default pose">
        {FLAVOURS.map((flavour) => (
          <MascotCutout key={flavour} flavour={flavour} height={180} />
        ))}
      </Row>

      <Row label="Default vs. happy, per flavour">
        {FLAVOURS.map((flavour) => (
          <div key={flavour} style={{ display: "flex", gap: "var(--s-3)", alignItems: "flex-end" }}>
            {EXPRESSIONS.map((expression) => (
              <div
                key={expression}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-1)" }}
              >
                <MascotCutout flavour={flavour} expression={expression} height={140} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-label)" }}>{expression}</span>
              </div>
            ))}
          </div>
        ))}
      </Row>

      <Row label="Meaningful alt — sole identifier, e.g. hero edge-peek">
        <MascotCutout flavour="pataka" height={160} alt="Pataka, the Peri Peri mascot" />
      </Row>

      <Row label="Idle loop, armed but only plays on ancestor hover/focus (hover this row)">
        <div className={mascotStyles.mascotHoverScope} style={{ display: "flex", gap: "var(--s-4)", alignItems: "flex-end" }}>
          {FLAVOURS.map((flavour) => (
            <MascotCutout key={flavour} flavour={flavour} height={160} animateIdle />
          ))}
        </div>
      </Row>

      <Row label="Rendered heights, one flavour">
        {[80, 120, 180, 260].map((height) => (
          <div key={height} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-1)" }}>
            <MascotCutout flavour="pehelwan" height={height} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-label)" }}>{height}px</span>
          </div>
        ))}
      </Row>
    </div>
  );
}
