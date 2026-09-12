"use client";

import { useState } from "react";
import { Input } from "@/components/input/Input";

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

export function InputStory() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  function validateEmail(value: string) {
    setEmailError(value && !value.includes("@") ? "That email looks... unusual. Mind checking?" : null);
  }

  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Input
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Label always visible, error only on blur or submit, tel prefix is display-only.
        </p>
      </div>

      <Row label="Types">
        <Input type="text" label="Naam" placeholder="Rohan Sharma" />
        <Input type="email" label="Email" placeholder="rohan@example.com" required />
        <Input type="tel" label="Phone" placeholder="98765 43210" />
        <Input type="pincode" label="Pin code" placeholder="560001" helperText="Optional, tells us when we hit your city." />
      </Row>

      <Row label="States">
        <Input label="Default" placeholder="type here" />
        <Input label="Disabled" placeholder="type here" disabled />
        <Input label="Read only" defaultValue="rohan@example.com" readOnly />
        <Input
          label="Error (validated on blur)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          error={emailError}
          required
        />
      </Row>
    </div>
  );
}
