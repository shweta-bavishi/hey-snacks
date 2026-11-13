# Packaging front — snack disc prompt (v2)

**Status:** ready to run · supersedes the v1 "snack pile" pass, which put the food
loose on the window floor and got lost next to the mascot
**Relates to:** [`packaging-claude-design-prompt.md`](./packaging-claude-design-prompt.md) · [`packaging-design-plan.md`](./packaging-design-plan.md) §2
**Output target:** `public/packs/*.svg` (front panels, revised)

What went wrong in v1: the mascot kept the big cream oval, so the oval read as
the hero and the food read as spill. The food was also drawn too small and too
scattered to survive a thumbnail, and the flavour garnish ran off the right edge.

v2 takes the Lay's device literally — **the mix sits on a cream disc, and the disc
is the hero.** The mascot gives up the oval and stands behind the disc. One
judgement call baked in: the mascot is demoted, not removed. That is the only way
both survive a 5:7 panel at thumbnail size.

---

## PROMPT · Put the mix on a cream disc, all five fronts

```
Revise all five front artboards. The five-zone template stays exactly as it is —
zone heights, eyebrow strip, wordmark card, roundel seal, flavour name card, heat
meter, footer. The shelf test still has to pass: every zone boundary lands at the
same height across all five.

ONE STRUCTURAL CHANGE, inside zone 3 (the hero art window) only.

KILL THE CREAM OVAL BEHIND THE MASCOT. It is replaced by a new element: the
snack disc.

THE SNACK DISC — the new hero of the pack
A large cream circle (#FFF8EE), a true circle, not an oval, sitting in zone 3.
  - Diameter: about 78% of the hero art window's width.
  - Position: centred horizontally, sitting low in the window — its bottom edge
    lands just above the flavour name card, close enough that a few snack pieces
    can break across that line.
  - 3px ink outline (#14110F) around the full circle.
  - A hard flat drop shadow offset down-and-right in that flavour's shadow
    colour, zero blur.
  - Around the outside of the circle, a halftone-dot fringe: a ring of dots in
    the flavour's shadow colour, largest against the circle's edge and stepping
    down in size outward over about 3 rings, stopping cleanly. This is the
    posterised stand-in for a glow. No gradient, no blur, no soft light.
  - The circle is IDENTICAL on all five artboards — same size, same position,
    same outline. Only what sits on it changes.

WHAT SITS ON THE DISC — the mix, drawn big
The snack fills the disc generously, a single dense overlapping cluster that
covers roughly 70% of the disc's area, weighted to the lower two-thirds, with
cream disc still visible around it. This is a product shot in flat vector: the
food is the subject, drawn large and clearly, not confetti.

Pieces, in this proportion:
  - MAKHANA — the hero piece, and the largest thing in the cluster. Each one is
    about 1/4 the disc's diameter. Puffed foxnut: an irregular, slightly lumpy
    near-round popped ball, off-white, one small dark-gold hilum spot, an
    outline that is visibly not a clean circle. 5-6 of them, front and centre,
    the first thing the eye lands on. If a shopper cannot name this piece, the
    artboard has failed.
  - PEANUTS — 6-8 skinless split halves, flat oval with one straight cut face
    and a notch at the tip, pale tan. Drawn about half a makhana's size.
  - ALMONDS — 4-5 pointed teardrops, warm brown, fine centre seam line.
  - CASHEWS — 3-4 curved comma shapes, pale cream.
  - SEEDS — 5-6 total: flat pointed pumpkin seeds in muted green and smaller
    striped sunflower seeds in near-ink grey with a cream stripe.
  - MASALA DUST — flecks and specks clinging to the pieces and scattered on the
    cream disc immediately around the cluster. Sparse. It is seasoning, not
    texture fill.

Total 23-29 visible pieces. Every piece overlaps at least one other, front
pieces fully opaque over back ones with a clean ink outline between them. Every
piece tilted to its own angle — nothing axis-aligned, no two pieces of the same
kind sharing a rotation.

HOW EACH PIECE IS DRAWN
- 3px ink outline on every single piece, no exceptions.
- Exactly two flat colour planes per piece: a base, and one hard-edged shade
  plane on the lower-right. A halftone-dot patch on the shade plane of the
  makhana and the larger nuts only.
- No gradient, no blur, no soft shadow, no specular highlight, no 3D shading,
  no photography anywhere in the cluster.
- 3-4 pieces break across the disc's outline — sitting half on cream, half on
  the flavour colour outside it. That overlap is what stops the disc reading as
  a sticker. Nothing floats free more than a piece's width away from the disc.
- Grain/noise texture over the fills, same as every other solid fill.

WHERE THE MASCOT GOES
The mascot no longer owns the centre. It stands BEHIND the disc, offset to the
upper-left, overlapping the disc's edge so that its head, shoulders and both
arms are clearly visible above and to the left of the circle while its body and
legs are hidden behind it. Scale it to about 60% of its current height. Do not
re-pose it, do not recolour it, do not change its expression — it still makes
eye contact with the viewer, now presenting the disc rather than standing on its
own. The mascot is fully opaque where visible; the disc is fully opaque over it.

The flavour's background device (starburst / bands / rings / stripes) is
unchanged and runs behind both mascot and disc, still filling the hero window.
On the Pataka artboard the starburst still breaks the top edge of the window.

FLAVOUR GARNISH — the only per-artboard difference on the disc
2-3 whole raw flavour cues, drawn LARGER than any snack piece, in the same flat
two-plane ink-outlined style, the way a chips pack shows whole tomatoes and
garlic beside the chips. They sit at the lower-right of the cluster, resting
partly on the disc and partly breaking over its outline onto the flavour colour.
Every garnish shape must be fully inside the artboard — nothing cropped by the
panel edge.

  - PATAKA (peri peri) — two whole red peri peri chillies with green stems, one
    lying flat, one tilted up, plus a scatter of coarse red flakes.
  - MALAI (malai) — a small ink-outlined bowl of thick cream with a spoon in it,
    flat white fill, halftone shade plane, and two cream drips on the disc
    beside it. No pouring stream, no splash crown.
  - JAADU (desi masala) — three hard-edged mounds of ground masala (turmeric
    gold, chilli red, dark garam masala brown) with halftone shading, one whole
    star anise, two dried red chillies.
  - PEHELWAN (pudina) — a mint sprig with 5-6 pointed leaves and flat vein
    lines, one fallen leaf in front of the cluster, and a lime wedge cut
    face-on.
  - VARIETY BOX — the 2x2 quadrant grid stays, and the disc sits on top of it,
    dead centre, overlapping all four quadrants. The four mascots stay in their
    quadrants, visible around the disc's edges, none of them moved or resized
    beyond what the disc covers. One mix on the disc, carrying a light dusting
    of all four seasoning colours. No garnish. No fifth colour.

COLOUR DISCIPLINE
Snack pieces stay pantry neutrals — off-white makhana, tan peanut, brown almond,
cream cashew, muted green and grey seeds — plus ink and cream, on every single
artboard. A peanut is peanut-coloured on the purple pack. Only the garnish and
the masala dust carry flavour hue. Do not tint the food to match the pack.

DO NOT
- No photography, no photoreal or 3D rendering, no gloss.
- No plate, bowl, tray or table under the disc. The disc IS the surface. (The
  malai cream bowl is a garnish object, not a serving vessel.)
- No cream oval, capsule or rounded rectangle behind the mascot — that shape is
  gone from every artboard.
- No new copy. No "NEW", no ingredient labels, no arrows or callouts pointing at
  the food.
- No piece of garnish or snack cropped by the outer panel border.
- Do not move, resize or restyle any zone, card, badge or piece of type. If the
  disc does not fit, shrink the disc — never the flavour name card.

DELIVER
The same five artboards, same names, same 900x1260 size, revised in place:
  front/pataka-peri-peri
  front/malai-mood
  front/jaadu-masala
  front/pudina-pehelwan
  front/variety-pack
In a single row. Two checks across the row: every zone boundary at the same
height, and the disc at the same size and centre height on all five, so the five
discs read as one straight line of circles across the line-up.
```

---

## Review before wiring it in

1. **Shelf test** — five in a row, zone boundaries level, and the five discs
   forming a straight line of same-size circles.
2. **Thumbnail test** — shrink one to ~120px, the shop-grid width. The disc
   should still read as a disc and the makhana as distinct lumps. If the cluster
   goes to mush, there are too many pieces or they are drawn too small.
3. **Makhana test** — cover the copy, ask what the snack is. "Makhana and nuts"
   passes. "Nuts" means the foxnuts still are not big or lumpy enough.

File names map to the same five `public/packs/{slug}.svg` paths `packArt.ts`
already reads, so it stays a drop-in swap.
