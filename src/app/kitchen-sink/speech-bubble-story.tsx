import { SpeechBubble, SpeechBubbleTail, SpeechBubbleTone } from "@/components/speech-bubble/SpeechBubble";

const TAILS: SpeechBubbleTail[] = ["bottom-left", "bottom-right", "top-left", "none"];
const TONES: SpeechBubbleTone[] = ["speech", "thought", "shout"];

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
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--s-6)" }}>{children}</div>
    </div>
  );
}

export function SpeechBubbleStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Speech bubble
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Inked polygon, not a rounded rectangle. Border and fill are the same SVG path, so it can never
          drift out of sync.
        </p>
      </div>

      <Row label="Tails (tone: speech)">
        {TAILS.map((tail) => (
          <SpeechBubble key={tail} tail={tail} tone="speech">
            {tail}
          </SpeechBubble>
        ))}
      </Row>

      <Row label="Tones (tail: bottom-left)">
        {TONES.map((tone) => (
          <SpeechBubble key={tone} tone={tone} tail="bottom-left">
            {tone === "shout" ? "AAG LAGA DI!" : tone === "thought" ? "soooo creamy... anyway." : "Ek chutki masala."}
          </SpeechBubble>
        ))}
      </Row>

      <Row label="Auto-sizing + max-width 34ch">
        <SpeechBubble tail="bottom-right" tone="speech">
          Hi
        </SpeechBubble>
        <SpeechBubble tail="bottom-right" tone="speech">
          Roasted in Bihar, ruined for anything else, no palm oil, cent percent makhana, seriously.
        </SpeechBubble>
      </Row>
    </div>
  );
}
