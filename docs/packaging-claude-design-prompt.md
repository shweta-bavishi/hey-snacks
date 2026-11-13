# Packaging — Claude Design prompt

**Status:** ready to run
**Relates to:** [`packaging-design-plan.md`](./packaging-design-plan.md) · [`mascot-art-brief.md`](./mascot-art-brief.md) · [`comic-panel-design-plan.md`](./comic-panel-design-plan.md)
**Output target:** `public/packs/*.svg` (replacing the current placeholder set)

One prompt, five artboards on one sheet — deliberately not split into passes the way the mascot brief was. All five packs share one strict template, so they need to be designed *together*, in view of each other, the same way the mascot character sheet put all four mascots on one artboard to lock in consistency before anything else was drawn.

**Before running this:** the prompt below re-describes the four mascots in full physical detail (pose, proportions, props, colour) rather than saying "use the mascot art." Claude Design has no memory of the earlier mascot session unless this is run inside that same canvas — if it *is* the same canvas/project, you can trim those physical-description paragraphs down to "the mascot from the character sheet, happy expression" and it'll hold the model's own reference instead. If it's a fresh canvas, keep the full descriptions in — they're load-bearing.

---

## PROMPT · Packaging front panels — all five SKUs

```
Design the front-panel artwork for five snack packaging cartons for an Indian
makhana (foxnut) snack brand called "hey." — four single-flavour boxes plus
one variety box, all sharing one strict shared template so they read as one
product line seen together on a shelf or in a 4-up web grid.

ART DIRECTION
1970s Indian matchbox label crossed with a Bollywood poster, printed on cheap
four-colour offset. Flat vector illustration, ink outlines, halftone-dot
shading only — never a gradient, blur, or soft shadow, with exactly one
exception noted below. Hand-made and specific, never a template.

CANVAS
Each artboard IS the full front face of a small flip-top carton — not a
cutout floating on a page. The artwork fills the artboard edge to edge; nothing
sits outside a 3px ink border drawn just inside that edge. Opaque throughout,
no transparency anywhere — this is a printed panel, not a die-cut sticker.
Aspect ratio exactly 5:7 portrait (e.g. 900×1260). All five artboards must be
this exact same size.

THE SHARED TEMPLATE
All five artboards use these same five horizontal zones, in this order, at
the same proportional heights. Only colour, mascot, background device and
copy change between artboards — the zone boundaries themselves must land at
the same height on every single one, so that placing all five side by side,
every strip lines up in a continuous straight line across the whole row.

1. EYEBROW STRIP (top ~6% of height) — cream background, small mono/technical
   lettering, uppercase, wide letter-spacing: "VEGAN * GLUTEN-FREE * ROASTED
   NOT FRIED". This exact line, identical, on all five artboards.

2. WORDMARK BLOCK (next ~12%) — a cream card with a 2px ink outline containing
   the wordmark "hey." in a high-contrast serif display face, lowercase, with
   the full stop rendered as a filled circle in THAT ARTBOARD'S flavour colour
   (not ink) — the one place the mark itself carries the flavour identity.
   A small circular badge (a "roundel seal" — like an authenticity stamp on a
   vintage tin label) overlaps the top-right corner of this card: a ring of
   small uppercase text reading "100% BIHAR MAKHANA" running around the rim,
   ink outline, cream fill, present on all five artboards.

3. HERO ART WINDOW (largest zone, middle ~55%) — the flavour's mascot,
   standing on the floor of this window, happy / welcoming expression, making
   eye contact with the viewer (a package greets the shopper, unlike a comic
   panel). Behind the mascot, THIS FLAVOUR'S background device, described per
   flavour below. This zone's background colour is that flavour's pale tint.

4. FLAVOUR NAME LOCKUP (next ~17%) — a cream card, 2px ink outline, tilted
   -4 degrees. Contains: the flavour's short name in a large, chunky, rounded
   display face (bold, playful, like the word "Modak" — an Indian sweet —
   sounds); a technical/mono descriptor line below it reading the flavour
   subtitle plus a heat/crunch meter drawn as exactly 5 small squares in a
   row, filled solid in ink up to that flavour's heat value and left as
   outline-only squares after it (a discrete meter, not a gradient or a
   number).

5. FOOTER STRIP (bottom ~10%) — cream background, mono/technical lettering:
   net weight on the left ("60g"), price on the right as two numbers — the
   higher one with a strikethrough, the lower one large and bold — plus a
   small "NET WT *" label. Same layout on all five, only the numbers change.

SHARED RULES ON EVERY ARTBOARD
- 3px ink outline (#14110F) on every card, badge and the outer panel border.
- Every card/badge with a raised look uses a hard flat drop shadow offset
  down-and-right, zero blur, in that flavour's darker "shadow" colour (given
  per flavour below) — never a soft shadow.
- Halftone-dot shading only, never a smooth gradient or opacity ramp — with
  ONE exception, noted under Pataka below.
- Maximum 3 colours per artboard: that flavour's primary, its darker shadow,
  and a cream highlight (#FFF8EE) — plus the ink outline and the cream card
  backgrounds shared by every artboard.
- A fine grain/noise texture sits over every solid colour fill.
- No border-radius anywhere above a small keyline radius, except the roundel
  seal, which is a true circle.

THE FOUR MASCOTS — draw exactly these characters, matching physical build,
proportions and props precisely across all reappearances of each one:

1. PATAKA (peri peri). Primary #EF3E2F, shadow #8C1A12, tint #FFE3DE.
   A red cylindrical firecracker-bodied character with horizontal white and
   dark-red stripe bands around its body, stick arms bent up in a victory-V
   ending in stubby orange-red mitts, short stick legs ending in orange-red
   boot shapes, black rectangular sunglasses, a wide open-mouth white grin,
   and a fuse sticking up from the top of its head ending in a jagged
   multi-point starburst with small spark diamonds scattered around it.
   Background device: a posterised radial starburst directly behind him,
   made of exactly 6 hard concentric colour bands (no blending between
   bands) — this IS the one gradient-like exception permitted on the whole
   page, and even it must be hard-stepped, never smooth. Let the starburst's
   outermost point break through the top edge of the hero art window — the
   one place across all five packs where a background device is allowed to
   escape its zone.
   Copy: name "PATAKA", descriptor "PERI PERI", heat meter 4 of 5 filled.

2. MALAI (malai mood). Primary #FFC93C, shadow #C4820A, tint #FFF3D6.
   A golden-yellow squat buffalo-like character with backward-curving brown
   horns, droopy half-lidded sleepy eyes, a small closed content smile, and a
   cream/white shawl draped over its shoulders that pools outward at the
   bottom into a wide cone/teepee silhouette. One arm holds a small cup of
   chai (with a visible handle and saucer). Halftone dot shading covers the
   lower half of the shawl.
   Background device: flat horizontal halftone bands in the flavour primary,
   evenly spaced, no radial or diagonal element.
   Signature detail: place the flavour name card (zone 4) noticeably LOWER
   than on the other four artboards, leaving visible empty cream space above
   it in the hero art window — deliberate negative space, not a mistake.
   Copy: name "MALAI", descriptor "MALAI", heat meter 1 of 5 filled.

3. JAADU (desi masala). Primary #6B2FD6, shadow #3D137F, tint #EBE1FF.
   A tall character in a purple wrapped turban (with visible fold lines) and
   a long purple robe that widens from the shoulders down into a cone
   silhouette reaching the floor, with a white sash/belt stripe across the
   chest. Thick black moustache, almond-shaped eyes with a knowing look. One
   arm rests relaxed at the side; the other is raised with fingers spread in
   a flourish, with small sparkle/diamond glyphs floating near that hand.
   Halftone dot shading on the lower robe.
   Background device: 4 concentric hard-edged rings in the flavour primary,
   OFF-CENTRED so they visibly radiate from his flourishing hand rather than
   from the middle of the frame.
   Signature detail: the roundel seal in zone 2 is recoloured to marigold
   (#FF9F1C) on this artboard only — every other artboard's seal stays ink-
   on-cream. The one small break in an otherwise identical shared element.
   Copy: name "JAADU", descriptor "MASALA MAGIC", heat meter 3 of 5 filled.

4. PEHELWAN (pudina). Primary #3FBF6F, shadow #1B7442, tint #DDF6E6.
   A muscular green wrestler character, bare-chested with visible ab-line
   segments in halftone dot texture, a thick black moustache and short black
   hair, arms bent at the elbow in a double-bicep flex with pointed leaf-
   shaped bicep caps, a white waist-wrap with a red side stripe, standing
   with feet planted wide apart, green boot-like feet.
   Background device: hard vertical stripes in the flavour primary, running
   completely edge to edge of the hero art window with no margin on any
   side — the only artboard where the background touches all four sides of
   its zone.
   Copy: name "PEHELWAN", descriptor "PUDINA", heat meter 2 of 5 filled.

FIFTH ARTBOARD — THE VARIETY BOX ("The Whole Gang")
Same five-zone template, but zone 3 (hero art window) splits into a 2x2 grid
of four equal quadrants, one per flavour: Pataka (red, top-left), Malai
(yellow, top-right), Jaadu (purple, bottom-left), Pehelwan (green, bottom-
right). Each quadrant shows that flavour's mascot standing at the bottom of
its own cell, small, at the same relative scale in each quadrant, with no
individual background device inside the quadrants — the four flat colour
fills ARE the composition. Zone 2's wordmark text reads "hey. -- THE WHOLE
GANG" and the roundel seal stays ink-on-cream (this artboard has no single
flavour to signature-detail). Zone 4 shows the name "THE WHOLE GANG" instead
of a single flavour name, with no heat meter (there's no single heat value
for four flavours at once) -- replace that row with "4 x 60g". Zone 5 shows
price 396 struck through and 349 live.

THE SHELF TEST
Place all five artboards in a single row, front faces upright, side by side.
Every zone boundary -- the bottom of the eyebrow strip, the bottom of the
wordmark block, the bottom of the flavour name lockup -- must land at exactly
the same height across all five. If any artboard's zones sit at different
proportions than the others, resize until they match. This is the test that
matters more than any individual artboard looking good in isolation.

DO NOT
- No gradients or soft shadows anywhere except the one posterised starburst
  called out under Pataka, and even that must be hard-stepped.
- No photorealism on any mascot -- flat graphic cartoon characters only.
- No rounded "corporate mascot" styling or modern SaaS illustration look.
- No fifth colour invented for the variety box -- the four flavour fills are
  the only colours in that composition besides ink and cream.
- Do not bake in a "SOLD OUT" stamp, a ticket number, or any stock-status
  copy anywhere -- that is applied separately, over this art, in the product
  UI. This artwork is the evergreen pack design, not a stock-state screen.
- Do not invent a real-looking FSSAI licence number or other regulatory code
  anywhere on the front panel.

DELIVER
Five artboards, each exactly 900x1260 (5:7), laid out in a single row so the
shelf test can be checked at a glance, named and labelled:
  front/pataka-peri-peri
  front/malai-mood
  front/jaadu-masala
  front/pudina-pehelwan
  front/variety-pack
```

---

## After it's generated

Same review discipline as the mascots: run the shelf test yourself before treating it as final — line the five artboards up and check the zone boundaries land at the same height. Then hand it back here with "review this and replace it in the code"; the file names above (`front/{slug}`) map directly to the five paths `packArt.ts` already reads (`public/packs/{slug}.svg`), so wiring it in is the same drop-in swap the mascot art got.
