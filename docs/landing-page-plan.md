# hey. — Landing Page Build Plan

**Status:** proposal, awaiting sign-off
**Source of truth for visuals:** [`docs/hey-makhana-design-spec.md`](./hey-makhana-design-spec.md)
**Scope:** UI only. No backend, no real API, no cart, no checkout. All async is mocked.

---

## 0. What already exists (audit)

The design system is essentially done. 24 components ship with kitchen-sink stories, tokens are complete, mascot art is in `public/mascots/`. **What does not exist is the page itself** — `src/app/page.tsx` is still the Next.js starter template.

| Ready to use as-is | Needs a new section wrapper | Does not exist |
|---|---|---|
| `Header`, `Footer`, `Marquee`, `SectionHeading` | `ComicPanel` → comic section | Hero + 360° pack rotator |
| `Button`, `Card`, `Pill`, `Chip`, `Input`, `Checkbox` | `FlavourColumn` → 4-col grid | Proof band |
| `Modal`, `Toast`, `Stamp`, `HeatMeter` | `ProductCard` → shop grid | Social proof / UGC wall |
| `MascotAvatar`, `MakhanaPuff`, `SpeechBubble` | — | FAQ |
| `ScrollReveal`, `Grain`, `JarStory` | — | Scroll rail, sticky notify bar |
| `NotifyForm`, `ThemeSwitcher` | — | Mock API layer |

Roughly **70% composition, 30% new build**. The expensive set piece (jar scrollytelling) is already written.

---

## 1. Decisions locked

### 1.1 Everything runs through Notify Me. No cart anywhere.

The page follows spec §08 exactly: all four flavours are `inStock: false`, every product surface shows the `SOLD OUT` stamp, and every CTA on the page — hero, flavour columns, shop cards, sticky mobile bar, footer — resolves to the same **Notify Me** flow. `ProductCard` already implements this end to end: stamp, modal, card-flip-to-ticket, `localStorage` persistence.

Two consequences to action:

- **`Header` has a `Cart(0)` link** at [Header.tsx:68](../src/components/header/Header.tsx#L68) and again in the mobile takeover at [Header.tsx:105](../src/components/header/Header.tsx#L105), plus `.cartLink` styles in `header.module.css`. All of it comes out. A cart affordance on a page with no cart is a broken promise.
- `CLAUDE.md`'s *"Components are commerce-agnostic. No cart, no checkout, no platform SDK"* now holds with nothing to reconcile.

### 1.2 Copy is Hinglish, per spec

Full Hinglish voice as `CLAUDE.md` and spec §2 define it — code-switching mid-sentence, Devanagari inline as real language and as graphic texture. Banned words stay banned: *guilt-free, superfood, curated, seamless, journey*. No em dashes.

Spec lines being used verbatim: `Roasted right, snacked light.` · `Sab khatam. Line mein lag jao.` · `SAB KHATAM. FILHAAL.` · `hawa nahi, protein hai` · `made with ghee-level love ✱ hey. 2026` · `Seedha content pe jao` (the skip link, already shipped).

### 1.3 Pack artwork: placeholder image for now

`ProductCard` requires `packImageSrc` and `public/` has nothing but mascots. For this build, a **placeholder pack image per flavour** at `public/packs/{slug}.png` — flat flavour fill, 3px ink border, Rozha One `hey.`, Modak flavour badge, drawn from the real tokens so it is visually correct even though it is not a render.

The hero rotator takes `frames?: string[]`. With no frames supplied it renders the single placeholder, static, and the drag/keyboard affordances hide themselves rather than pretending to spin nothing. When the real 36-frame sequence lands, pass it in — no section code changes. **This means the hero's 360° is not live in this build.** Flagging it plainly rather than shipping a fake spin.

### 1.4 No command palette on the landing page

`CommandPaletteProvider` currently wraps the entire app at [layout.tsx:61](../src/app/layout.tsx#L61), so ⌘K is live everywhere. Removing it from the root layout would break `src/app/kitchen-sink/command-palette-story.tsx`, which calls `useCommandPalette()` and needs the provider in its tree.

**Plan:** move the provider from the root layout into a new `src/app/kitchen-sink/layout.tsx`. Landing page has no ⌘K, no `/` hotkey, no discoverability pulse; the kitchen-sink story keeps working untouched. The component itself is not deleted — it stays built and documented for later.

---

## 2. Page architecture

```
┌─ 00  Skip link + Grain + Toasts + Sound toggle            (global, already built)
├─ 01  Announcement marquee            marigold, scrolls left
├─ 02  Header                          sticky, morphs on scroll        [exists, minus Cart]
├─ 03  HERO                            pack · tagline · title · Notify Me
├─ 04  Comic intro                     intro copy left · 4 flavour panels right   #mascots
├─ 05  Flavour columns                 4 full-bleed colour blocks      #flavours
│   ·  Marquee #2                      peacock, scrolls right
├─ 06  Jar story                       ingredient scrollytelling       #ingredients  [exists]
├─ 07  Proof band                      indigo · origin · nutrition · vs-chips · pin code
├─ 08  Shop                            4 packs + variety box, all sold out   #shop
│   ·  Marquee #3                      rani, scrolls left
├─ 09  Social proof                    waitlist milestone · review slot · UGC · poll
├─ 10  FAQ                             accordion                       #faq
└─ 11  Footer                          giant cropped `hey.`            [exists]

   Scroll rail (right edge)  ·  Sticky mobile Notify bar
```

Three marquees at alternating directions and colours, per spec §01. Exactly three big motion moments — the pack stage, the column expand, the jar shake — and nothing else competes.

### 2.1 Anchor IDs — currently broken, must be fixed

`Header` and `Footer` link to IDs that **do not exist anywhere**. Every nav item is a dead jump today.

| Anchor | Linked from | Plan |
|---|---|---|
| `#main-content` | skip link | `<main id="main-content">` |
| `#shop` | header, footer | §08 |
| `#mascots` | scroll rail | §04 |
| `#flavours` | scroll rail | §05 |
| `#ingredients` | scroll rail | §06 |
| `#about` | header, footer | §07 proof band (origin story lives there) |
| `#store-locator` | header, footer | §07 pin-code card |
| `#faq` | footer | §10 |
| `#cart` | header ×2 | **removed** — see §1.1 |
| `#wholesale` `#contact` `#shipping` `#returns` `#instagram` … | footer | route stubs, see §4 item 8 |

---

## 3. Section-by-section specification

### 01 · Announcement marquee
`<Marquee tone="marigold" direction="left" speed={40} decorative />`

Items: `FREE SHIPPING OVER ₹499` · `100% BIHAR MAKHANA` · `ZERO PALM OIL` · `कुरकुरा` · `ROASTED, NEVER FRIED`
44px tall, Modak 18px, `✱` separators, pauses on hover, static single message under reduced motion. No new code — the component handles all of it.

---

### 03 · Hero **[new: `src/components/hero/`]**

100vh, `--paper` ground, posterised 6-step radial starburst in `--accent-tint` behind the pack. The one permitted gradient on the page, and it is stepped, not smooth.

**Desktop layout** — asymmetric 3-zone grid, not a centred stack:

```
┌──────────────────────────────────────────────────────┐
│  [mascot peeking, shoulders + eyes only, left edge]  │
│                                                      │
│               ╱  posterised starburst  ╲             │
│                 ┌──────────────┐                     │
│      ✱          │  PACK IMAGE  │          ✱          │   ← 4 drifting makhana
│                 │              │                     │     puffs, repel cursor
│                 └──────────────┘                     │     within 120px
│  ┌────────────────────────────┐        ╭─────╮       │
│  │ VEGAN ✱ GLUTEN-FREE ✱      │        │ 360°│       │   ← scrub arc, shown
│  │ ROASTED, NOT FRIED         │        ╰─────╯       │     only when frames exist
│  │                            │                      │
│  │ Roasted right,             │  ← the single tagline│
│  │ snacked light.             │                      │
│  │                            │                      │
│  │ PATAKA                     │  ← product title,    │
│  │ PERI PERI                  │    Rozha One --fs-mega│
│  │                            │    3px --rani misreg  │
│  │ ₹̶1̶2̶9̶  ₹99   [ Notify Me → ]                      │
│  └────────────────────────────┘                      │
└──────────────────────────────────────────────────────┘
```

**Content — one tagline, one title, one CTA:**
- Eyebrow (Space Mono `--fs-label`): `VEGAN ✱ GLUTEN-FREE ✱ ROASTED, NOT FRIED`
- Tagline (Hind `--fs-body-l`): **`Roasted right, snacked light.`**
- Title (Rozha One `--fs-mega`, `line-height: .85`, 2 lines, `text-shadow: 3px 3px 0 var(--rani)`): **`PATAKA PERI PERI`**
- Price (Space Mono): `₹129` struck · `₹99` live. Anchoring a launch price on a sold-out product is what makes the waitlist feel like a queue for something real (spec §14).
- CTA: `<Button variant="primary" size="lg">Notify Me →</Button>` → opens the same `NotifyForm` modal as the shop cards, with `source: 'hero'`.

**`<Pack360 />` — built now, live later:**

| `frames` prop | Behaviour |
|---|---|
| absent (this build) | renders `public/packs/pataka-peri-peri.png` static, at a fixed `aspect-ratio`. Scrub arc, drag cursor and arrow-key hints do not render. |
| supplied (later) | idle auto-rotate 1 step/80ms · scroll-scrub within the hero · drag to spin with `↔` cursor · `←` `→` step 10°, `Home` resets · reduced motion freezes at frame 0 but keeps drag and arrow keys live |

Written against the frame API from day one so the upgrade is a prop, not a rewrite.

**Always live, frames or not:** the posterised starburst, 4 drifting `MakhanaPuff`s on sine paths that repel the cursor within 120px, and the mascot cut-out peeking from the left edge.

**Mobile:** pack at 40vh, text stacks below, 2 puffs not 4, no drag.

**Watch out:** `100vh` on mobile Safari is a trap. Use `100svh` and test on a real device. Reserve pack height with `aspect-ratio` so CLS stays at 0.

---

### 04 · Comic intro **[new: `src/components/comic-intro/`]**

`--paper-2` band, 55/45 split, `id="mascots"`.

**Left column:**
- Eyebrow pill: `MEET THE GANG`
- Headline (Rozha One `--fs-h1`, misregistered): **`Four flavours. Zero chill.`**
- Body (Hind `--fs-body-l`, max 62ch):
  > Makhana is a lotus seed. It grows in the ponds of Mithila, gets hand-popped over an open flame, and has been Bihar's best-kept secret for about a thousand years.
  >
  > Hum ise roast karte hain, season karte hain hard, and put it in a box that four extremely opinionated characters refuse to share.
- Row of 4 circular `MascotAvatar size={56}` — these *are* the tabs, and they highlight in sync with the panel.

**Right column — the comic:**
- 2×2 grid of `<ComicPanel />`, one per flavour, each in its own colour with its own mascot and its own `flavour.line` from `flavours.ts`. The component already does the torn bottom edge, the polygon speech bubble, the grain and the ink border.
- Reveal: staggered 180ms as the section enters the viewport, each panel rotating in from ±3° like a dealt card. The `panelIndex` prop drives the stagger.
- **Click a mascot tab** → strip collapses to a single large `layout="solo"` panel for that character, section tint recolours, page accent follows via `useSectionTheme`.
- `↻` sticker in the corner shuffles the strip order. Small, pointless, memorable.

**Accessibility:** the tab row is a real `role="tablist"` with arrow-key navigation and `aria-selected`, not four divs with click handlers. Reduced motion: opacity only, no rotate, no stagger.

---

### 05 · Flavour columns **[new wrapper: `src/components/flavour-grid/`]**

Four full-bleed `<FlavourColumn />` at 78vh, no gaps, hard 3px ink dividers. The column component is built; this is the flex container plus the mobile carousel.

- Heading above: `Our Makhanas` — Rozha One `--fs-h1`, centred, `--rani` swoosh underline (`SectionHeading` has `swoosh` built in).
- Hover/focus: hovered column expands to `1.6` flex over 400ms spring, others compress; mascot idle loop plays and scales 8%; puffs burst from the base; outline thickens to 4px.
- **Focus parity is non-negotiable** — expansion fires on `:focus-within` identically to `:hover`, each column is one focusable link, 4px `--indigo` ring offset 4px.
- `onNotify` opens the shared modal with that flavour pre-checked.
- Mobile: horizontal snap-scroll carousel, next card peeking at 12% so the swipe is discoverable.
- Reduced motion: expansion instant, no puff burst.

---

### 06 · Jar story **[exists — `<JarStory />`]**

Drop in as-is, wrapped in `<section id="ingredients">`. 400vh with a sticky 100vh stage, seven ingredient beats, the shake at 0.86, static-infographic fallback under reduced motion. Already built, already has a `Skip →` escape hatch.

Integration work only: confirm the pinned stage doesn't fight the header's `--z-header: 900`, and point `Skip →` at §07.

---

### 07 · Proof band **[new: `src/components/proof-band/`]**

`--indigo` background, `--paper` text — the only dark band on the page, which is exactly what makes the shop below feel bright again. Cream `Card`s, 3px ink outline.

1. **From the ponds of Mithila** — Madhubani-style lotus pond line illustration, two lines on sourcing, `Meet the farmers →`. Carries `id="about"`.
2. **The numbers** — Space Mono nutrition table, `PROTEIN 9.7g · FAT 0.1g · CALCIUM 347mg` per 100g, plus four tick badges: `Roasted not fried` · `No palm oil` · `Vegan` · `Gluten-free`.
3. **Makhana vs. chips** *(addition #5)* — a two-column Space Mono comparison, brutal and specific. `PROTEIN 9.7g / 6g` · `FAT 0.1g / 35g` · `FRIED no / yes`. Sub-line: `hawa nahi, protein hai`. One table does the persuasion work that a paragraph of adjectives cannot.
4. **Coming to your city** — carries `id="store-locator"`. Pin-code input + `Tell me →`. Mocked: any valid 6-digit PIN returns a toast. Spec §14 locked this as a card rather than a map page, and it doubles as distribution research.

---

### 08 · Shop **[new: `src/components/shop/`]**

`--paper-2` ground. `Shop` in Rozha One, Space Mono sub `[ 04 FLAVOURS ✱ 00 IN STOCK ]`. Hand-drawn ribbon across the grid top: **`SAB KHATAM. FILHAAL.`**

Designed so sold-out reads as **exclusivity, not failure**.

**Grid:** 4-up desktop / 2-up tablet / carousel mobile, using `<ProductCard />` exactly as built — 3px ink outline, `6px 6px 0` flavour shadow, pack tilted -2° straightening on hover, mascot popping from behind, stamp jitter, card lift to `9px 9px 0`, 4px `--indigo` focus ring, flip-to-ticket on submit, persisted in `localStorage`.

**Plus a fifth card — the variety box** *(addition #2)*. Spec §15 flags this as an open question and it is the right call: **`The Whole Gang`**, a 4-pack at `₹396 → ₹349`, spanning two columns, all four mascots lined up on it. It removes the "which one do I pick?" stall that kills first-time conversion, it gives the characters a reason to co-star, and as a waitlist item it tells you which people want breadth vs. a single favourite. Same sold-out treatment, same notify flow, `source: 'variety_pack'`.

Empty/sold-out microcopy under the grid: `Sab khatam. Line mein lag jao.`

---

### 09 · Social proof **[new: `src/components/social-proof/`]**

- **Waitlist milestone bar** *(addition #4, reworked)* — the free-shipping progress bar I originally proposed was structurally a cart feature, and there is no cart. The honest equivalent that does the same "you are getting somewhere" job: a segmented ink progress bar reading `2,418 / 3,000 before the first batch opens`. Five hard segments, no smooth fill. Big number above it in Rozha One, Space Mono sub `join them, obviously.` Below ~500 signups the spec says show `Be one of the first.` instead, so the component takes a threshold prop.
- **Review slot** *(addition #9)* — a 2px-outlined card with the placeholder `your review goes here. eventually.` Self-aware beats a fabricated five-star wall, and it costs nothing to swap for a real quote later.
- **UGC wall** — 6 tiles, each 3px-outlined and randomly rotated ±2°, linking to Instagram. Placeholders are flat token-coloured compositions, never grey boxes. The page must look intentional with images blocked.
- **Next-flavour poll** *(addition #6)* — four wildcards: `Achaari`, `Filter Coffee`, `Chilli Cheese Toast`, `Jaggery + Ghee`. One click to vote, results as coloured bars, persisted to `localStorage`. Zero backend, real engagement, genuine product research.

---

### 10 · FAQ **[new: `src/components/faq/`]** *(addition #3)*

Six questions in a native `<details>`-based accordion — free keyboard and screen-reader behaviour, no ARIA to get wrong — each with a `✱` marker that rotates on open. Ink rules between rows, no card chrome. Content: shelf life, shipping time, what makhana actually is, allergens, why it is not fried, wholesale. Gives `#faq` a home and answers the objections that otherwise become support email.

---

### Sticky mobile Notify bar **[new: `src/components/sticky-notify/`]** *(addition #1)*

Below 768px, once the hero scrolls out: a fixed bottom bar, 3px ink top rule, filled in the active flavour colour, showing flavour name + `₹99` + `Notify Me →`. The hero CTA scrolls away and never comes back otherwise, and most traffic here will be mobile. Highest-impact single addition on the list. Hides while the notify modal is open; respects safe-area insets.

---

### Scroll rail **[new: `src/components/scroll-rail/`]** *(addition #7)*

Thin right-edge vertical rule with one notch per section, filling in the active flavour colour as you pass. Desktop only, `aria-hidden` (it is a duplicate of landmark navigation, not a replacement for it), hidden entirely under reduced motion. Orients the reader on a page this long, and echoes the jar story's own progress rail so it reads as one system.

---

## 4. The additions, and where each one landed

| # | Addition | Where |
|---|---|---|
| 1 | Sticky mobile Notify bar | own component, §3 |
| 2 | Variety 4-pack SKU | §08, fifth card |
| 3 | FAQ | §10 |
| 4 | ~~Free-shipping progress~~ → **waitlist milestone bar** | §09 — original was a cart feature; this is the cart-free equivalent |
| 5 | Makhana vs. chips comparison | §07, card 3 |
| 6 | Next-flavour poll | §09 |
| 7 | Scroll progress rail | own component, §3 |
| 8 | Route stubs — `/about`, `/store-locator`, `/wholesale`, `/faq`, `not-found.tsx` | thin pages so header and footer stop linking into the void; each is a styled "coming soon" using real tokens, not a blank |
| 9 | Review slot with honest placeholder | §09 |
| 10 | ~~Section nav in ⌘K~~ | **dropped** — the palette is off the landing page per §1.4. The scroll rail covers orientation instead. |

Two of the ten depended on features you have since cut (cart, palette). Rather than fake them, #4 is reworked into something that genuinely applies and #10 is dropped outright.

---

## 5. Mock data layer

`src/lib/mock-api.ts` — every async surface in one obviously-fake file:

```ts
notifyMe(payload)          // 600ms → { status: 'created' | 'duplicate', ticket: '#0143' }
subscribeNewsletter(email) // 500ms → ok; 'taken@…' → duplicate branch
checkPinCode(pin)          // 400ms → serviceable | waitlist
votePoll(option)           // instant, localStorage
getTurnstileToken()        // resolves 'mock-token' — NotifyForm already expects this shape
```

Deliberately includes latency and a failure branch. Loading and error states are in the definition of done and cannot be built against an instant `Promise.resolve()`.

---

## 6. File plan

```
src/app/page.tsx                            rewrite — composition only
src/app/layout.tsx                          remove CommandPaletteProvider
src/app/kitchen-sink/layout.tsx             new — CommandPaletteProvider moves here
src/app/not-found.tsx                       new
src/app/(stubs)/about|store-locator|…       new — thin styled stubs
src/lib/mock-api.ts                         new
src/data/faq.ts                             new
src/data/pollOptions.ts                     new
src/data/flavours.ts                        + varietyPack entry
public/packs/{slug}.png                     new — placeholder pack art ×4 + variety

src/components/hero/Hero.tsx                new
src/components/hero/Pack360.tsx             new — frames-ready, static today
src/components/hero/Starburst.tsx           new — posterised, 6 hard steps
src/components/comic-intro/ComicIntro.tsx   new
src/components/flavour-grid/FlavourGrid.tsx new
src/components/proof-band/ProofBand.tsx     new
src/components/shop/Shop.tsx                new
src/components/social-proof/SocialProof.tsx new
src/components/faq/Faq.tsx                  new
src/components/sticky-notify/StickyNotify.tsx new
src/components/scroll-rail/ScrollRail.tsx   new

src/components/header/Header.tsx            remove Cart link (desktop + takeover)
src/components/header/header.module.css     remove .cartLink

src/app/kitchen-sink/*-story.tsx            one per new component
```

Every new component ships with: types, all states (default/hover/focus/active/disabled/loading/error/empty), keyboard access, a branded focus ring, a reduced-motion path **written at the same time**, and a kitchen-sink story. Tokens only — no hardcoded colour, size, spacing or duration anywhere.

---

## 7. Build order

| Phase | Scope | Outcome |
|---|---|---|
| **1** | `page.tsx` skeleton, all anchor IDs, 3 marquees, header Cart removal, palette relocation, mock API, route stubs | A real page that scrolls end to end. Nothing dead-links. |
| **2** | Hero + starburst + `Pack360` + placeholder packs | The opening shot works. |
| **3** | Comic intro, flavour grid, jar story integration | The three content set pieces in place. |
| **4** | Proof band, shop + variety pack, notify modal wired everywhere | The page can be joined from. |
| **5** | Social proof, FAQ, sticky notify bar, scroll rail, poll | Additions land. |
| **6** | Anti-vibe-coded checklist (spec §11), reduced-motion pass, a11y audit, 375/768/1280/1920 | Ship. |

Phases 1–4 are a complete, working waitlist page. 5–6 land without redesign.

---

## 8. Definition of done for the page

- [ ] Spec §11 anti-vibe-coded checklist passes, all 15 items
- [ ] Zero hardcoded colours, sizes, spacings or durations — tokens only
- [ ] Every box has a 3px ink border; every shadow has 0 blur
- [ ] Grain overlay on every solid fill
- [ ] No dead `#` anchors anywhere in header or footer
- [ ] No cart affordance survives anywhere in the UI
- [ ] ⌘K does not fire on the landing page; kitchen-sink story still works
- [ ] Devanagari appears ≥4× as graphic texture
- [ ] Full keyboard pass: comic tabs, flavour columns, notify modal, FAQ, sticky bar
- [ ] `prefers-reduced-motion` pass tested on a real device, not just devtools
- [ ] Page reads as intentional with images blocked
- [ ] LCP < 2.0s on 4G, CLS < 0.05, JS < 180KB gzipped
- [ ] Every colour/text pair passes WCAG AA
- [ ] Every new component has a kitchen-sink story
