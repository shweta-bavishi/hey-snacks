"use client";

import { Footer } from "@/components/footer/Footer";
import { FLAVOURS } from "@/data/flavours";

async function mockSubscribe(email: string) {
  await new Promise((r) => setTimeout(r, 700));
  if (email.startsWith("fail")) throw new Error("network down");
}

export function FooterStory() {
  return (
    <section style={{ marginBottom: "var(--s-8)" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Footer</h2>
      <p style={{ maxWidth: "62ch", marginBottom: "var(--s-4)" }}>
        Full-bleed ink panel. Shop column reads live from <code>src/data/flavours.ts</code>. Newsletter
        reuses NotifyForm&apos;s email validation. Try an address starting with &ldquo;fail&rdquo; to see
        the retry toast. Resize below 900px to see the two-column layout.
      </p>
      <Footer flavours={FLAVOURS} onSubscribe={mockSubscribe} />
    </section>
  );
}
