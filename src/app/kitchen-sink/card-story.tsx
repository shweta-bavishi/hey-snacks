"use client";

import { Card } from "@/components/card/Card";

export function CardStory() {
  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-5)" }}>
      <h2>Card</h2>

      <div style={{ display: "flex", gap: "var(--s-5)", flexWrap: "wrap" }}>
        <Card elevation="flat">
          <strong>Flat</strong>
          <p>No shadow. Used for nested or already-elevated contexts.</p>
        </Card>
        <Card elevation="raised">
          <strong>Raised (default)</strong>
          <p>--shadow, ink coloured.</p>
        </Card>
        <Card elevation="floating">
          <strong>Floating</strong>
          <p>--shadow-lg, ink coloured.</p>
        </Card>
      </div>

      <div style={{ display: "flex", gap: "var(--s-5)", flexWrap: "wrap" }}>
        <Card elevation="raised" shadowColor="pataka" tilt={-2}>
          <strong>Pataka shadow, tilted -2deg</strong>
          <p>A product card casting its own flavour shadow instead of ink.</p>
        </Card>
        <Card elevation="raised" shadowColor="jaadu">
          <strong>Jaadu shadow</strong>
          <p>Comic panel or proof card in the jaadu section.</p>
        </Card>
      </div>

      <div style={{ display: "flex", gap: "var(--s-5)", flexWrap: "wrap" }}>
        <Card as="button" interactive elevation="raised" onClick={() => alert("Card clicked")}>
          <strong>Interactive (button)</strong>
          <p>The whole card is one focusable, clickable element. Tab to it, hit Enter.</p>
        </Card>
        <Card as="a" href="#" interactive elevation="raised" shadowColor="malai">
          <strong>Interactive (anchor)</strong>
          <p>Same states, rendered as a link via the polymorphic `as` prop.</p>
        </Card>
        <Card as="button" interactive elevation="raised" disabled>
          <strong>Disabled</strong>
          <p>Non-interactive: no hover/active transforms, 0.4 opacity.</p>
        </Card>
      </div>

      <div style={{ display: "flex", gap: "var(--s-5)", flexWrap: "wrap" }}>
        <Card elevation="raised" padding="none">
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='120'><rect width='100%25' height='100%25' fill='%23FFC93C'/></svg>"
            alt=""
            style={{ display: "block", width: "100%", borderRadius: "inherit" }}
          />
        </Card>
      </div>
    </section>
  );
}
