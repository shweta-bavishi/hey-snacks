"use client";

import { ProofBand } from "@/components/proof-band/ProofBand";

export function ProofBandStory() {
  return (
    <section style={{ padding: "var(--s-6) 0", display: "grid", gap: "var(--s-5)" }}>
      <div style={{ padding: "0 var(--s-5)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Proof Band</h2>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          §07 — origin, nutrition + vs-chips, and the mocked pin-code check. Try an even vs. odd
          leading digit.
        </p>
      </div>
      <ProofBand />
    </section>
  );
}
