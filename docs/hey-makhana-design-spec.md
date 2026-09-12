# hey. — Landing Page Design Specification
**Brand:** hey (foxnuts / makhana)
**Direction:** Desi Pop — retro Indian street graphics, reinterpreted for a modern D2C snack brand
**Date:** September 2026
**Purpose:** Design blueprint to hand to Claude Design / engineering

---

## 0. The one-line brief

> **hey** is the makhana brand that behaves like an Indian street corner: loud, warm, colour-drunk, and secretly very healthy.

Everything below serves one job: make the page feel **hand-made and specific**, not template-assembled. The anti-pattern to avoid is "purple gradient hero + rounded cards + Inter". We are doing the opposite: flat inks, hard shadows, halftone grain, misaligned-on-purpose stickers, and type that shouts.

---

## 1. Why "Desi Pop" and not an OffLimits clone

OffLimits works because it is *culturally specific* (90s American cereal-aisle nostalgia + mascot subculture). Copying its Y2K bubblegum look would give you the surface without the substance.

The equivalent cultural well for an Indian makhana brand is deep and almost untouched in D2C:

| Source | What we borrow |
|---|---|
| **Truck art** (Punjab/Bihar lorries) | Ribbon banners, "Horn OK Please" hand-lettering, mirrored floral motifs, chevron borders |
| **Matchbox & masala tin labels** (1950s–70s) | Boxed lockups, roundel seals, limited 4-colour offset palette, mis-registration |
| **Bollywood poster art** | High-contrast Didone display type, cut-out character collage, radiating starbursts |
| **Bihar / Mithila (Madhubani) linework** | Fine black outline, dense flat fill, fish + lotus motifs (makhana literally grows in Mithila ponds — this is a *true* story, not decoration) |
| **Cinema hall paper tickets, rail-station signage** | Mono type, stamped "SOLD OUT" marks, perforated edges |

**The strategic hook:** makhana is a lotus seed harvested from ponds in Mithila, Bihar. That gives the brand a real origin story that no cereal brand can copy. The lotus/pond/fish motif system falls out of it for free, and it justifies Madhubani-inspired linework as *authentic* rather than borrowed.

---

## 2. Brand voice

- **Name treatment:** always lowercase, always with a full stop → **`hey.`** Reads like a greeting, sits like a logotype.
- **Tone:** Hinglish, chatty, confident, never preachy about health. Health is a punchline, not a lecture.
- **Rules:**
  - Never say "guilt-free", "superfood", "wellness journey". Everyone says these. Say "hawa nahi, protein hai" instead.
  - Short sentences. Fragments allowed.
  - Devanagari used as *graphic texture* alongside Latin, not as translation. e.g. a ribbon reading `कुरकुरा` behind an English headline.
  - Punctuation as personality: `✱`, `→`, `//`, `!!`
- **Sample lines:**
  - Hero tagline: `Roasted in Bihar. Ruined for anything else.`
  - Ingredient section: `Nothing you can't pronounce. Everything you can't stop eating.`
  - Sold-out state: `Sab khatam. Line mein lag jao.`
  - Footer signoff: `made with ghee-level love ✱ hey. 2026`

---

## 3. Colour system

### 3.1 Foundation

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#14110F` | All body text, outlines, borders. **Never pure black.** |
| `--paper` | `#FFF8EE` | Default page background. Warm newsprint, never `#fff`. |
| `--paper-2` | `#FFF3D6` | Alternate band background (cream) |
| `--ink-60` | `#14110F` @ 60% | Secondary text |
| `--grain` | noise PNG @ 4% opacity | Overlaid on **every** solid fill |

### 3.2 The four flavour identities

Each flavour owns a **primary**, a **shadow** (used for the hard offset drop-shadow), and a **tint** (section wash).

| Flavour | Primary | Shadow | Tint | Text on primary |
|---|---|---|---|---|
| **Pataka** — Peri Peri | `#EF3E2F` Chilli Red | `#8C1A12` | `#FFE3DE` | `--ink` (4.84:1 ✓ AA) |
| **Malai** — Cream Cheese | `#FFC93C` Butter Yellow | `#C4820A` | `#FFF3D6` | `--ink` (12.24:1 ✓ AAA) |
| **Jaadu** — Masala Magic | `#6B2FD6` Jamun Purple | `#3D137F` | `#EBE1FF` | `--paper` (6.63:1 ✓ AA) |
| **Pehelwan** — Tangy Mint | `#3FBF6F` Pudina Green | `#1B7442` | `#DDF6E6` | `--ink` (7.96:1 ✓ AAA) |

### 3.3 Supporting accents (used sparingly, for stickers, ribbons, marquees)

| Token | Hex | Text on it |
|---|---|---|
| `--marigold` | `#FF9F1C` | `--ink` (9.16:1) |
| `--rani` | `#FF2E88` | `--ink` (5.37:1) |
| `--peacock` | `#0FA3A3` | `--ink` (6.08:1) |
| `--indigo` | `#2D3EA8` | `--paper` (8.42:1) |

### 3.4 Colour rules (this is what stops it looking vibe-coded)

1. **Flat fills only.** No gradients anywhere except a single permitted use: the radial "starburst" behind the hero product, and even that is a **stepped/posterised** radial (6 hard bands), not a smooth blend.
2. **Hard shadows, no blur.** Buttons and cards use `box-shadow: 6px 6px 0 var(--shadow)`. Zero blur radius, ever.
3. **2px ink outline** on every card, button, badge, and image container. This is the single most identity-defining decision on the page.
4. **Max 3 hues visible in any one viewport** (plus ink and paper). Colour maximalism only works with per-section discipline.
5. **Grain over everything.** A 4% noise overlay on solid fills kills the "CSS gradient" look instantly.
6. **Deliberate mis-registration.** Section headlines get a 3px offset duplicate in a second colour, like bad offset printing. `text-shadow: 3px 3px 0 var(--rani)`.

---

## 4. Typography

All fonts are free and on Google Fonts, all support Devanagari + Latin (except the mono), so Hinglish works natively.

| Role | Font | Weight | Why |
|---|---|---|---|
| **Display / hero** | **Rozha One** | 400 | High-contrast Didone Devanagari. This *is* the Bollywood-poster voice. Instantly Indian, zero cliché. |
| **Chunky playful** | **Modak** | 400 | Inflated, rounded, named after the sweet. Used for mascot names, flavour badges, marquee text. |
| **Body / UI** | **Hind** | 400 / 500 / 600 | Clean, high-legibility, made for Devanagari+Latin by Indian Type Foundry. The workhorse. |
| **Technical / labels** | **Space Mono** | 400 / 700 | Ingredient labels, nutrition panel, command palette, prices, "SOLD OUT" stamps. The counterpoint that keeps it from being pure candy. |

### 4.1 Type scale (fluid, `clamp()`)

```
--fs-mega   : clamp(3.5rem, 12vw, 11rem)   Rozha One   — hero flavour name
--fs-h1     : clamp(2.5rem, 7vw, 6rem)     Rozha One   — section headlines
--fs-h2     : clamp(1.75rem, 4vw, 3rem)    Modak       — mascot names, card titles
--fs-h3     : clamp(1.25rem, 2.5vw, 1.75rem) Hind 600
--fs-body-l : clamp(1.125rem, 2vw, 1.5rem) Hind 400    — intro paragraphs
--fs-body   : 1rem                          Hind 400
--fs-label  : 0.8125rem                     Space Mono 700, uppercase, 0.12em tracking
```

### 4.2 Typographic rules

- Rozha One headlines: `line-height: 0.85`, `letter-spacing: -0.02em`. Let ascenders and descenders collide. Tight is the point.
- Modak never below 24px — it loses legibility.
- Space Mono labels always UPPERCASE with wide tracking, often inside a 2px-outlined pill.
- Body copy max-width **62ch**. Even a fun site needs readable paragraphs.
- **Never** use Rozha One below 32px. It's a display face only.
- Mix scripts inside a single lockup: `कुरकुरा CRUNCH` — this reads as designed, not as a localisation afterthought.

---

## 5. The four mascots

Character-led, like OffLimits, but rooted in Indian archetypes. Each mascot is drawn in **flat vector with a 3px ink outline and halftone shading** — Madhubani linework crossed with 70s comic-book colouring.

| # | Product name | Mascot | Archetype | Personality / voice | Signature pose |
|---|---|---|---|---|---|
| 1 | **Pataka Peri Peri** | **Pataka** | A lit firecracker wearing sunglasses | Loud, hype-man, permanently mid-explosion. Speaks in caps. `"AAG LAGA DI!"` | Fuse burning, arms up, sparks flying |
| 2 | **Malai Mood** (Cream Cheese) | **Malai** | A sleepy buffalo in a shawl | Soft, unbothered, comfort-core. Speaks in lowercase, drags vowels. `"soooo creamy... anyway."` | Reclining, eyes half-shut, chai in hand |
| 3 | **Jaadu Masala** (Masala Magic) | **Jaadu** | A street magician / madari with a purple turban | Theatrical, cryptic, over-promises. `"Ek chutki masala ka mol tum kya jaano..."` | Mid-flourish, spices swirling from a cupped hand |
| 4 | **Pudina Pehelwan** (Tangy Mint) | **Pehelwan** | A moustachioed akhara wrestler made of mint | Cocky, fresh, challenges you constantly. `"Taazgi ka dangal. Aa jao."` | Flexing, mint leaves for biceps |

**Consistency rules for the illustrator / Claude Design:**
- All four drawn at the same eye-height and stroke weight so they line up as a row.
- Each mascot is monochrome-tinted to its flavour colour + ink + one cream highlight. Max 3 colours per character.
- Each has a **static hero pose** and a **3-frame idle loop** (blink, bounce, or sparkle) used on hover.
- Speech bubbles are hand-drawn-ish polygons with 3px outline, never a rounded CSS rectangle.

---

## 6. Page architecture

```
┌─ 01  Announcement bar (marquee)
├─ 02  Header (sticky, morphs on scroll)
├─ 03  Hero — 360° rotating product + flavour name
├─ 04  Comic intro — brand story left, comic panel right
├─ 05  "Our Makhanas" — 4-column colour block grid
├─ 06  Ingredient scrollytelling — the jar sequence
├─ 07  Proof band — origin story + nutrition + press
├─ 08  Shop — 4 products, all SOLD OUT, notify me
├─ 09  Waitlist social proof + Instagram wall
├─ 10  Footer
└─ ⌘K  Command palette (global overlay)
```

---

## 7. Section-by-section specification

### 01 · Announcement marquee
- Full-width strip, `--marigold` background, `--ink` text, 44px tall.
- **Modak**, 18px, scrolling right→left at ~40s per loop, `✱` between items.
- Content: `FREE SHIPPING OVER ₹499 ✱ 100% BIHAR MAKHANA ✱ ZERO PALM OIL ✱ कुरकुरा ✱`
- Pauses on hover. `prefers-reduced-motion` → static, centred, single message.
- **Detail that sells it:** flip the marquee direction and colour on alternate page bands (there are 3 marquees total on the page, at sections 01, 05→06 divider, and 08→09 divider).

### 02 · Header
- **Layout:** `Shop | Store Locator` left · `hey.` centre · `About Us | ⌘K | Cart(0)` right.
- Height 72px. `--paper` background with a **3px bottom ink rule**.
- Logotype `hey.` in Rozha One, 40px, `--ink`. The full stop is a filled circle in the *active flavour colour* — it changes colour as you scroll past each flavour section. Tiny detail, huge personality.
- **Scroll behaviour:** after 100vh, header shrinks to 56px, background becomes the current section's flavour colour, and gains a `6px 6px 0` ink shadow. Spring transition, 320ms.
- **⌘K affordance:** a Space Mono pill reading `⌘K` with 2px outline. On mobile it becomes a search icon.
- **Mobile:** hamburger opens a full-screen takeover in the current flavour colour, links set in `--fs-h1` Rozha One, mascot peeking from the bottom corner.

### 03 · Hero — the 360° rotation

This is the money shot. Reference: OffLimits' looping product video, but done as a **scroll-scrubbed image sequence**, which is sharper and gives the user control.

**Layout (desktop):**
- Full-bleed, 100vh, `--paper` background with a **posterised radial starburst** (6 hard steps of `--flavour-tint`) centred behind the pack.
- Pack sits centre, occupying ~52vh height.
- Bottom-left overlay block:
  - Eyebrow: `VEGAN ✱ GLUTEN-FREE ✱ ROASTED, NOT FRIED` (Space Mono label)
  - Tagline: `Roasted in Bihar. Ruined for anything else.` (Hind, `--fs-body-l`)
  - Flavour name: `PATAKA PERI PERI` (Rozha One, `--fs-mega`, 2-line break, tight leading, 3px `--rani` mis-registration shadow)
  - CTA: **Notify Me** button (see 7.8)
- Bottom-right: rotation scrub indicator — a thin arc with a dot, Space Mono `360°` label.

**The rotation, technically:**
- 36 frames (10° apart), WebP, ~120–180KB each at 1200px tall → preload first 6, lazy-load rest.
- **Idle:** auto-rotates at 1 frame / 80ms, loops forever.
- **On scroll within hero:** rotation scrubs to scroll position instead of auto-playing.
- **On drag:** user can grab and spin it. Cursor becomes a `↔` glyph.
- **Fallback:** if the sequence hasn't loaded, show frame 0 as a static image. Never show a blank box.
- `prefers-reduced-motion` → static frame 0, no auto-rotation, drag still allowed.

**Micro-details:**
- 4 makhana puffs float in the hero, drifting slowly on a sine path with `will-change: transform`. They **repel from the cursor** within 120px.
- A cut-out of the section's mascot peeks in from the left edge, only shoulders and eyes visible.

**Mobile:** pack scales to 40vh, text stacks below, rotation is auto-only (drag conflicts with scroll), floating puffs reduced to 2.

### 04 · Comic intro — brand story + comic panel

**Layout:** 2-column, `--paper-2` background, 55/45 split. On mobile, text then panel.

**Left column:**
- Section eyebrow in a 2px-outlined pill: `MEET THE GANG`
- Headline (Rozha One, `--fs-h1`): `Four flavours. Zero chill.`
- Body (Hind, `--fs-body-l`, max 62ch):
  > Makhana is a lotus seed. It grows in the ponds of Mithila, gets hand-popped over a flame, and has been Bihar's best-kept secret for about a thousand years.
  >
  > We roast it, we season it hard, and we put it in a box that four extremely opinionated characters refuse to share.
- A row of 4 small circular mascot avatars, each 2px-outlined, that highlight in sync with the comic panel.

**Right column — the comic panel:**
- A **4-panel comic strip** in a 2×2 grid, drawn in flat vector with halftone shading. Each panel is 2px ink outline, cream page background, and belongs to one mascot in their flavour colour.
- **Behaviour:** panels reveal in sequence as the section enters the viewport (stagger 180ms, each panel does a slight rotate-in from ±3°, like a card being dealt).
- Under the panel: the 4 tabs from your sketch — `Pataka · Malai · Jaadu · Pehelwan`. Clicking a tab swaps the strip to a **single large panel** for that character with their intro line in a hand-drawn speech bubble, and recolours the section tint.
- Panel edges have a subtle **paper texture and a torn/perforated bottom edge** (SVG mask), so it reads as a printed comic, not a div.
- Idle: a small `↻` sticker in the corner rotates slowly; clicking it shuffles the strip order.

**Copy for the 4 panels:**
1. Pataka: *"AAG. LAGA. DI."* — sunglasses reflecting flames
2. Malai: *"i'm not lazy, i'm marinating."*
3. Jaadu: *"Ek chutki masala... bas."*
4. Pehelwan: *"Taazgi ka dangal. Aa jao."*

### 05 · "Our Makhanas" — the 4-column colour grid

Matches your second screenshot exactly, upgraded.

- **Headline** above: `Our Makhanas` — Rozha One, `--fs-h1`, centred, with a hand-drawn underline swoosh in `--rani`.
- **Grid:** 4 equal full-bleed columns, each 78vh tall, each a solid flavour colour with grain. No gaps, no rounded corners, hard 3px ink dividers between columns.

**Each column contains, vertically:**
1. Flavour number in Space Mono top-left: `01 / 04`
2. The mascot, large, cut-out, standing on the bottom edge
3. Product name in Modak, angled `-4deg`, ink outline
4. Flavour descriptor in Space Mono: `PERI PERI ✱ HEAT 4/5`
5. A **spice/crunch meter**: 5 small squares, filled in ink
6. On hover: a `Notify Me →` pill slides up from the bottom

**Hover interaction (this is the delight moment):**
- Hovered column expands to **1.6× flex** over 400ms with a spring easing; the other three compress.
- The mascot inside plays its 3-frame idle loop and scales up 8%.
- Makhana puffs burst upward from the column base (8–12 particles, physics-lite, 700ms).
- Background colour saturates slightly; ink outline thickens to 4px.
- **Mobile:** becomes a horizontal snap-scroll carousel with the same content; peek of the next card at 12% so the swipe is discoverable.

**Accessibility:** the expand must also trigger on keyboard focus, and each column is a single focusable link with a visible 4px `--indigo` focus ring offset by 4px.

### 06 · Ingredient scrollytelling — the jar

The centrepiece. A **pinned, scroll-driven build sequence**. Budget the most engineering time here.

**Structure:** a `400vh` tall section with a `position: sticky` 100vh stage. Scroll progress `0→1` drives everything.

| Progress | What happens | Copy on screen |
|---|---|---|
| 0.00 – 0.10 | Empty stage, `--paper`. A large glass jar illustration (2px ink outline, cream highlight) fades and scales in from 0.9. | **`Curious what's actually inside?`** (Rozha One, `--fs-h1`, centred) → fades out as jar arrives |
| 0.10 – 0.25 | **Makhana** pours in. 40 puff particles fall with gravity + bounce, settle at the bottom filling ~35% of the jar. | Left-side label card slides in: `MAKHANA ✱ 60%` + `Hand-popped lotus seeds from Mithila, Bihar.` |
| 0.25 – 0.38 | **Almonds** drop in, 12 particles, heavier fall, settle to 50%. | `ALMONDS ✱ 12%` + `For the crunch that fights back.` |
| 0.38 – 0.50 | **Cashews**, 10 particles → 62%. | `CASHEWS ✱ 10%` + `Because we're not monsters.` |
| 0.50 – 0.62 | **Peanuts**, 14 particles → 72%. | `PEANUTS ✱ 8%` + `The reliable one.` |
| 0.62 – 0.74 | **Seeds** — pumpkin, sunflower, flax. 60 tiny particles, fast, scatter → 82%. | `SEEDS ✱ 6%` + `Pumpkin, sunflower, flax. Tiny but loud.` |
| 0.74 – 0.86 | **Spices.** Not particles — a *cloud*. Turmeric, chilli, chaat masala drift down as coloured dust, tinting the whole jar. Background shifts from `--paper` to the flavour tint. | `MASALA ✱ 4%` + `The part we won't explain.` |
| 0.86 – 0.95 | **THE SHAKE.** Jar lid slams on. Whole jar shakes violently — rotate ±8°, translate ±14px, 6 oscillations over ~900ms. Every particle inside jitters. Screen shakes 4px. A `crunch` sound plays *if* the user has enabled sound. Background flashes to `--flavour-primary` for 120ms. | Labels all fly off screen |
| 0.95 – 1.00 | Jar settles. Contents are now a mixed, seasoned blend. Product pack fades in **next to** the jar. | Headline: `That's it. That's the ingredient list.` + sub: `No maida. No palm oil. No words you need to Google.` + CTA `Notify Me →` |

**Implementation notes:**
- Build with **GSAP ScrollTrigger** (`scrub: 1` for smoothing) or Framer Motion `useScroll` + `useTransform`. Particles as absolutely-positioned SVG sprites, transform-only animation, `will-change: transform`, capped at ~140 total DOM nodes.
- Pre-compute settle positions in a static array (don't run a live physics engine — it will jank on mid-range Android).
- Add a thin **progress rail** on the right edge: a vertical line with 7 notches, one per ingredient, filling in flavour colour as you scroll. Doubles as a "how much longer" affordance.
- **Reduced motion / mobile-low-power fallback:** collapse the whole thing into a **static stacked infographic** — jar illustration on the left, 7 ingredient cards on the right, revealed with a simple fade on intersection. Same copy, no pinning. This must be built, not an afterthought; scroll-jacking on a bad phone is the fastest way to lose the sale.
- **Escape hatch:** a `Skip →` link, top-right of the pinned stage, that jumps to section 07.

### 07 · Proof band — origin, nutrition, press

A short band that earns trust before the shop. `--indigo` background, `--paper` text — the only dark band on the page, which makes the shop section below feel bright again.

Three columns, each with a 2px-outlined cream card:
1. **From the ponds of Mithila** — small Madhubani-style illustration of a lotus pond, 2 lines on sourcing, `Meet the farmers →`
2. **The numbers** — Space Mono nutrition table: `PROTEIN 9.7g · FAT 0.1g · CALCIUM 347mg` per 100g, plus 4 tick badges: `Roasted not fried · No palm oil · Vegan · Gluten-free`
3. **Say hi** — press logo lockups or, pre-launch, a customer-quote slot with a placeholder that says `your review goes here. eventually.`

### 08 · Shop — everything sold out

Deliberately designed to make "sold out" feel like **exclusivity**, not failure.

- Section background `--paper-2`, headline `Shop` in Rozha One with a Space Mono sub: `[ 04 FLAVOURS ✱ 00 IN STOCK ]`
- A hand-drawn ribbon banner across the top of the grid: **`SAB KHATAM. FILHAAL.`** (`Everything's gone. For now.`)

**Product card (4-up grid, 2-up tablet, carousel on mobile):**
```
┌──────────────────────────┐  2px ink outline
│  ⟨ flavour tint bg ⟩     │  6px 6px 0 flavour-shadow
│                          │
│      [pack render]       │  slight -2deg tilt, straightens on hover
│    ╱ SOLD OUT stamp ╲    │  Space Mono, rotated -12deg, ink,
│                          │  with a distressed/rough edge mask
│                          │
├──────────────────────────┤
│  PATAKA PERI PERI        │  Modak, 22px
│  Heat ▪▪▪▪▫  ₹—          │  Space Mono
│  ┌────────────────────┐  │
│  │   Notify Me  →     │  │  full-width, flavour primary,
│  └────────────────────┘  │  ink text, 6px hard shadow
└──────────────────────────┘
```

**Card states:**
- **Default:** tilted pack, SOLD OUT stamp visible
- **Hover:** card lifts (`translate(-3px,-3px)`, shadow grows to `9px 9px 0`), pack straightens, mascot pops in from behind the pack, stamp jitters once
- **Focus:** 4px `--indigo` ring, offset 4px
- **Submitted:** card flips (`rotateY(180deg)`, 500ms) to a back face in the flavour colour reading `You're on the list. #0143` with a ticket-stub graphic and the mascot giving a thumbs-up. Persist in `localStorage` so it stays flipped on return.

**The Notify Me flow:**
1. Click → a **modal** opens, sized 440px, `--paper` on a `--ink` @ 70% scrim, with the flavour colour as a 12px top border. Mascot for that flavour sits on the top-left corner, overlapping the modal edge.
2. Fields (all Hind, 2px outlined inputs, 48px tall, no rounded corners beyond 4px):
   - `Email` — required, type=email
   - `Phone` — optional, `+91` prefix locked, 10 digits, `inputmode="numeric"`
   - `Which flavour?` — 4 colour chips, multi-select, pre-checked with the one they clicked
   - `Pin code` — optional, drives the store-locator rollout ("we'll tell you when we hit your city")
   - Consent checkbox: `Send me updates. No spam, promise.` — **required, unchecked by default** (DPDP Act compliance)
3. Submit → button shows an inline spinner made of a spinning makhana puff → success state confetti of 30 makhana puffs, card flips.
4. **Errors:** inline, below the field, in `--chilli` with a small `!` sticker. Never a browser alert. Copy: `That email looks... unusual. Mind checking?`
5. **Duplicate email:** don't error. Say `Already on the list. We remember you.` — and update their flavour preferences.

**Guardrails:** honeypot field + Cloudflare Turnstile (invisible) + rate limit 5 submissions per IP per hour. Do not use a visible CAPTCHA; it will kill conversion on a fun brand.

### 09 · Waitlist proof + Instagram wall
- A single big number in Rozha One: `2,418 people are waiting.` with a Space Mono sub `join them, obviously.` (Only show this once the number exceeds ~500. Below that, show `Be one of the first.` instead.)
- Below: a 6-tile UGC / behind-the-scenes grid, each tile 2px-outlined and randomly rotated ±2°, linking to Instagram.
- Optional but strong: a **"Design our next flavour"** poll — 4 wildcard options (`Achaari`, `Filter Coffee`, `Chilli Cheese Toast`, `Jaggery + Ghee`), one click to vote, results shown as coloured bars. Zero-cost engagement and real product research.

### 10 · Footer
- `--ink` background, `--paper` text. Full-bleed.
- Top: a giant `hey.` in Rozha One, `--fs-mega`, cropped by the bottom of the viewport so only the top 70% is visible. Bold, cheap, memorable.
- 4 columns: `Shop` (4 flavours) · `Info` (About, Store Locator, Wholesale, FAQ) · `Support` (Contact, Shipping, Returns, Privacy, Terms) · `Newsletter`
- Newsletter block: `Get the drop before everyone else.` + inline email field with a `→` submit.
- Social row: Instagram, TikTok, YouTube, WhatsApp — as 2px-outlined circular stickers.
- Bottom bar in Space Mono: `© hey. 2026 ✱ made with ghee-level love ✱ Bihar → your face`
- The 4 mascots stand along the very bottom edge, waving, half-cropped by the viewport.

---

## 8. The ⌘K command palette

Per your selections: **navigation + flavour jump**, **quick notify-me**, **theme switcher**.

### 8.1 Trigger & shell
- `⌘K` / `Ctrl+K`, or clicking the `⌘K` pill in the header, or `/` anywhere outside an input.
- Overlay: `--ink` @ 60% scrim with a 6px backdrop blur. Panel is 560px wide, centred at 22vh, `--paper` background, **4px ink outline**, `10px 10px 0 var(--ink)` hard shadow. Enters with a spring scale from 0.94 + 12px translateY, 220ms.
- Search input: Space Mono, 18px, placeholder `type a flavour, a page, or "spicy"...` with a blinking block cursor `▮`.

### 8.2 Result rows — this is where "colourful" lives
Each row is **tinted with the colour of the thing it points at**: a 6px colour bar on the left edge, and on keyboard-highlight the entire row fills with that colour (ink text on light hues, paper text on purple). Navigating with ↑↓ therefore **paints the palette down the list**. That single behaviour is the whole feature.

Row anatomy: `[6px colour bar] [icon/mascot 24px] [Label — Hind 600] [Description — Hind 400, ink-60] [⏎ or shortcut chip — Space Mono, right-aligned]`

### 8.3 Groups & commands

**Jump to** (nav)
| Command | Action |
|---|---|
| `Shop` | scroll to §08 |
| `Store Locator` | route |
| `About Us` | route |
| `Ingredients` | scroll to §06 (jumps to the *start* of the pinned section) |
| `Meet the mascots` | scroll to §04 |

**Flavours** (each row in its own colour, with mascot avatar)
| Command | Action |
|---|---|
| `Pataka Peri Peri` | scroll to §05, expand that column, set theme |
| `Malai Mood` | ″ |
| `Jaadu Masala` | ″ |
| `Pudina Pehelwan` | ″ |

**Actions**
| Command | Action |
|---|---|
| `Notify me →` | Opens the notify form **inline inside the palette** (see 8.4) |
| `Copy discount code` | copies `HEYFIRST10`, row flashes green, toast `copied ✱` |
| `Contact us` | mailto |

**Theme** (a 4-swatch row + a mode toggle)
| Command | Action |
|---|---|
| `Theme: Pataka / Malai / Jaadu / Pehelwan` | Recolours the entire site by swapping the `--accent-*` custom property block on `:root`. 400ms cross-fade on background/border colours only (never on text, that flickers). Persists in `localStorage`. |
| `Theme: Night mode` | Inverts to `--ink` background / `--paper` text, flavour colours stay. Genuinely useful and looks great with this palette. |

### 8.4 Inline notify inside the palette
Selecting `Notify me` **morphs the palette in place** (height animates, content cross-fades) into a compact form: email field → flavour chips → submit. Three fields max — the full form with phone and pin code stays in the modal at §08. On success, the panel fills with the chosen flavour colour and shows `✱ you're in.` for 1.2s before closing.

### 8.5 Behaviour details
- **Fuzzy search** (Fuse.js or `cmdk`'s built-in). Typing `peri` matches `Pataka Peri Peri`. Typing `mint`, `pudina`, `green` all match Pehelwan — build a `keywords[]` array per item including Hinglish synonyms and Devanagari spellings.
- `↑ ↓` navigate, `⏎` select, `Esc` closes, `Tab` cycles groups.
- **Empty state:** the four mascots shrugging + `Kuch nahi mila. Try "peri".`
- **Recents:** last 3 used commands pinned to the top under a `RECENT` label.
- **Discoverability:** the `⌘K` header pill pulses once, 3 seconds after first load, then never again (`localStorage` flag). Mobile shows a floating search bubble bottom-right instead.
- **Accessibility:** `role="dialog"` `aria-modal="true"`, focus trapped, focus returned to trigger on close, `aria-activedescendant` on the list, results announced via a polite live region.

**Recommended library:** [`cmdk`](https://cmdk.paco.me) — it handles filtering, keyboard nav, and ARIA correctly out of the box, and is fully unstyled, so none of the visual identity is compromised.

---

## 9. Notify-me data model

### 9.1 Schema (PostgreSQL / Supabase)

```sql
create table waitlist_signups (
  id              uuid primary key default gen_random_uuid(),
  email           citext not null,
  phone           varchar(15),                 -- E.164, e.g. +919876543210
  pin_code        varchar(6),
  consent_marketing boolean not null default false,
  source          text,                        -- 'shop_card' | 'command_palette' | 'hero' | 'footer'
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  ip_hash         text,                        -- sha256(ip + salt), never store raw IP
  user_agent      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unsubscribed_at timestamptz,
  constraint uniq_email unique (email)
);

create table flavours (
  slug        text primary key,               -- 'pataka-peri-peri'
  name        text not null,
  mascot      text not null,
  colour_hex  text not null,
  sort_order  int  not null
);

-- many-to-many: one signup can want several flavours
create table signup_flavour_prefs (
  signup_id   uuid not null references waitlist_signups(id) on delete cascade,
  flavour_slug text not null references flavours(slug),
  created_at  timestamptz not null default now(),
  primary key (signup_id, flavour_slug)
);

create index idx_signups_created on waitlist_signups (created_at desc);
create index idx_prefs_flavour   on signup_flavour_prefs (flavour_slug);
```

### 9.2 API

`POST /api/notify`
```json
{
  "email": "a@b.com",
  "phone": "+919876543210",
  "pinCode": "560001",
  "flavours": ["pataka-peri-peri", "jaadu-masala"],
  "consentMarketing": true,
  "source": "shop_card",
  "utm": { "source": "instagram", "medium": "bio", "campaign": "prelaunch" },
  "turnstileToken": "..."
}
```
Response `200`: `{ "ok": true, "position": 2419, "isNew": true }`
→ Use `position` in the success state: `You're #2419 in line.` Costs nothing, converts well.

**Server rules:**
- Upsert on email. If the record exists, merge flavour preferences rather than erroring.
- Validate phone with `libphonenumber-js`, region `IN`. Reject anything that isn't a valid Indian mobile.
- Normalise email to lowercase; reject known disposable domains.
- Verify Turnstile token server-side before any DB write.
- Rate limit: 5/hour per hashed IP, 3/hour per email.
- Fire a double-opt-in confirmation email (Resend / Postmark) — required for clean deliverability at launch, and good practice under India's DPDP Act.
- Log to your ESP (Klaviyo / Mailchimp) with `flavour_preference` as a tag so the launch email can be flavour-segmented.

### 9.3 Privacy
- Privacy policy link inside the modal, not just the footer.
- Consent checkbox **unchecked by default**, stored with a timestamp.
- One-click unsubscribe token in every email.
- Never store raw IP; hash with a rotating salt.

---

## 10. Motion system

| Token | Value | Used for |
|---|---|---|
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Everything that grows: cards, palette, column expand |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals, fades |
| `--dur-fast` | `160ms` | Hover, focus |
| `--dur-base` | `320ms` | Card lift, modal |
| `--dur-slow` | `560ms` | Card flip, section reveal |

**Principles:**
1. **Everything overshoots.** Springs, not linear ramps. This brand doesn't ease politely.
2. **Rotation is a first-class property.** Stickers, cards, stamps, panels all sit at small angles and correct on interaction.
3. **Reveal on scroll = translateY(24px) + opacity, staggered 80ms.** Nothing else. Resist the urge to add scale, blur, and rotation to every reveal — that's the tell of an unconsidered site.
4. **One hero animation per section, maximum.** The page has exactly three big moments: the 360° pack, the column expand, and the jar shake. Everything else is small.
5. `@media (prefers-reduced-motion: reduce)` → all durations to `1ms`, marquees static, jar section becomes the static infographic, 360° pack becomes a single frame. Test this path properly.

**Cursor:** a custom cursor is tempting and usually a mistake. Compromise: keep the native cursor, but add a **trailing makhana puff** that lags 120ms behind it, desktop only, disabled on any interactive element. Cheap, on-brand, doesn't break usability.

---

## 11. Anti-"vibe-coded" checklist

Run this before shipping. Each item is a specific tell that separates designed from generated.

- [ ] Zero smooth gradients on the page (except the one posterised hero starburst)
- [ ] Every box has a 2–4px ink outline; nothing floats without a border
- [ ] All shadows are hard offsets with `0` blur
- [ ] Grain/noise overlay present on all solid colour fills
- [ ] No `border-radius` above 8px anywhere except pills, which are fully round
- [ ] At least 5 elements sit at a deliberate small rotation
- [ ] Devanagari appears at least 4 times as graphic texture
- [ ] The word "seamless", "elevate", "curated" or "journey" appears zero times
- [ ] Body copy is genuinely readable: 62ch max, 1.6 line-height, ≥16px
- [ ] Real, specific copy everywhere — no `Lorem ipsum`, no `Your paragraph text`
- [ ] Illustrations are consistent in stroke weight and palette across all four mascots
- [ ] Focus states are visible and branded, not the browser default
- [ ] Reduced-motion path is fully built and tested
- [ ] Page works and looks intentional with images blocked
- [ ] Every colour/text pair on the page passes WCAG AA (verified values in §3)

---

## 12. Performance & technical budget

| Metric | Target |
|---|---|
| LCP | < 2.0s on 4G |
| CLS | < 0.05 (reserve height for the 360° stage and all image containers) |
| Total JS | < 180KB gzipped |
| Hero frame sequence | < 4MB total, first frame < 200KB, preload 6 |
| Fonts | 4 families, `font-display: swap`, subset to Latin + Devanagari, self-hosted `woff2` |

**Stack recommendation:** Next.js (App Router) + Tailwind (with the tokens above as CSS custom properties, not Tailwind's default palette) + GSAP ScrollTrigger for §06 + `cmdk` for the palette + Supabase for the waitlist. Static-generate everything; the only dynamic route is `/api/notify`.

**Testing matrix:** Chrome + Safari desktop, iOS Safari (the scroll-pinning killer), Android Chrome mid-range, 375px / 768px / 1280px / 1920px.

---

## 13. Build order (suggested)

| Phase | Scope |
|---|---|
| **1 — Foundations** | Tokens, fonts, grain, button/card/pill/input primitives, header, footer, marquee |
| **2 — Content sections** | Hero (static frame first), comic intro, 4-column grid, proof band, shop cards + notify modal + API + DB |
| **3 — The set pieces** | 360° scroll-scrub sequence, jar scrollytelling, command palette |
| **4 — Polish** | Confetti, particle bursts, cursor trail, mascot idle loops, easter eggs, reduced-motion pass, a11y audit |

Ship phase 1+2 as a working waitlist page. Phases 3–4 can land after, without redesign.

---

## 14. Decisions locked (answered)

| Question | Decision | Design consequence |
|---|---|---|
| Store Locator | **"Coming soon — tell us your pin code"** | Becomes a card in §07 Proof band, not a separate map page. Pin code feeds the same `waitlist_signups.pin_code` column, so it doubles as distribution research. Header link scrolls there. |
| Language | **Hinglish** | Body copy code-switches mid-sentence, Devanagari appears inline as real language rather than decoration. UI labels stay English so nothing is ambiguous. Rule: never translate the same sentence twice; switch scripts for rhythm, not redundancy. |
| Pricing | **Show the price** | Cards show `₹129` struck through, `₹99` live, in Space Mono. Anchoring a launch price on a sold-out product is what makes the waitlist feel like a queue for something real. |
| Asset production | **Pack design to be built in Claude Design, in sync with the site** | Design the *pack* before the hero render: the box carries the same 3px ink outline, Rozha One `hey.`, Modak flavour badge and flat flavour fill as the site. The 360° sequence is then rendered from that pack. Until it exists, the hero uses a CSS-3D box built from the real design tokens (see the demo) — which is also a perfectly good production fallback. |
| Sound | **Yes** | Crunch SFX on the jar shake, soft pop on flavour hover and successful signup. Persistent toggle bottom-right, **off by default**, choice stored in `localStorage`. Synthesised via WebAudio (filtered noise burst) so there is no audio file to download. |
| Hero flavour | **Pataka Peri Peri** | Site default accent is Chilli Red `#EF3E2F`. All other flavours reachable via the ⌘K theme switcher and the 4-column grid. |

---

## 15. Open questions for you

1. **Mascot illustration** — the four characters in the demo are placeholder vector sketches. Do you want them developed as a proper illustration set (poses, idle loops, expressions), or kept this simple and geometric?
2. **Price architecture** — is ₹99 for a 60g single pack right, and do you want a 4-pack variety box as the real hero SKU? Variety packs convert better at launch and give the four mascots a reason to appear together.
3. **Launch email** — which ESP (Klaviyo / Mailchimp / Resend)? It determines whether the flavour preference lands as a tag or a custom property.
4. **Devanagari load** — happy to subset to the ~40 glyphs actually used, or do you want full Devanagari support for future copy?

---

### Sources
- [OffLimits Cereal](https://www.eatofflimits.com/) — reference site
- [Rozha One, Modak, Hind on Google Fonts](https://fonts.google.com/)
- [Makhana packaging & flavour-architecture references](https://www.designerpeople.com/blog/makhana-packaging-design/)
- [Top makhana brands in India, 2026](https://dndesigns.co.in/blog/top-makhana-brands-in-india)
- [`cmdk` command palette library](https://cmdk.paco.me)