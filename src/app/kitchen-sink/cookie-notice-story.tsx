"use client";

import { useState } from "react";
import { Button } from "@/components/button/Button";
import { CONSENT_STORAGE_KEY, reopenConsent, setConsent, useConsent } from "@/lib/consent";
import { withUtm } from "@/lib/utm";

const SAMPLE = withUtm("https://example.com/", {
  source: "Instagram",
  medium: "social",
  campaign: "Batch 01 Prelaunch",
  content: "bio",
});

export function CookieNoticeStory() {
  const consent = useConsent();
  const [cleared, setCleared] = useState(false);

  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-4)" }}>
      <h2>Cookie notice + UTM</h2>
      <p style={{ maxWidth: "62ch" }}>
        Current consent: <code>{consent}</code>. PostHog and the Meta pixel only load on <code>granted</code>.
        The notice itself is global (bottom-left); use these to drive its states.
      </p>
      <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
        <Button onClick={reopenConsent}>Show notice</Button>
        <Button variant="secondary" onClick={() => setConsent("granted")}>Set granted</Button>
        <Button variant="secondary" onClick={() => setConsent("denied")}>Set denied</Button>
        <Button
          variant="ghost"
          onClick={() => {
            try {
              localStorage.removeItem(CONSENT_STORAGE_KEY);
            } catch {}
            setCleared(true);
            window.location.reload();
          }}
        >
          {cleared ? "Reloading" : "Reset to pending"}
        </Button>
      </div>
      <p style={{ maxWidth: "62ch" }}>
        <code>withUtm()</code> output: <code style={{ wordBreak: "break-all" }}>{SAMPLE}</code>
      </p>
    </section>
  );
}
