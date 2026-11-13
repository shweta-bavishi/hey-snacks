# Comic Panel Design — all four variants

**Status:** proposal
**Relates to:** §04 Comic intro in [`docs/landing-page-plan.md`](./landing-page-plan.md) · [`docs/hey-makhana-design-spec.md`](./hey-makhana-design-spec.md) §05, §07
**Touches:** `src/components/comic-intro/`, `src/components/comic-panel/`, `public/mascots/`

---

## 1. What is built today, and why it doesn't land yet

[`ComicIntro.tsx`](../src/components/comic-intro/ComicIntro.tsx) renders **one** panel at a time and swaps it on tab click. Five problems, in order of how much they cost:

**1 · The mascot slot is being fed a cropped head.**
`<MascotAvatar size={88} />` is a **circular bust crop** — `SIZE_FRAMES` in [MascotAvatar.tsx:44](../src/components/mascot-avatar/MascotAvatar.tsx#L44) zooms to 130% and pans down 28% specifically to frame a head inside a 88px circle with a border. It is exactly right for tabs and chips. Inside a `4:3` comic panel it is a small circle floating in a large tinted rectangle.

The result: **all four panels are compositionally identical.** Circle, centred, bubble top-right. The only thing that differs between Pataka and Malai is a hex value. That is the "vibe-coded" tell the spec's §11 checklist is written to catch.

**2 · The full-body art is being thrown away.**
`public/mascots/` holds flat-vector, ink-outlined, halftone-shaded **full-body** art with four genuinely distinct silhouettes:

| | Silhouette | Energy |
|---|---|---|
| **Pataka** | narrow vertical + radiating burst overhead | upward, explosive |
| **Malai** | wide low mound, shawl pooling | sinking, settled |
| **Jaadu** | cone/triangle, robe widening to the floor | theatrical, symmetrical |
| **Pehelwan** | broad X, arms up in double-bicep | outward, planted |

Four contrasting shapes is a gift. The current crop reduces all four to the same circle.

**3 · Never shows all four at once.** The brief was "for all 4 flavours a different comic panel is shown." Solo-only means you can never see the gang as a gang.

**4 · Remount on every tab click.** `key={soloFlavour.slug}` at [ComicIntro.tsx:88](../src/components/comic-intro/ComicIntro.tsx#L88) tears down and rebuilds the panel. That re-runs `ComicPanel`'s IntersectionObserver, so the entry animation replays on every tab press, and it restarts the mascot idle loop — the exact thing `ComicPanelProps.mascot` documents against.

**5 · Uniform staging.** Every panel: same aspect, same `tail="bottom-left"`, same bubble pinned to `top: var(--s-2); right: var(--s-2)` ([comic-panel.module.css](../src/components/comic-panel/comic-panel.module.css)), same reveal. Pataka mid-explosion and Malai half-asleep animate in identically.

---

## 2. The idea

> **Composition carries the character. Colour is the last thing that distinguishes them, not the first.**

Each panel gets its own **camera angle, silhouette anchor, background device, bubble placement, prop set, and reveal motion**. If you desaturated the whole grid to greyscale you should still be able to tell who is who. That is the bar.

**What I took from OffLimits:** I fetched the site; it's JS-rendered so the markdown extraction gave thin visual detail, and I'm not going to over-claim what I couldn't see. The one structural idea it clearly confirms is worth stealing: **"Day in the Life"** — each character gets first-person dialogue that establishes personality through voice rather than description ("Hayyyyyyyyyyyyyy. I'm Spark, your new bff."). The panels below are each a *moment* in that character's day, spoken in their own register — Pataka in caps, Malai in dragged lowercase, Jaadu in trailing ellipsis, Pehelwan in a direct challenge.

---

## 3. The four panels

Copy comes from spec §04. Every colour, size and duration below resolves to an existing token.

### Panel 01 · Pataka — **"THE BLAST"**

```
┌─────────────────────╳──────┐   ← burst crops off the TOP edge
│   ╲  ╱ ╲  ╱ ╲  ╱          │      (breaks the frame on purpose)
│  ── ✳ posterised ──   ╱▔▔╲│
│   ╱  ╲ ╱  ╲ ╱  ╲     │AAG.││   ← shout bubble, starburst outline
│      ┌──────┐         │LAGA││     top-right, tilted +4°
│      │PATAKA│         │ DI.││
│      │ full │         ╲▁▁╱ │
│  ✱   │ body │              │   ← spark sticker, -15°
│      └──────┘              │
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘   ← torn edge (already built)
```

| | |
|---|---|
| **Art** | `pataka-happy.png` — arms wide, bigger burst. Full body, **bleeds off the top edge** so the explosion escapes the panel |
| **Camera** | Low angle, worm's-eye. He towers |
| **Backdrop** | Posterised radial starburst, 6 hard bands, `--pataka` → `--pataka-tint`. The one gradient the spec permits, and it's stepped. Shares the component with the hero starburst |
| **Bubble** | `tone="shout"` · `tail="bottom-left"` · top-right · `rotate(4deg)` |
| **Line** | `AAG. LAGA. DI.` — caps, full stops between words |
| **Props** | 3 halftone speed-lines radiating from behind him · one `✱` spark sticker bottom-left at `-15deg` |
| **Reveal** | Punch in: `scale(.92) → 1` on `--ease-spring`, overshoots. He detonates into frame |

---

### Panel 02 · Malai — **"THE SINK"**

```
┌────────────────────────────┐
│                        z   │   ← z's drift up-right,
│                     z      │     20/14/10px, fading
│                  z         │
│   ╭─────╮   ▁▁▁▁▁▁▁▁▁▁▁▁▁ │   ← flat horizontal halftone bands
│   │i'm not│  ▁▁▁▁▁▁▁▁▁▁▁▁ │
│   │lazy,  │      ~ steam   │
│   │i'm    │   ┌─────────┐  │
│   ╰──○────╯   │  MALAI  │  │   ← bottom-anchored. The empty
│      ○        │ sprawl  │  │     air above him IS the joke
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌┴─────────┴╌╌┘
```

| | |
|---|---|
| **Art** | `malai-default.png` — squat, shawl pooling, chai in hand, eyes half-shut. **Bottom-anchored**, sitting on the torn edge |
| **Camera** | Eye-level, wide. Deliberate dead space above him |
| **Backdrop** | Flat horizontal halftone bands in `--malai`, evenly spaced. A lazy sunset. No gradient |
| **Bubble** | `tone="thought"` · `tail="bottom-right"` · **low-left**, small · `rotate(-3deg)` |
| **Line** | `i'm not lazy, i'm marinating.` — all lowercase |
| **Props** | Three `z` glyphs drifting up-right, descending size and opacity · one steam curl off the chai cup |
| **Reveal** | Slow fade + **8px settle downward**. Every other panel rises into place; he is the only thing on the page that sinks |

---

### Panel 03 · Jaadu — **"THE REVEAL"**

```
┌────────────────────────────┐
│  ✦        ╭────────╮       │   ← concentric hard rings,
│      ╭───╮│ JAADU  │       │     centred on the cupped hand
│    ╭─│ ◎ │╯  robed  ╲   ✦  │
│    │ ╰───╯  figure    │    │
│    ╰──────╮  ∴∵∴ ────╯    │   ← masala dust spirals from
│      ✦    │ ╱▔▔▔▔▔▔╲      │     hand toward the bubble
│           ││Ek chutki│     │
│      ✦    ││masala...│  ✦  │   ← bubble tail POINTS at the hand
│           │╲▁▁▁▁▁▁▁▁╱     │
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
```

| | |
|---|---|
| **Art** | `jaadu-default.png` — robed, turban, sparkles, cupped hand mid-flourish |
| **Camera** | Dead centre, symmetrical. Staged, like a proscenium |
| **Backdrop** | 4 concentric hard-edged rings in `--jaadu`, **off-centred onto his cupped hand** so the hand reads as the source |
| **Bubble** | `tone="speech"` · `tail="bottom-left"` · mid-right, tail aimed at the hand · `rotate(2deg)` |
| **Line** | `Ek chutki masala... bas.` — trailing ellipsis, over-promising |
| **Props** | ~14 `--marigold` halftone dust dots spiralling from hand to bubble, connecting art to dialogue · 5 `✦` sparkles at varied size and rotation |
| **Reveal** | Small `rotateY` flip-in — a card being turned over. The magician's reveal, and the only 3D move in the set |

---

### Panel 04 · Pehelwan — **"THE CHALLENGE"**

```
┌────────────────────────────┐
│╱▔▔▔▔▔▔▔╲  │ │ │ │ │ │ │ │ │   ← vertical akhara stripes
││Taazgi ka│ │ │ ╭───╮ │ │ │ │
││ dangal. │ │ │ │ ◎ │ │ │ │ │   ← paper roundel seal
││ Aa jao. │─╯ │ ╰───╯ │ │ │ │     behind his head
│╲▁▁○▁▁▁▁▁╱   ╱  ╲   ╱  ╲    │
│      ○     │ PEHELWAN  │   │   ← straight-on hero shot,
│  ╱▔╲       │  flexing  │   │     symmetrical, fills the frame
│ ╱mint╲     │           │   │
│ ╲leaf╱                 ╱▔╲ │   ← mint leaves, ±12°
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌[HEAT 2/5]╌┘
```

| | |
|---|---|
| **Art** | `pehelwan-default.png` — double-bicep flex, mint-leaf muscles, langot. Fills the frame edge to edge |
| **Camera** | Straight-on, slightly low. Planted, symmetrical, immovable |
| **Backdrop** | Hard vertical stripes in `--pehelwan`, akhara-banner style · one `--paper` roundel seal behind his head, matchbox-label style |
| **Bubble** | `tone="shout"` · `tail="bottom-right"` · **top-left** · `rotate(-4deg)` |
| **Line** | `Taazgi ka dangal. Aa jao.` — a direct challenge |
| **Props** | Two mint-leaf cut-outs in the bottom corners at `±12deg` · Space Mono `HEAT 2/5` stamp bottom-right |
| **Reveal** | Drops and **lands** — `translateY(-10px) → 0` with a hard stop, no overshoot. 3px settle jitter. He doesn't float in, he arrives |

---

## 4. The 2×2 grid reads as one comic page

The four panels are designed **against each other**, not in isolation. Bubble placement is mirrored diagonally so the four bubbles form a rough diamond around the grid's centre:

```
        ┌──────────────┬──────────────┐
        │ 01 PATAKA    │ 02 MALAI     │
        │      ╭──────╮│╭────╮        │
        │      │bubble││││bub││       │   Pataka's bubble pulls RIGHT
        │      ╰──────╯│╰────╯        │   Malai's pulls LEFT and LOW
        │   [art]      │      [art]   │
        │  rotate -2°  │  rotate +1.5°│
        ├──────────────┼──────────────┤
        │ 03 JAADU     │ 04 PEHELWAN  │
        │              │╭────╮        │
        │   [art] ╭───╮│││bub││       │   Jaadu's pulls RIGHT
        │         │bub││ ╰────╯       │   Pehelwan's pulls LEFT
        │         ╰───╯│      [art]   │
        │  rotate +2°  │  rotate -1.5°│
        └──────────────┴──────────────┘
             ↑ gutters in --paper-2, --s-3
```

- **All four are `1:1` in grid mode** so the 2×2 stays square and clean.
- Each sits at its own small rotation — `-2°`, `+1.5°`, `+2°`, `-1.5°` — satisfying the spec's "at least 5 elements at a deliberate rotation".
- Gutters are `--paper-2` showing through, which is how a printed comic page actually works.
- Reveal staggers 180ms in reading order via the existing `panelIndex` prop, **each panel using its own motion** from §3. The stagger is already built; only the per-panel motion is new.

---

## 5. Two modes, no remount

| Mode | Behaviour |
|---|---|
| **Grid** (default) | All four `1:1`, 2×2, staggered reveal. The gang as a gang. |
| **Solo** | Tab click expands one panel to its **character aspect** — Malai `16:9` (the sprawl needs width), Pehelwan `4:3`, Pataka and Jaadu `1:1`. Backdrop scales up, and props that are illegible at grid size appear. |

**Fix the remount.** Keep all four panels mounted at all times and animate `grid-area` / `flex` between layouts. Never key off the active slug. This kills the replaying entry animation and the restarting idle loop, and is also the only way a grid→solo transition can be animated at all.

Mobile: grid becomes a 1-column stack of solo panels, or a snap-scroll carousel — one panel per screen at `4:3`, next peeking 12%.

---

## 6. Do not use `public/mascots2/`

`mascots2/` is a **different art style**: rendered human faces, soft purple glow, airbrushed shading. Compare `jaadu-default.png` (flat vector, ink outline, halftone) with `mascots2/jaadu-happy.png` (photoreal-ish face inside a soft gradient cloud).

It breaks three spec rules at once: §3.4 rule 1 (no gradients), §5 ("all four drawn at the same eye-height and stroke weight"), and §11 ("illustrations consistent in stroke weight and palette across all four mascots"). Mixing the sets would undo the identity.

**Recommendation:** keep `mascots2/` out of the panel system entirely, and decide separately whether it stays in the repo at all. Right now both folders are untracked, so nothing is committed either way yet.

---

## 7. What gets built

**New — `src/components/mascot-cutout/MascotCutout.tsx`**
The missing piece. Renders the **full-body** PNG uncropped: `object-fit: contain`, bottom-anchored, per-flavour bleed offsets so Pataka's burst can crop off the top edge while Malai sits flush on the bottom. No circle, no border, no bust framing.
`MascotAvatar` stays exactly as it is — a bust crop is correct for tabs, chips and the palette. Two components because they are two different jobs.

**New — `src/components/comic-panel/PanelBackdrop.tsx`**
Four variants: `starburst` · `bands` · `rings` · `stripes`. Inline SVG, flat or posterised only, tokens only, `aria-hidden`.

**New — `src/components/comic-panel/PanelProps.tsx`**
The staging layer: spark sticker, drifting `z`s, steam curl, masala dust spiral, sparkles, mint leaves, heat stamp. Data-driven from a `props[]` array so a panel's dressing is config, not JSX.

**New — `src/data/comicPanels.ts`**
Per-flavour **staging** config, keyed by `FlavourSlug`:
```ts
{ expression, cameraAnchor, bleed, backdrop, bubblePlacement,
  bubbleTone, bubbleTail, bubbleTilt, props[], revealMotion,
  gridRotation, soloAspect }
```
Panel *staging* is presentation config, so it lives here — `flavours.ts` stays the single source for flavour **data** (`line`, `heat`, `price`, `theme`), exactly as `CLAUDE.md` requires. `comicPanels.ts` references flavours by slug and never duplicates a field.

**Changed — `ComicPanel.tsx`**
New props: `backdrop`, `props`, `bubblePlacement`, `bubbleTilt`, `revealMotion`. The bubble is currently hardcoded to `top/right` in CSS; that becomes placement-driven. Everything already built — torn-edge mask, ink border layer, flavour shadow, grain, `panelIndex` stagger — is untouched.

**Changed — `ComicIntro.tsx`**
Grid mode added and made the default, all four mounted, `key=` removed, tabs switch layout instead of swapping content.

**Stories** — `comic-panel-story.tsx` extended to all four variants in both modes; `mascot-cutout-story.tsx` added.

---

## 8. Accessibility and reduced motion

- The four reveal motions are four separate animations, so **four reduced-motion paths**, written at the same time as the animations, not after. Under `prefers-reduced-motion: reduce`: all four become opacity-only, no stagger, no rotation, no flip, no jitter. Panels keep their static rotations — those are layout, not motion.
- Backdrops and props are decorative: `aria-hidden="true"`, never announced.
- The dialogue is the content. Each panel exposes its line as real text in the bubble, already the case today.
- Tab row keeps the existing `role="tablist"` + arrow-key handling. Grid mode needs `aria-selected` to reflect that **no** panel is solo, so the tablist gains an explicit "All four" state rather than lying about which tab is active.
- Contrast: every bubble is `--paper` fill with `--ink` text over a tint backdrop, so text contrast never depends on the flavour colour underneath.

---

## 9. Build order

| Step | Scope |
|---|---|
| 1 | `MascotCutout` + story — prove the full-body art reads correctly at panel size |
| 2 | `comicPanels.ts` staging config + `ComicPanel` prop surface |
| 3 | `PanelBackdrop` ×4 |
| 4 | Grid mode in `ComicIntro`, all four mounted, remount bug fixed |
| 5 | `PanelProps` dressing ×4 |
| 6 | Per-panel reveal motions + their four reduced-motion paths |
| 7 | Solo transition without remount, mobile carousel |

Steps 1–4 already give a real 2×2 comic page with four distinct compositions. 5–7 are the polish that makes it feel drawn rather than assembled.

---

## 10. Done when

- [ ] Greyscale test: with all colour removed, all four panels are still individually identifiable
- [ ] No two panels share a camera angle, bubble placement, backdrop device or reveal motion
- [ ] Full-body art, not bust crops, in every panel
- [ ] At least one character breaks its frame (Pataka's burst)
- [ ] Bubbles form the diamond; grid reads as one page, not four cards
- [ ] Tab switching never remounts a panel or replays an entry animation
- [ ] Four reduced-motion paths built and tested on a real device
- [ ] No `mascots2/` art anywhere in the panel system
- [ ] Zero hardcoded colours, sizes, durations — tokens only
- [ ] Every box 3px ink, every shadow 0 blur, grain on every fill
