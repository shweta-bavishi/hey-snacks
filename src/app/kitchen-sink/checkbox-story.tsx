"use client";

import { useState } from "react";
import { Checkbox } from "@/components/checkbox/Checkbox";

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
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "var(--s-4)" }}>
        {children}
      </div>
    </div>
  );
}

export function CheckboxStory() {
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  function validate(checked: boolean) {
    setConsentError(checked ? null : "Zaroori hai, tick karo to aage badhein.");
  }

  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Checkbox
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Unchecked by default, always. Label wraps without the indicator moving. Links inside the label
          don&apos;t toggle the box.
        </p>
      </div>

      <Row label="States">
        <Checkbox label="Unchecked" defaultChecked={false} />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled, checked" disabled defaultChecked />
      </Row>

      <Row label="Consent field (with nested link)">
        <div style={{ maxWidth: "40ch" }}>
          <Checkbox
            label={
              <>
                Mujhe updates aur offers bhejo. Padho hamari{" "}
                <a href="/privacy" onClick={(e) => e.preventDefault()}>
                  Privacy
                </a>{" "}
                policy.
              </>
            }
            required
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              validate(e.target.checked);
            }}
            error={consentError}
          />
        </div>
      </Row>
    </div>
  );
}
