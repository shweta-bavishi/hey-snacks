"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card/ProductCard";
import type { Flavour } from "@/data/flavours";

const PACK_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='200'><rect x='4' y='4' width='132' height='192' rx='4' fill='%23FFF8EE' stroke='%2314110F' stroke-width='3'/></svg>`
  );

const DEMO_FLAVOUR: Flavour = {
  slug: "pataka-peri-peri",
  name: "Pataka Peri Peri",
  short: "Pataka",
  flavour: "Peri Peri",
  theme: "pataka",
  heat: 4,
  price: 99,
  mrp: 129,
  inStock: false,
  line: "Aankh se paani, mooh se maza.",
  desc: "Fiery peri peri, hand-tossed.",
  keywords: ["peri peri", "spicy", "पटाका"],
};

const DEMO_FLAVOUR_2: Flavour = {
  ...DEMO_FLAVOUR,
  slug: "jaadu-masala",
  name: "Jaadu Masala",
  short: "Jaadu",
  flavour: "Masala Magic",
  theme: "jaadu",
  heat: 3,
};

export function ProductCardStory() {
  const [notifying, setNotifying] = useState(false);

  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-5)" }}>
      <h2>ProductCard</h2>
      <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
        Hover the default card to see the pack straighten and the mascot pop in. Click
        &ldquo;Notify Me&rdquo; to flip to the ticket-stub back face — it persists per flavour in
        localStorage and reload this page to see it restore without animating.
      </p>

      <div style={{ display: "flex", gap: "var(--s-5)", flexWrap: "wrap" }}>
        <ProductCard
          flavour={DEMO_FLAVOUR}
          packImageSrc={PACK_PLACEHOLDER}
          onNotify={async () => {
            setNotifying(true);
            await new Promise((r) => setTimeout(r, 600));
            setNotifying(false);
          }}
        />
        <ProductCard flavour={DEMO_FLAVOUR_2} packImageSrc={PACK_PLACEHOLDER} />
        <ProductCard flavour={DEMO_FLAVOUR} packImageSrc={PACK_PLACEHOLDER} loading />
      </div>
      {notifying && <p style={{ fontFamily: "var(--font-mono)" }}>submitting…</p>}
    </section>
  );
}
