# Packaging — back panels + front-panel fix pass

**Status:** done. Design complete, fix-pass verified, side panels added (see [`hero-360-plan.md`](./hero-360-plan.md)), all 15 artboards (5 front + 5 back + 5 side) extracted and integrated — fronts replace the old placeholders at their existing paths, back/side land in `public/packs/back/` and `public/packs/side/`, staged for `Pack3D` (not yet built). Confirmed live: Hero, Shop and the flavour grid all render real pack art now.
**Relates to:** [`packaging-design-plan.md`](./packaging-design-plan.md) · [`packaging-claude-design-prompt.md`](./packaging-claude-design-prompt.md) · [`hero-360-plan.md`](./hero-360-plan.md)

---

## 1. Front-panel review

**Update: the fix pass in §4.1 was run and every item landed correctly** — verified against the raw SVG source, not just the render. Price now reads struck `129` / live `99` on all four flavour packs. Malai's wordmark subtitle now reads "MALAI", matching the other three. Jaadu's roundel seal is now marigold. Pataka's starburst now unambiguously breaks the wordmark-zone boundary. The delivery also added a grain-texture overlay to every artboard, unprompted — a real gap the first pass had against the site's own "grain on every solid fill" rule.

Original review below, for the record:

Strong delivery overall — the shelf test passes cleanly (every zone boundary lines up at the same height across all five artboards, checked pixel-for-pixel), all four mascots are instantly recognisable and correctly coloured, every heat meter matches its flavour's real data, and the variety pack is genuinely excellent: real per-quadrant labels I didn't ask for, correct math on the combined weight (4 × 60g = 240g), and its pricing is exactly right.

**One bug that blocks integration:**

- **Wrong price on all four single-flavour packs.** Every one of Pataka, Malai, Jaadu and Pehelwan shows a struck-through **99** and a live price of **89** baked into the art. The real data in `flavours.ts` is `mrp: 129, price: 99` — identical across all four. So the art is showing a price that exists nowhere in the data model, on the one number a shopper actually checks. The variety pack, by contrast, got its own pricing (`396` → `349`) exactly right — the error is isolated to the four flavour packs. This can't ship as-is: `ProductCard` renders the real price as text next to this same image, so the pack art and the page would visibly disagree.

**Two smaller inconsistencies, worth a fix pass but not blocking:**

- **Wordmark subtitle pulls from a different field per pack.** Pataka reads "PERI PERI", Jaadu "MASALA MAGIC", Pehelwan "PUDINA" — all the short flavour name. Malai alone reads "MALAI MOOD" — the full product name. Same zone, same position, should be the same field on all four.
- **Jaadu's roundel seal was never recoloured to marigold.** The brief's one deliberate "something's different here" break — every other seal is ink-on-cream, his should be the one exception — didn't land; his seal is styled the same as the other three.

**Two soft deviations — my call would be to leave them, flagging in case you disagree:**

- **Eyebrow and footer strips are ink-black, not the cream I specified.** It reads well — bookends every pack top and bottom, echoes the site's own dark Proof Band — and it's applied consistently across all five artboards. I'd keep it; say so in the fix-pass prompt only if you want it reverted to cream.
- **Each descriptor line got a small appended tagline** — "PERI PERI / EXTRA HOT", "MALAI / SLOW & CREAMY", "MASALA MAGIC / SPICED", "PUDINA / COOL MINT" — beyond the plain flavour name I'd asked for. Tasteful, consistent, adds voice without breaking the template. I'd keep these too.

Pataka's starburst breaking the top edge (the frame-break signature detail) is present but faint — the spark's point nearly reaches the boundary without clearly crossing it. Minor; worth nudging in the same pass since it's a one-line prompt addition, not worth a pass on its own.

---

## 2. What's left out, against the packaging plan

`packaging-design-plan.md` scoped two phases. **Both are now done.** Phase 1 (front panels) shipped clean after the fix pass (§1). Phase 2 (back panels) was delivered in the same pass as the front-panel fixes — reviewed in §3 below.

Side panels stay deferred on purpose, unchanged from the original call: "low design risk, low priority; build only when a real 360° sequence or print run is scheduled." Nothing about this delivery changes that — they're Space Mono-only, no illustration, and nothing in the codebase consumes them yet.

So packaging design is complete, pending the two decisions in §6 and the code-integration step.

---

## 3. Back panel plan (as specified — see §6 for what actually shipped)

Same shared-template discipline as the front: one layout, five fills. Reuses zones 1 and 2 (eyebrow, wordmark) from the front panel verbatim for shelf consistency — a customer should be able to flip the box over and recognise it as the same pack.

```
┌──────────────────────────────────┐
│ VEGAN✱GLUTEN-FREE✱ROASTED NOT FRIED│  ← 1. eyebrow strip (same as front)
├──────────────────────────────────┤
│ ┌────────────────────────────┐   │
│ │           hey.              │   │  ← 2. wordmark block (same as front)
│ └────────────────────────────┘   │
│                                  │
│  "From the ponds of Mithila"     │  ← 3. story block, Hind body text
│  Makhana grows wild in the       │
│  ponds of Mithila, Bihar...      │
│                                  │
│  PROTEIN 9.7g · FAT 0.1g ·       │  ← 4. nutrition strip, Space Mono
│  CALCIUM 347mg  (per 100g)       │
│                                  │
│  INGREDIENTS: Makhana, sunflower │  ← 5. ingredients line, Hind
│  oil, [flavour] seasoning, salt. │
│                                  │
│  ◯ VEG   FSSAI LIC. [reserved]   │  ← 6. compliance block
│                                  │
├──────────────────────────────────┤
│ ✱ made with ghee-level love      │  ← 7. sign-off strip
└──────────────────────────────────┘
```

**Content per zone:**

3. **Story block** — the exact sourcing copy already live in the Proof Band (`ProofBand.tsx`): *"Makhana grows wild in the ponds of Mithila, Bihar. Hand-popped over an open flame..."* Same words on the box as on the site — nothing invented twice.
4. **Nutrition strip** — `PROTEIN 9.7g · FAT 0.1g · CALCIUM 347mg`, per 100g. Same three numbers as the Proof Band's nutrition card, identical, so the pack and the site never contradict each other.
5. **Ingredients** — plain language, per flavour: `Makhana, sunflower oil, [flavour] seasoning, salt.` One honest note: the jar-story scrollytelling section (`jarStoryBeats.ts`) depicts a mixed nut-and-seed trail mix (makhana, almonds, cashews, peanuts, seeds, spice), which is a different composition from these single-flavour makhana packs. I've kept the back panel's ingredients consistent with the flavour-pack data model (pure seasoned makhana), not the jar story's mix — flagging this as an existing product-story question worth resolving on your end, not something I should paper over by inventing a matching ingredient list.
6. **Compliance block** — the green-dot Indian vegetarian mark plus a reserved placeholder line, `FSSAI Lic. No. [reserved]` — real content that has to exist before print, explicitly not a fabricated licence number.
7. **Sign-off strip** — the exact footer line from spec §2: `made with ghee-level love ✱ hey. 2026`.

All five back panels share zones 1, 2, 6 and 7 verbatim. Only the flavour name in the wordmark block, the flavour colour, and the one ingredient word in zone 5 change per SKU. The variety pack's back panel lists all four ingredient lines stacked, since it's genuinely four different seasonings in one box.

---

## 4. Prompts

### 4.1 Front-panel fix pass (run first — blocks integration)

```
Using the five packaging front-panel artboards already on this canvas, fix
the following without changing anything else — same layout, same mascots,
same backdrops, same zone positions:

1. PRICE, on the four single-flavour artboards only (Pataka, Malai, Jaadu,
   Pehelwan — not the variety box, its pricing is already correct). The
   struck-through number must read 129 and the live number must read 99, on
   all four. Currently all four show struck 99 / live 89, which is wrong on
   every single-flavour pack.

2. WORDMARK SUBTITLE — the line directly under "hey." in the wordmark block.
   Make all four single-flavour artboards use the SAME field: the short
   flavour name only (what already appears on Pataka, Jaadu and Pehelwan --
   "PERI PERI", "MASALA MAGIC", "PUDINA"). Change Malai's subtitle from
   "MALAI MOOD" to just "MALAI" to match the other three.

3. JAADU'S ROUNDEL SEAL — recolour it to marigold (#FF9F1C) on the Jaadu
   artboard only. Every other artboard's seal stays exactly as it is now
   (ink outline, cream fill). This is the one deliberate difference between
   Jaadu's pack and the other three.

4. PATAKA'S STARBURST -- push the burst's topmost point further out so it
   visibly and unambiguously crosses the horizontal line between the hero
   art window and the wordmark block above it. Right now it nearly touches
   that line without clearly breaking it.

Leave everything else untouched: the black eyebrow/footer strips, the
appended taglines under each flavour name, the mascots, the backdrops, the
roundel seal on every other artboard, and all five artboards' exact 900x1260
size and zone alignment.
```

### 4.2 Back panels — all five SKUs

```
Design the back-panel artwork for the same five snack packaging cartons as
the front panels already on this canvas ("hey." makhana, four flavours plus
a variety box). Same art direction, same 3px ink outlines, halftone-dot
shading only, same 900x1260 canvas, same aspect ratio and orientation as the
fronts. This is the panel a shopper reads after picking the box up.

SHARED ZONES 1 AND 2 -- REUSE VERBATIM
Copy the eyebrow strip and the wordmark block exactly as built on each
flavour's own front panel -- same colours, same layout, same roundel seal
(including Jaadu's marigold seal on his back panel too). A shopper turning
the box over should recognise it as the same pack immediately.

THEN, BELOW THAT, FOUR NEW ZONES, cream background throughout (#FFF8EE),
Hind-style body text for prose and Space Mono for all technical/numeric
lines, ink text throughout -- this panel is quieter than the front, mostly
type, minimal illustration:

3. STORY BLOCK -- a short heading "From the ponds of Mithila" followed by
   two sentences: "Makhana grows wild in the ponds of Mithila, Bihar.
   Hand-popped over an open flame, it's been Bihar's best-kept secret for
   about a thousand years." Same text on all five artboards.

4. NUTRITION STRIP -- Space Mono, boxed in a thin-outlined rule: "PROTEIN
   9.7g * FAT 0.1g * CALCIUM 347mg" with a small "PER 100g" label beneath.
   Identical numbers on all five artboards.

5. INGREDIENTS LINE -- "INGREDIENTS:" in small caps mono, followed by plain
   Hind text. On the four single-flavour artboards: "Makhana, sunflower oil,
   [that flavour's seasoning name] seasoning, salt." On the variety box
   artboard: all four seasoning lines stacked, one per flavour, each
   prefixed with a small colour swatch in that flavour's primary colour.

6. COMPLIANCE BLOCK -- a small green square containing a smaller green dot
   (India's standard vegetarian food mark) on the left, and on the right a
   line of small mono text reading "FSSAI Lic. No. [reserved]" -- render
   "[reserved]" exactly as bracketed placeholder text, not as a real-looking
   number. Do not invent digits here under any circumstance.

7. SIGN-OFF STRIP -- a thin band at the very bottom, same ink-black as the
   front panel's eyebrow/footer strips, centred Space Mono text reading:
   "* made with ghee-level love * hey. 2026"

RULES CARRIED OVER FROM THE FRONT PANELS
- 3px ink outline, no gradients or soft shadows anywhere on this panel at
  all -- it has no backdrop device, no starburst, nothing decorative besides
  the shared roundel seal from zone 2.
- Same cream/ink/flavour-primary palette as that flavour's front panel --
  no new colours introduced.
- No mascot art on the back panel -- this panel is functional, not a scene.
- Keep all five artboards' zone boundaries aligned to each other at the same
  heights, the same shelf-test discipline as the front panels.

DO NOT
- Do not invent an FSSAI licence number, a batch code, or a best-before date
  -- leave clearly-marked placeholder brackets for anything that has to be
  real before print.
- Do not repeat the front panel's illustration, mascot, or backdrop device
  anywhere on the back.
- Do not use a different nutrition number on any artboard -- all five must
  match exactly.

DELIVER
Five artboards, each 900x1260, positioned in a row directly below the front
panels already on this canvas so the two rows can be shelf-tested together,
named and labelled:
  back/pataka-peri-peri
  back/malai-mood
  back/jaadu-masala
  back/pudina-pehelwan
  back/variety-pack
```

---

## 5. Back panel review

Delivered in the same pass as the front-panel fixes. Checked against the raw source and rendered visually (Pataka, Malai and the variety pack in full; Jaadu and Pehelwan confirmed via source since the template held exactly).

**What's right:**
- Zones 1–2 reused verbatim from each flavour's front panel, including Jaadu's marigold seal carrying over correctly.
- Story copy is word-for-word what's live in `ProofBand.tsx`.
- Nutrition numbers (`9.7g` / `0.1g` / `347mg`) match the site exactly, on all five.
- Sign-off strip matches spec §2 verbatim.
- The vegetarian mark is present on all five — it's defined once and reused via `<use>`, which a naive text search across the file can miss; confirmed visually on three of five before trusting the pattern for the rest.
- The variety pack's back is a genuine step up from the brief: four colour-swatched seasoning lines, one per flavour, plus a four-stripe band motif top and bottom.
- Shelf test holds, both within the back row and against the front row above it.

**What's not right, and why it's fine:**
- **FSSAI compliance line is missing from all five.** Confirmed by a literal text search — zero occurrences. **Decision (this session): leave it out.** Not entering a licence number right now, and there's no reason to reserve the layout space for one before that's real. Not a blocker.
- **Ingredient list doesn't match what I originally specified** — every back panel reads `Makhana, Peanuts, Almonds, Cashews, Seeds, Ghee, Sunflower Oil, [flavour] seasoning, Salt`, the jar-story's trail-mix composition, not the pure-makhana line I'd asked for. **Decision (this session): this is correct — keep as generated.** The product is actually a trail mix.

## 6. Site copy reconciled to the trail-mix product

Fixed, confirmed live in the dev server:

- **Announcement marquee** ([page.tsx](../src/app/page.tsx)) — `"100% BIHAR MAKHANA"` (an exclusivity claim, now false) → `"MAKHANA + NUTS + SEEDS"`.
- **FAQ allergens answer** ([faq.ts](../src/data/faq.ts)) — was "show up in **some** flavours," which contradicted the back panel's own ingredient list (the full mix is in *every* flavour, confirmed in §5). Now says "every flavour," and the "what actually is makhana?" answer now states the mix explicitly rather than leaving it to the allergen line alone.

**Deliberately left alone:**

- `flavours.ts` (`desc` field), the comic-intro origin paragraph, "Our Makhanas" as the section/product-line name, the Proof Band's Mithila sourcing story — none of these claim the product is *pure* makhana, they're just voiced around makhana as the hero ingredient (same way a granola bar stays "granola" with mix-ins). No factual correction needed there.
- The design spec doc (`hey-makhana-design-spec.md`) still frames the product as pure roasted makhana throughout — a large reference document, not live copy. Leaving it as historical record unless you want a dedicated pass on it.

**Both resolved this session — decided and built:**

1. **"Vegan" → "Cholesterol-free" everywhere on the site.** Confirmed live: [Hero.tsx:124](../src/components/hero/Hero.tsx#L124) eyebrow, [ProofBand.tsx:71](../src/components/proof-band/ProofBand.tsx#L71) tick list. The packaging SVG still needs the matching fix — see §7.
2. **Real nutrition numbers, calculated from the actual recipe** — makhana 50g, peanuts 75g, almonds 50g, cashews 50g, seeds 35g (260g batch), scaled to per-100g. See §7.1 for the full workup. Live now: `PROTEIN 19.9g · FAT 38.5g · CALCIUM 114mg` (Proof Band nutrition strip), and the hey-vs-chips comparison table's FAT row was removed — nuts push fat well past pure makhana's near-zero baseline, so `38.5g` no longer beats chips' `35g` and the row would have undercut the pitch rather than making it. PROTEIN and CARBS both stayed genuinely favourable and were updated in place.

3. **The jar-story section's ingredient percentages — fixed, then set to final values.** `jarStoryBeats.ts`'s `share` field (the only thing driving both the on-screen `label` stamp and the static fallback card — `JarStage.tsx` reads `activeBeat.share` directly, single source of truth, confirmed) first went to a weight-derived `18/19/18/28/13/4`, then to the stated final composition: **Makhana 20% / Almonds 20% / Cashews 20% / Peanuts 30% / Seeds 9% / Masala 1%**. Peanuts is the largest single ingredient.

   Note this display split doesn't derive from the 50/75/50/50/35g recipe used for the §7 nutrition numbers — that ratio works out to roughly 18/19/18/28/13/4, close but not identical to 20/20/20/30/9/1. Flagged in a code comment at the point of use rather than silently reconciled, since the two don't have to match to the decimal (a jar-story stamp and a nutrition panel are different kinds of number) but a real gap deserves to be visible, not buried.

   Deliberately left untouched: beat order (makhana still introduced first — brand narrative, not a weight ranking), `particleCount`, `fillLevel`, `settlePositions`. Never a literal mass-to-pixel mapping even under the original numbers, so rescaling them wasn't part of fixing the percentages and risked a visual regression untestable without the live scroll interaction. No dev-time sanity-check failures (timeline contiguity + particle-count/settle-position parity, self-validated on import), confirmed live both times.

## 7. Nutrition — calculated from the real recipe

Recipe given: makhana 50g, peanuts 75g, almonds 50g, cashews 50g, seeds 35g — a 260g batch. Seeds costed as an even split of pumpkin/sunflower/flax, matching the mix `jarStoryBeats.ts` already names. Per-ingredient values are standard published food-composition figures (not a lab report), scaled by actual weight, summed across the batch, then scaled down to a 100g serving (× 100/260):

| | per 100g of finished mix |
|---|---|
| Protein | 19.9g |
| Fat | 38.5g |
| Carbs | 32.1g |
| Calcium | 114mg |

One thing worth flagging while I was in there: the site's old calcium figure was `347mg` — suspiciously identical to fox nuts' commonly-cited *calorie* count (347 kcal/100g), not their calcium content (closer to ~60mg/100g in most food tables). Looks like an old calorie/calcium mix-up in whatever source those original numbers came from, not something introduced this session. Worth a real lab panel before print either way — these are estimates from standard references, not verified values, and food-labelling claims are exactly the kind of thing that shouldn't ship on a guess.

## 8. Packaging still needs the matching fix

The site is now fully correct; the packaging SVG (still sitting in Downloads, not yet integrated) has four things baked in that no longer match it. One of the four is a fresh catch — the roundel seal makes the *exact same kind of exclusivity claim* the marquee item did ("100% BIHAR MAKHANA"), which I fixed on the site two turns ago and missed on the pack until writing this prompt. Consolidated fix-pass, run once before the "replace it in the code" step:

```
Using the five front-panel and five back-panel artboards already on this
canvas, make four changes:

1. VEGAN -> CHOLESTEROL-FREE, on all five front panels. The eyebrow strip
   currently reads "VEGAN * GLUTEN-FREE * ROASTED NOT FRIED". Change to
   "CHOLESTEROL-FREE * GLUTEN-FREE * ROASTED NOT FRIED". Same position,
   same styling, all five.

2. ROUNDEL SEAL TEXT, on all ten artboards (both fronts and backs -- the
   seal appears on each). It currently reads "100% BIHAR MAKHANA" around
   the rim -- an exclusivity claim that's no longer accurate now that the
   product is makhana blended with nuts and seeds, not pure makhana. Change
   the ring text to "MAKHANA * NUTS * SEEDS". Keep every other property of
   the seal exactly as it is -- position, size, the star icon, and Jaadu's
   marigold recolour stays marigold, only the text inside changes.

3. BACK PANEL NUTRITION, on all five back panels. Replace "PROTEIN 9.7g *
   FAT 0.1g * CALCIUM 347mg" with "PROTEIN 19.9g * FAT 38.5g * CALCIUM
   114mg" in the nutrition strip. Same position, same styling.

4. BACK PANEL INGREDIENTS, on all five back panels. The list is currently
   "Makhana, Peanuts, Almonds, Cashews, Seeds, Ghee, Sunflower Oil,
   [flavour] seasoning, Salt." Two fixes to this one line:
   - Remove "Ghee" entirely -- it's dairy, and it's the one thing on the
     pack that actually contradicted "cholesterol-free."
   - Reorder the five base ingredients by actual weight, heaviest first --
     that's standard practice for a food ingredient list, not a style
     choice. Peanuts is the largest component, so it goes first, ahead of
     makhana. Corrected line: "Peanuts, Makhana, Almonds, Cashews, Seeds,
     Sunflower Oil, [flavour] seasoning, Salt."

Leave everything else on all ten artboards exactly as it is -- mascots,
backdrops, prices, story copy, sign-off strip, zone alignment.
```

Nutrition in #3 is still calculated from the 50/75/50/50/35g recipe, which isn't quite the same ratio as the jar story's final 20/20/20/30/9/1 display split (§6 above) — noted there, not re-solved here. If you want the nutrition figure tied to the jar-story percentages instead, say so and I'll redo the math against those.

## 9. Next step

Packaging design is done: five fronts, five backs, both reviewed. Two decisions from this session (cholesterol-free, real nutrition) are live on the site but still need the fix pass above run against the packaging art before the two match. Once that lands, it's the same step the mascots got — "review this and replace it in the code." Nothing in `Pack360`, `ProductCard` or `Shop` needs to change for the front swap; the back panels aren't consumed anywhere in code yet, so they'll land in `public/packs/back/` with no wiring until a component actually needs them.
