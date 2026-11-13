# Packaging Design Plan — all four flavours + variety box

**Status:** proposal
**Relates to:** [`hey-makhana-design-spec.md`](./hey-makhana-design-spec.md) §1, §3, §5, §14 · [`comic-panel-design-plan.md`](./comic-panel-design-plan.md) · [`mascot-art-brief.md`](./mascot-art-brief.md)
**Touches:** `public/packs/`, `src/lib/packArt.ts`, `src/data/flavours.ts`

---

## 0. What's live today vs. what this plan specs

Every current pack image is a placeholder: a flat rect, a circle, and two lines of system-font text (`public/packs/*.svg`, ~900 bytes each). It exists only to give `Pack360`, `ProductCard`, `Shop` and `Hero` something to render — spec §14 explicitly sanctions this as "a perfectly good production fallback."

Two things are true at once:

- **Only the FRONT panel is consumed by the site today.** `packImageSrc(slug)` returns one image; nothing in the codebase currently displays a back, side, top or bottom. This plan's **build priority is the front** — that's the actual deliverable.
- **A real product needs the whole box.** So this plan also specs the back panel, sides and the physical format, both because it's the honest design of the thing and because spec §14 wants the 360° sequence "rendered from that pack" eventually — you can't spin a box that only has a front.

Front panel is phase 1 and unblocks everything live on the page today. Back/side panels are phase 2, needed only when print production or the real 360° sequence starts.

---

## 1. Format decision

> **A small rectangular flip-top carton, not a pouch.**

Three reasons this is already the de-facto decision, not a new one: spec §14 says *"the box carries the same 3px ink outline"* (box, not bag); §1's reference table calls out *"matchbox & masala tin labels"* — a rigid rectangular form, not a flexible pouch; and the current placeholder SVG is already drawn as a box front, portrait, ~5:7.

**Physical spec:**

| | |
|---|---|
| Format | Flip-top tuck carton (cereal-box construction, not a pouch or tin) |
| Net weight | 60g single-serve, matching `flavour.price`/`heat` data already in `flavours.ts` |
| Dimensions | ~70mm W × 100mm H × 30mm D — a 0.7 width:height ratio, matching the existing 300×420 canvas almost exactly (0.714) |
| Material read | Matte-finish paperboard, not gloss laminate. Offset-printed, slightly soft register — this is what makes "printed in 1974" believable. No foil, no spot-UV, no holographic anything |
| Front canvas | Keep the current **300×420 viewBox**. No code changes to `Pack360`, `ProductCard` or `Shop` are needed if new art fills the same frame |

---

## 2. The shared system — one template, four fills

Every front panel uses the **same five zones in the same positions.** Flavour, colour, mascot pose and one signature backdrop device are the only things that change. This is what makes four packs read as one product line on a shelf (or a 4-up shop grid) rather than four unrelated designs — and it's a direct continuation of the comic panel system: **the pack front reuses the exact same backdrop language as that flavour's comic panel**, so a customer scrolling from §04 to §08 recognises the same visual world.

```
┌──────────────────────────────────┐  3px ink border, flavour-shadow
│ VEGAN✱GLUTEN-FREE✱ROASTED NOT FRIED│  ← 1. eyebrow strip, Space Mono
├──────────────────────────────────┤
│ ┌────────────────────────────┐   │
│ │           hey.              │   │  ← 2. wordmark block, Rozha One,
│ └────────────────────────────┘   │     cream card, roundel seal
│                              ◯   │     overlapping top-right corner
│                                  │
│         [ mascot, happy,        │  ← 3. hero art window — flavour
│           backdrop device       │     backdrop device (starburst /
│           behind them ]         │     bands / rings / stripes),
│                                  │     mascot cutout standing on
│                                  │     the panel floor
│                                  │
│ ┌────────────────────────────┐   │
│ │       PATAKA                │   │  ← 4. flavour name, Modak,
│ │       PERI PERI              │   │     angled -4°, ink outline
│ │       PERI PERI ✱ HEAT ■■■■□ │   │     + descriptor + heat meter
│ └────────────────────────────┘   │
├──────────────────────────────────┤
│ 60g  ₹̶1̶2̶9̶ ₹99         NET WT ✱  │  ← 5. footer strip, Space Mono
└──────────────────────────────────┘
```

**The five zones, in build order:**

1. **Eyebrow strip** — cream band, Space Mono `--fs-label`, `VEGAN ✱ GLUTEN-FREE ✱ ROASTED NOT FRIED`. Identical on all five SKUs — this line never changes, so it's the one place a customer can compare packs at a glance and see they match.
2. **Wordmark block** — the `hey.` lockup in Rozha One on a cream card, 3px ink outline. The full stop is a filled circle in that pack's flavour colour — the exact same device the header logotype already uses, so the mark itself carries flavour identity even before you read anything else. A small **roundel seal** (circular badge, `100% BIHAR MAKHANA` or `HAND-POPPED`, Space Mono around the rim) overlaps the block's top-right corner — the matchbox-label device spec §1 calls out, present on every pack as a shared authenticity mark, not just Pehelwan's comic panel.
3. **Hero art window** — the flavour's `MascotCutout` (see §3 below), `expression="happy"` — a package makes eye contact with the shopper, so this is the one place the mascot differs from its comic-panel default pose. Standing on the panel floor in front of that flavour's **backdrop device**, reused verbatim from `comic-panel-design-plan.md` §3:

   | Flavour | Backdrop device | Tint |
   |---|---|---|
   | Pataka | posterised radial starburst, 6 hard bands | `#FFE3DE` |
   | Malai | flat horizontal halftone bands | `#FFF3D6` |
   | Jaadu | concentric off-centred rings | `#EBE1FF` |
   | Pehelwan | hard vertical stripes | `#DDF6E6` |

4. **Flavour name lockup** — cream card, ink outline, angled `-4deg` (spec §05's exact device for the flavour-grid product name). Modak flavour name (large), Hind descriptor beneath, then a **heat/crunch meter** — the same five-square filled-in-ink device as the `HeatMeter` component, so the pack and the site are drawing literally the same glyph, not two different metaphors for "how spicy is this."
5. **Footer strip** — Space Mono: net weight (`60g`), price (`₹129` struck, `₹99` live — same anchoring logic as the hero, spec §14), and a small `NET WT ✱` label. This is the one zone a `<Stamp variant="sold-out">` sits on top of in the UI layer — the pack art itself never bakes in "SOLD OUT" or a ticket number; that's applied over the image by `ProductCard`, exactly as it is today.

**Constants across all five packs:** 3px ink border (`--stroke`), `6px 6px 0` flavour-shadow (`--shadow`), halftone-dot shading only (no gradient except the Pataka starburst, which is itself posterised — same one exception the whole site gets), grain overlay, max 3 colours per pack (primary + shadow + cream), no border-radius above the shared `--radius` token except the roundel seal (a true circle).

---

## 3. Per-flavour packs

### 01 · Pataka Peri Peri

| | |
|---|---|
| Primary / shadow / tint | `#EF3E2F` / `#8C1A12` / `#FFE3DE` |
| Mascot | `MascotCutout flavour="pataka" expression="happy"` — arms up, bigger burst |
| Backdrop | Posterised starburst, centred behind him, bleeding to the panel edges |
| Descriptor | `PERI PERI ✱ HEAT ■■■■□` (4/5, matches `flavour.heat`) |
| Signature detail | The starburst's outermost band **breaks the hero-art window's frame** at the top edge — the one place across all four packs where the backdrop is allowed to escape its box, echoing his comic panel's frame-break. A held-consistent "loudest pack on the shelf" tell. |

### 02 · Malai Mood

| | |
|---|---|
| Primary / shadow / tint | `#FFC93C` / `#C4820A` / `#FFF3D6` |
| Mascot | `MascotCutout flavour="malai" expression="happy"` |
| Backdrop | Flat horizontal bands, evenly spaced |
| Descriptor | `CREAM CHEESE ✱ HEAT ■□□□□` (1/5) |
| Signature detail | His flavour-name card sits **lower** in zone 4 than the other three, with extra cream space above it — the same "dead air is the joke" restraint from his comic panel, carried onto the shelf. Every other pack's hero art fills its window; his has visible breathing room. |

### 03 · Jaadu Masala

| | |
|---|---|
| Primary / shadow / tint | `#6B2FD6` / `#3D137F` / `#EBE1FF` |
| Mascot | `MascotCutout flavour="jaadu" expression="happy"` |
| Backdrop | Concentric rings, off-centred toward his cupped hand |
| Descriptor | `MASALA MAGIC ✱ HEAT ■■■□□` (3/5) |
| Signature detail | The roundel seal (zone 2, shared across all packs) is the **one element recoloured** to marigold `--marigold` instead of ink-on-cream on his pack only — a small "something's different here" wink appropriate to the trickster, without breaking the shared-template rule anywhere else. |

### 04 · Pudina Pehelwan

| | |
|---|---|
| Primary / shadow / tint | `#3FBF6F` / `#1B7442` / `#DDF6E6` |
| Mascot | `MascotCutout flavour="pehelwan" expression="happy"` |
| Backdrop | Hard vertical stripes |
| Descriptor | `TANGY MINT ✱ HEAT ■■□□□` (2/5) |
| Signature detail | Stripes run **full-bleed edge to edge** of the hero art window with no margin — the only pack where the backdrop touches all four sides of its zone, matching his "planted, immovable, fills the frame" comic panel direction. |

---

## 4. The Whole Gang — variety 4-pack

Spans the same 300×420 canvas but the template flexes: zone 3 (hero art) splits into a **2×2 quadrant grid**, one flavour colour per quadrant, each quadrant's mascot cutout standing at the bottom of its own cell — a miniature version of the flavour-grid section (spec §05), not a new layout invented from nothing.

```
┌──────────────────────────────────┐
│ hey. — THE WHOLE GANG             │
├────────────────┬─────────────────┤
│  Pataka         │   Malai          │
│  (red quadrant) │  (yellow quadrant)│
├────────────────┼─────────────────┤
│  Jaadu          │   Pehelwan       │
│ (purple quadrant)│  (green quadrant)│
└────────────────┴─────────────────┘
₹̶3̶9̶6̶  ₹349                    4 × 60g
```

Zones 1, 2 and 5 stay as-is (shared eyebrow, wordmark, footer), just carrying the variety pack's own price pair (`₹396` struck, `₹349` live, per `VARIETY_PACK` in `flavours.ts`). No fifth colour is invented — the four quadrant fills ARE the palette, which is the honest visual argument for buying the box: you get all four.

---

## 5. Back panel (phase 2 — not consumed by the site yet, spec'd for completeness)

Shares zones 1 and 2 (eyebrow, wordmark) with the front for shelf consistency, then:

- **Nutrition table** — Space Mono, per 100g: `PROTEIN 9.7g · FAT 0.1g · CALCIUM 347mg`, identical numbers to the Proof Band's nutrition card (§07 of the landing page) so the pack and the site never contradict each other.
- **Ingredients** — plain-language list, living up to spec's *"Nothing you can't pronounce"* line: `Makhana, sunflower oil, [flavour seasoning], salt.` No em dashes, no ingredient the shopper would need to look up.
- **Story blurb** — 2-3 lines, Hind, the same Mithila-pond sourcing story used in the comic intro's left column, so a shopper who never visits the site still gets the brand story on-pack.
- **Compliance block** — a green-dot vegetarian mark (India's mandated FSSAI vegetarian symbol) and a reserved line reading `FSSAI Lic. No. [reserved]` — a placeholder slot, not a fabricated real licence number. This is real production content that has to exist somewhere; noting it here so it isn't discovered missing at print time.
- **Roundel seal, reprised** — same device as the front, smaller, doubling as a "best before" / batch-code ring.

**Side panels:** narrow, Space Mono only — net weight, a barcode placeholder, and the flavour name rotated 90°(so it reads on a shelf edge). Low design risk, low priority; build only when a real 360° sequence or print run is scheduled.

**Top / bottom:** functional only — tuck-flap glue lines, no branded art. Out of scope for this pass entirely.

---

## 6. Production-readiness notes (phase 2)

This plan's phase-1 output (the front panel) is **display art**, matching how `NotifyForm`'s mock API and `mock-api.ts` treat every other "not-real-yet" surface on this site: honest, tokenised, good enough to ship, clearly not a print file. Phase 2, if it happens, needs:

- **Bleed and safe margins** — none of this plan's measurements include the 3mm bleed a real carton die-line needs; that's a print-production pass, not a design-system one.
- **CMYK conversion** — every hex in `tokens.css` is defined for screen (sRGB); a real print run needs a CMYK pass so `--pataka` #EF3E2F doesn't shift muddy off a four-colour press. Spec §1 already wants a "limited 4-colour offset" look, so this is a feature to lean into, not fight.
- **Dieline** — the flip-top tuck carton's actual fold/glue geometry, which this plan deliberately doesn't draw. A packaging structural designer's job, not a UI design pass.

None of this blocks phase 1. The front-panel art this plan specs is exactly what `Pack360`, `ProductCard`, `Shop` and `Hero` need today.

---

## 7. File plan

```
public/packs/pataka-peri-peri.svg    replace — front panel, phase 1
public/packs/malai-mood.svg          replace — front panel, phase 1
public/packs/jaadu-masala.svg        replace — front panel, phase 1
public/packs/pudina-pehelwan.svg     replace — front panel, phase 1
public/packs/variety-pack.svg        replace — front panel, phase 1

public/packs/back/*.svg              new — phase 2, not yet wired to any component
public/packs/side/*.svg              new — phase 2, not yet wired to any component

src/lib/packArt.ts                   no change — same contract, same file paths
src/components/hero/Pack360.tsx      no change — same 300×420 static image contract
src/components/product-card/         no change
src/components/shop/                 no change
```

Every front-panel replacement is a drop-in: same file path, same viewBox, same call sites. No component touches this plan requires.

---

## 8. Build order

| Phase | Scope | Unblocks |
|---|---|---|
| **1** | Five front panels (4 flavours + variety pack), the shared template | Hero, ProductCard, Shop, FlavourColumn all render real pack art instead of the placeholder rect-and-circle |
| **2** | Back panel, side panels, CMYK pass, dieline | Real print production and the eventual 36-frame 360° sequence (spec §03) |

Phase 1 alone is a complete, honest visual upgrade over the current placeholder and needs no code changes to ship.

---

## 9. Done when

- [ ] All five front panels share the exact same five-zone template, differing only in colour, mascot, backdrop device and copy
- [ ] Each flavour's pack backdrop device matches its comic panel backdrop device exactly (starburst / bands / rings / stripes)
- [ ] Heat meter on-pack uses the same five-square glyph as the `HeatMeter` component, not a redrawn equivalent
- [ ] Mascot art is `MascotCutout`, `expression="happy"`, standing on the panel floor — not a bust, not floating
- [ ] Max 3 colours per pack + ink, 3px border, `6px 6px 0` shadow, grain overlay, halftone shading only
- [ ] No gradient anywhere except Pataka's posterised starburst
- [ ] Price shown as struck MRP + live price, matching `flavours.ts` exactly
- [ ] No "SOLD OUT" or ticket copy baked into the art — that stays a UI overlay
- [ ] Canvas stays 300×420 so `Pack360`, `ProductCard`, `Shop` need zero code changes
- [ ] Variety pack's 2×2 quadrant grid uses all four flavour fills, no invented fifth colour
