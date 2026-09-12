"use client";

import { FlavourColumn } from "@/components/flavour-column/FlavourColumn";
import type { Flavour } from "@/data/flavours";

const DEMO_FLAVOURS: Flavour[] = [
  {
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
  },
  {
    slug: "malai-mood",
    name: "Malai Mood",
    short: "Malai",
    flavour: "Cream Cheese",
    theme: "malai",
    heat: 1,
    price: 99,
    mrp: 129,
    inStock: false,
    line: "Thanda thanda, cool cool.",
    desc: "Rich cream cheese, mellow.",
    keywords: ["cream cheese", "malai"],
  },
  {
    slug: "jaadu-masala",
    name: "Jaadu Masala",
    short: "Jaadu",
    flavour: "Masala Magic",
    theme: "jaadu",
    heat: 3,
    price: 99,
    mrp: 129,
    inStock: false,
    line: "Ek chutki jaadu.",
    desc: "Classic masala, no gimmicks.",
    keywords: ["masala", "jaadu"],
  },
  {
    slug: "pudina-pehelwan",
    name: "Pudina Pehelwan",
    short: "Pehelwan",
    flavour: "Tangy Mint",
    theme: "pehelwan",
    heat: 2,
    price: 99,
    mrp: 129,
    inStock: false,
    line: "Dum hai toh aage aa.",
    desc: "Tangy mint, refreshing punch.",
    keywords: ["mint", "tangy", "pehelwan"],
  },
];

export function FlavourColumnStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Flavour Column
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Hover or Tab into a column — it flexes to 1.7 while the siblings compress, the mascot scales
          up, and nine puffs burst from the base. Below 900px this row becomes a horizontal snap-scroll
          carousel with a peek of the next card; expansion is disabled on touch.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
        }}
      >
        {DEMO_FLAVOURS.map((flavour, i) => (
          <FlavourColumn
            key={flavour.slug}
            flavour={flavour}
            index={i}
            total={DEMO_FLAVOURS.length}
            onNotify={(slug) => console.log("notify", slug)}
          />
        ))}
      </div>
    </div>
  );
}
