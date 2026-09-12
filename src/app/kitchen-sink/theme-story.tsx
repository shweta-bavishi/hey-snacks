"use client";

import { useTheme, useSectionTheme } from "@/components/theme/ThemeProvider";
import { FLAVOUR_THEMES, FlavourTheme } from "@/components/theme/theme-script";

const LABEL: Record<FlavourTheme, string> = {
  pataka: "Pataka",
  malai: "Malai",
  jaadu: "Jaadu",
  pehelwan: "Pehelwan",
};

function ThemeSwitcher() {
  const { theme, setTheme, night, setNight } = useTheme();
  return (
    <div className="flex flex-wrap items-center gap-[var(--s-3)] p-[var(--s-4)]">
      {FLAVOUR_THEMES.map((t) => {
        const selected = t === theme;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={selected}
            onClick={() => setTheme(t)}
            className="themed-surface"
            style={{
              border: "var(--stroke) solid var(--ink)",
              borderRadius: "var(--radius-pill)",
              padding: "var(--s-2) var(--s-4)",
              background: selected ? `var(--${t}-tint)` : "var(--paper)",
              boxShadow: selected ? "var(--shadow-sm)" : "none",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-label)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            {LABEL[t]}
          </button>
        );
      })}
      <button
        type="button"
        aria-pressed={night}
        onClick={() => setNight(!night)}
        className="themed-surface"
        style={{
          border: "var(--stroke) solid var(--ink)",
          borderRadius: "var(--radius-pill)",
          padding: "var(--s-2) var(--s-4)",
          background: night ? "var(--ink)" : "var(--paper)",
          color: night ? "var(--paper)" : "var(--ink)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-label)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          cursor: "pointer",
        }}
      >
        {night ? "Raat mode: on" : "Raat mode: off"}
      </button>
    </div>
  );
}

function FlavourSection({ theme, line }: { theme: FlavourTheme; line: string }) {
  const ref = useSectionTheme<HTMLElement>(theme);
  return (
    <section
      ref={ref}
      className="themed-surface flex min-h-[60vh] items-center justify-center"
      style={{
        background: `var(--${theme}-tint)`,
        borderTop: "var(--stroke) solid var(--ink)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--fs-h1)",
          color: "var(--ink)",
        }}
      >
        {line}
      </p>
    </section>
  );
}

export function ThemeStory() {
  return (
    <div>
      <div className="sticky top-0 z-[var(--z-header)]" style={{ background: "var(--paper)", borderBottom: "var(--stroke) solid var(--ink)" }}>
        <ThemeSwitcher />
      </div>
      <FlavourSection theme="pataka" line="Pataka aa gaya. Sambhal ke." />
      <FlavourSection theme="malai" line="soooo creamy... anyway." />
      <FlavourSection theme="jaadu" line="Ek chutki masala ka mol." />
      <FlavourSection theme="pehelwan" line="Taazgi ka dangal. Aa jao." />
    </div>
  );
}
