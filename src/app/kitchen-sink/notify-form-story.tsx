"use client";

import { useState } from "react";
import { NotifyForm, NotifyPayload, NotifyResult } from "@/components/notify-form/NotifyForm";
import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/button/Button";
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
    flavour: "Malai",
    theme: "malai",
    heat: 1,
    price: 99,
    mrp: 129,
    inStock: false,
    line: "Softly softly, malai mood.",
    desc: "Creamy malai, no heat.",
    keywords: ["malai", "creamy", "मलाई"],
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
    desc: "Masala magic, every bite.",
    keywords: ["masala", "jaadu", "जादू"],
  },
  {
    slug: "pudina-pehelwan",
    name: "Pudina Pehelwan",
    short: "Pehelwan",
    flavour: "Pudina",
    theme: "pehelwan",
    heat: 2,
    price: 99,
    mrp: 129,
    inStock: false,
    line: "Thanda thanda, pehelwan wala.",
    desc: "Cool pudina punch.",
    keywords: ["pudina", "mint", "पुदीना"],
  },
];

// Mock network behaviour, switchable from the story controls below.
async function mockSubmit(
  mode: "success" | "duplicate" | "network-error",
  payload: NotifyPayload
): Promise<NotifyResult> {
  await new Promise((r) => setTimeout(r, 700));
  if (mode === "network-error") throw new Error("network down");
  if (mode === "duplicate") {
    return { status: "duplicate", ticket: "#2419", mergedFlavourSlugs: payload.flavourSlugs };
  }
  return { status: "created", ticket: "#2419", mergedFlavourSlugs: payload.flavourSlugs };
}

export function NotifyFormStory() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"success" | "duplicate" | "network-error">("success");

  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-5)" }}>
      <h2>NotifyForm</h2>
      <p style={{ fontFamily: "var(--font-body)", maxWidth: "62ch" }}>
        Waitlist signup pattern. Full layout in the modal below; compact layout (email + chips,
        three fields max, with a &ldquo;More details&rdquo; disclosure for the rest) sits underneath.
        Switch the mock response to see duplicate-email and network-failure recovery — the
        network-error path keeps every typed value and offers a retry.
      </p>

      <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap", fontFamily: "var(--font-body)" }}>
        {(["success", "duplicate", "network-error"] as const).map((m) => (
          <label key={m} style={{ display: "flex", gap: "var(--s-1)", alignItems: "center" }}>
            <input type="radio" name="mock-mode" checked={mode === m} onChange={() => setMode(m)} />
            {m}
          </label>
        ))}
      </div>

      <Button onClick={() => setOpen(true)}>Notify Me</Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Get notified">
        <NotifyForm
          layout="full"
          sourceSlug="pataka-peri-peri"
          flavours={DEMO_FLAVOURS}
          getTurnstileToken={async () => "demo-token"}
          onSubmit={(payload) => mockSubmit(mode, payload)}
          onSuccess={() => {
            setTimeout(() => setOpen(false), 1200);
          }}
        />
      </Modal>

      <div style={{ maxWidth: 360 }}>
        <h3 style={{ fontFamily: "var(--font-body)" }}>Compact (command palette)</h3>
        <NotifyForm
          layout="compact"
          sourceSlug="malai-mood"
          flavours={DEMO_FLAVOURS}
          getTurnstileToken={async () => "demo-token"}
          onSubmit={(payload) => mockSubmit(mode, payload)}
        />
      </div>
    </section>
  );
}
