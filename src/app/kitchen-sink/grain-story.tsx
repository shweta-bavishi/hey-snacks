import { Grain, GrainIntensity } from "@/components/grain/Grain";

const SWATCHES: { theme: string; label: string }[] = [
  { theme: "pataka", label: "Pataka" },
  { theme: "malai", label: "Malai" },
  { theme: "jaadu", label: "Jaadu" },
  { theme: "pehelwan", label: "Pehelwan" },
];

const INTENSITIES: GrainIntensity[] = ["subtle", "default", "heavy"];

function PanelSwatch({ theme, label, intensity }: { theme: string; label: string; intensity: GrainIntensity }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        border: "var(--stroke) solid var(--ink)",
        boxShadow: "var(--shadow-sm)",
        background: `var(--${theme})`,
        padding: "var(--s-5)",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Grain scope="panel" intensity={intensity} />
      <p
        style={{
          position: "relative",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-label)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: `var(--${theme}-on)`,
        }}
      >
        {label} · {intensity}
      </p>
    </div>
  );
}

export function GrainStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Grain overlay
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          A single fixed noise layer runs globally, mounted once in the root layout — see it on this
          page already. The swatches below show the panel-scoped variant at each intensity, for
          coloured sections that read too flat against the global 4.5% wash.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--s-4)",
        }}
      >
        {SWATCHES.flatMap((s) =>
          INTENSITIES.map((intensity) => (
            <PanelSwatch key={`${s.theme}-${intensity}`} theme={s.theme} label={s.label} intensity={intensity} />
          ))
        )}
      </div>
    </div>
  );
}
