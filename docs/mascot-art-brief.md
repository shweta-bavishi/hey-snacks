# Mascot & Comic Art Brief — for Claude Design

**Status:** ready to run
**Relates to:** [`hey-makhana-design-spec.md`](./hey-makhana-design-spec.md) §5 · [`comic-panel-design-plan.md`](./comic-panel-design-plan.md)
**Output target:** `public/mascots/` (replacing the current set)

---

# Part 1 — The plan

## 1.1 Why redo the art at all

The current `public/mascots/` set is on-brand and usable, but three things force a redo:

| Problem | Consequence |
|---|---|
| **500×500 PNG** | The avatar crops zoom to **260%** at `size={20}` ([MascotAvatar.tsx:44](../src/components/mascot-avatar/MascotAvatar.tsx#L44)). A 500px master at 260% is mush. Full-body use in a comic panel needs ~1600px. |
| **One master doing two jobs** | The same bitmap is bust-cropped for avatars *and* would be used full-body for panels. `SIZE_FRAMES` exists purely to paper over this. Neither job is done well. |
| **Raster** | Cannot recolour per theme, cannot scale, and 24 PNGs blows the spec's 4MB asset budget. |

## 1.2 Decision: vector, and two artboard families

**Vector (SVG), not PNG.** Flat fills with ink outlines and halftone dots is exactly what SVG is good at. It scales from a 20px palette icon to a 600px panel hero, recolours from `tokens.css` custom properties, and costs kilobytes. Claude Design outputs `.dc.html` artboards, so vector is also its native register.

**Two families, because they are two different jobs:**

| Family | Framing | Feeds |
|---|---|---|
| **A · Bust** | 1:1 square, head + shoulders fill the frame | `MascotAvatar` at 20/32/56/88 — used in 10 places: header takeover, footer row, comic tabs, product cards, flavour columns, notify modal, palette rows, shop |
| **B · Cutout** | Full body, transparent, portrait | `MascotCutout` (new) — comic panels, flavour columns, hero peek, pack art |

Splitting these lets `SIZE_FRAMES` collapse to a single zoom value, because a purpose-drawn bust needs no rescue crop.

## 1.3 Art direction

> **1970s Indian matchbox label meets Bollywood poster, printed on cheap 4-colour offset.**

Flat vector. Ink outline. Halftone dot shading. Visible mis-registration. Nothing rendered, nothing soft, nothing glowing.

**Hard rules, from spec §5 and §3.4:**

- `3px` ink outline at 1× (`#14110F`), **identical weight on all four characters**
- Shading is **halftone dots only** — an SVG `<pattern>` of circles, never a blur, gradient or opacity ramp
- **Max 3 colours per character**: flavour primary + flavour shadow + one cream highlight, plus ink
- All four drawn at the **same eye-height** so they line up as a row
- Transparent background, always
- **No text baked into the art** — speech bubbles are DOM

## 1.4 The palette (exact)

| | Primary | Shadow | Tint |
|---|---|---|---|
| Pataka | `#EF3E2F` | `#8C1A12` | `#FFE3DE` |
| Malai | `#FFC93C` | `#C4820A` | `#FFF3D6` |
| Jaadu | `#6B2FD6` | `#3D137F` | `#EBE1FF` |
| Pehelwan | `#3FBF6F` | `#1B7442` | `#DDF6E6` |

Ink `#14110F` · Cream highlight `#FFF8EE` · Accents, sparingly: marigold `#FF9F1C`, rani `#FF2E88`, peacock `#0FA3A3`

## 1.5 Asset inventory

24 artboards, produced in **three passes**. The order matters: pass 1 is where cross-character consistency is won or lost, and everything after derives from it.

| Pass | Artboards | What |
|---|---|---|
| **1 · Character sheet** | 1 | All four, full body, default pose, **side by side on one artboard**, shared baseline and eye-line. This is the consistency contract. |
| **2 · Expression matrix** | 20 | 4 characters × (3 busts + 2 cutouts). `default` · `happy` · `idle` |
| **3 · Comic scenes** | 4 | Staged reference comps for THE BLAST / THE SINK / THE REVEAL / THE CHALLENGE |

**On pass 3:** Claude Design delivers the **character art plus a reference comp** of each assembled panel. The backdrops (starburst, bands, rings, stripes) and props (sparks, `z`s, dust, leaves) get rebuilt in code as tokenised SVG components — `PanelBackdrop` and `PanelProps` from the [comic panel plan](./comic-panel-design-plan.md) — so they recolour with the theme. The comp is art direction, not the shipped asset.

## 1.6 Small code change this implies

`MascotAvatar` currently reads `/mascots/${flavour}-${expression}.png`. It becomes `/mascots/bust/${flavour}-${expression}.svg`, and `SIZE_FRAMES` drops from a four-row crop table to one zoom value. `MascotCutout` reads `/mascots/cutout/${flavour}-${expression}.svg`.

Also: [Hero.tsx:99](../src/components/hero/Hero.tsx#L99) currently uses `MascotAvatar size={88}` for the edge peek. A bordered circle is wrong for a character peeking in from offscreen — that becomes a `MascotCutout`.

---

# Part 2 — The prompts

Three prompts, run in order. **Do not merge them** — pass 1 must be approved before pass 2, or the four characters drift apart.

---

## PROMPT 1 · Character sheet (run this first)

```
Design a character sheet for four mascots of an Indian makhana (foxnut) snack
brand called "hey." — one artboard, all four characters side by side, full body,
facing forward in their signature pose.

ART DIRECTION
1970s Indian matchbox label crossed with a Bollywood poster, printed on cheap
four-colour offset. Flat vector illustration. Think Madhubani linework meets
70s comic-book colouring. Hand-made and specific, never corporate-cute.

NON-NEGOTIABLE RULES
- Flat vector only. No gradients, no airbrush, no glow, no soft shadows, no 3D,
  no photorealism, no rendering of any kind.
- Every character has a 3px ink outline in #14110F. The stroke weight must be
  IDENTICAL on all four — this is the single most important consistency rule.
- Shading is halftone dots only: an SVG pattern of solid circles, varying in
  density. Never a blur, gradient or opacity ramp.
- Maximum 3 colours per character — their primary, their shadow, and one cream
  highlight (#FFF8EE) — plus the ink outline. Do not add a fourth.
- All four stand on a SHARED BASELINE with a SHARED EYE-LINE, so they read as a
  row. Draw a faint guide for both and align every character to it.
- Transparent background. No frame, no backdrop, no ground shadow.
- No text anywhere in the artwork.

THE FOUR CHARACTERS

1. PATAKA — Peri Peri. Primary #EF3E2F, shadow #8C1A12.
   A lit firecracker wearing black sunglasses. Loud hype-man, permanently
   mid-explosion. Cylindrical red cracker body, stubby arms and legs, a fuse on
   top burning with a hard-edged spiky starburst. Signature pose: arms thrown
   up, fuse lit, sparks flying. Cocky grin under the shades.

2. MALAI — Cream Cheese. Primary #FFC93C, shadow #C4820A.
   A sleepy buffalo wrapped in a shawl. Soft, unbothered, comfort-core. Heavy
   squat body, small curved horns, eyes half-shut, a small cup of chai held in
   one hoof, shawl pooling on the ground around him. Signature pose: reclining,
   sunk into himself, utterly unhurried. The widest silhouette of the four.

3. JAADU — Desi Masala. Primary #6B2FD6, shadow #3D137F.
   A street magician (madari) in a purple turban and long robe. Theatrical,
   cryptic, over-promises constantly. Tall, narrow, robe widening to the floor
   into a cone silhouette. Big moustache, delighted eyes. Signature pose:
   mid-flourish, one hand cupped upward with spices swirling out of it.

4. PEHELWAN — Tangy Mint. Primary #3FBF6F, shadow #1B7442.
   An akhara wrestler made of mint. Cocky, fresh, always challenging you.
   Handlebar moustache, traditional langot, and his biceps are literal mint
   leaves. Signature pose: straight-on double-bicep flex, feet planted wide.
   A broad X silhouette, symmetrical and immovable.

SILHOUETTE TEST
The four must be distinguishable as pure black shapes: Pataka a narrow vertical
with a burst on top, Malai a wide low mound, Jaadu a cone, Pehelwan a broad X.
If two silhouettes read alike, redraw.

DO NOT
- No gradients or glows of any kind.
- No human photorealism — Jaadu and Pehelwan are stylised cartoons, flat and
  graphic, not illustrated portraits.
- No drop shadows with blur. Hard offset only, or none.
- No rounded modern "corporate mascot" styling. This should look printed in
  1974, not designed in Figma.
- No extra props beyond those described.
- No background elements.

DELIVER
One artboard, 2400×1200, the four characters in a row at a shared baseline,
with the eye-line guide visible on a separate toggleable layer.
```

---

## PROMPT 2 · Expression matrix (after pass 1 is approved)

```
Using the approved character sheet as the exact style reference, produce the
full expression matrix. Same stroke weight, same palette, same proportions,
same eye-height. These are the SAME characters in different poses — not
redesigns. If a character's proportions shift between artboards, it is wrong.

Each character gets three expressions:
- DEFAULT — the signature pose from the character sheet
- HAPPY   — celebrating. Used on a success state, so it must read as delight
            at 32 pixels wide. Exaggerate: bigger, wider, more open.
- IDLE    — a small delta from default. A blink, a slight lean, a bounce. This
            is the middle frame of a subtle loop, so it must be only slightly
            different from DEFAULT, never a new pose.

TWO FAMILIES OF ARTBOARD

A · BUST — 12 artboards, 1024×1024 square, transparent.
   Head and shoulders fill the frame. The head sits in the TOP THIRD of the
   square, horizontally centred. These get cropped into circles as small as
   20 pixels, so: strong silhouette, heavy features, nothing fine. Test each
   at 20px — if you cannot tell who it is, simplify until you can.

B · CUTOUT — 8 artboards, 1200×1600 portrait, transparent.
   Full body, head to feet, no crop. Character centred horizontally and
   ANCHORED TO THE BOTTOM EDGE — feet or base flush with the artboard bottom,
   so it can stand on a panel floor. DEFAULT and HAPPY only.

NAMING
   bust/{pataka|malai|jaadu|pehelwan}-{default|happy|idle}
   cutout/{pataka|malai|jaadu|pehelwan}-{default|happy}

DELIVER
20 artboards, laid out as a 4-column grid — one column per character, so drift
between characters is visible at a glance.
```

---

## PROMPT 3 · Comic panel scenes (after pass 2 is approved)

```
Using the approved cutouts, stage four comic panels — one per character. These
are reference comps for art direction; the backgrounds and props will be
rebuilt as code, so keep every element on its own clearly-named layer.

SHARED PANEL FRAME
Square, 3px ink border (#14110F), flavour tint fill, halftone grain overlay,
and a torn/perforated bottom edge like a page ripped from a comic. Leave the
speech bubble out entirely — bubbles are added in code. Mark where each one
goes with a labelled empty rectangle.

THE FOUR PANELS — each must have its own camera angle, background device and
composition. Colour is the LAST thing that separates them, not the first.

1. PATAKA — "THE BLAST". Tint #FFE3DE.
   Low worm's-eye angle, character towering. Uses the HAPPY cutout. His
   explosion CROPS OFF THE TOP EDGE of the panel — he breaks the frame on
   purpose. Background: a posterised radial starburst in #EF3E2F, exactly 6
   hard concentric bands, no blending between them. Props: 3 halftone speed
   lines radiating from behind him, one small spark sticker in the bottom-left
   at -15 degrees. Bubble slot: top-right.

2. MALAI — "THE SINK". Tint #FFF3D6.
   Eye-level, wide. He sits LOW, flush on the bottom edge, with deliberate
   empty air above him — the negative space is the joke. Background: flat
   horizontal halftone bands in #FFC93C, evenly spaced, like a lazy sunset.
   Props: three "z" glyphs drifting up and right at 20/14/10px with descending
   opacity, one curl of steam off the chai cup. Bubble slot: low-left, small.

3. JAADU — "THE REVEAL". Tint #EBE1FF.
   Dead centre, symmetrical, staged like a proscenium. Background: 4 concentric
   hard-edged rings in #6B2FD6, OFF-CENTRED so they radiate from his cupped
   hand — the hand must read as the source of the magic. Props: roughly 14
   marigold (#FF9F1C) halftone dust dots spiralling from his hand up toward the
   bubble slot, and 5 four-point sparkles at varied sizes and rotations.
   Bubble slot: mid-right.

4. PEHELWAN — "THE CHALLENGE". Tint #DDF6E6.
   Straight-on hero shot, slightly low, symmetrical, filling the frame edge to
   edge. Background: hard vertical stripes in #3FBF6F like an akhara banner,
   plus one cream (#FFF8EE) roundel seal behind his head in the style of a
   matchbox label. Props: two mint-leaf cut-outs in the bottom corners at plus
   and minus 12 degrees. Bubble slot: top-left.

THE TEST
Desaturate all four panels to greyscale. Each must still be immediately
identifiable by composition alone. If they only differ by colour, redraw.

DELIVER
4 square artboards, 1600×1600, layers named per element.
```

---

## Part 3 — Accepting the work

- [ ] Greyscale test: all four characters identifiable as silhouettes; all four panels identifiable by composition
- [ ] 20px test: every bust is recognisable at 20 pixels
- [ ] Stroke weight identical across all four characters, measured, not eyeballed
- [ ] Max 3 colours per character, verified with a colour picker
- [ ] Shared eye-line and baseline hold across every artboard in the matrix
- [ ] Zero gradients, glows, blurs or soft shadows anywhere
- [ ] Transparent backgrounds, no baked-in frames or ground shadows
- [ ] No text in any artwork
- [ ] Cutouts bottom-anchored; busts have the head in the top third
- [ ] Proportions do not drift between a character's own expressions
- [ ] Nothing resembles the `public/mascots2/` style (rendered faces, soft glows) — that set breaks the system and must not be used as reference
