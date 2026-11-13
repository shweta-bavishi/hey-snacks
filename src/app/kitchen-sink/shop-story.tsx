"use client";

import { Shop } from "@/components/shop/Shop";

export function ShopStory() {
  return (
    <section style={{ padding: "var(--s-6) 0", display: "grid", gap: "var(--s-5)" }}>
      <div style={{ padding: "0 var(--s-5)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Shop</h2>
        <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
          §08 — 4 flavour cards + the variety pack, all sold out. Notify Me opens the shared modal.
        </p>
      </div>
      <Shop />
    </section>
  );
}
