# Packaging front: carton to pillow pouch

**Status:** ready to run · follows the v3 contrast pass
**Relates to:** [`packaging-front-v3-prompt.md`](./packaging-front-v3-prompt.md) · [`packaging-design-plan.md`](./packaging-design-plan.md) §1

The v3 artwork is final. This pass changes the physical format only: the flat
flip-top carton becomes a crimped pillow pouch, the way a chips packet is built.
Attach a reference photo of a chips packet when you run it, for silhouette only.

---

## PROMPT · pouch conversion, all five fronts

```
Convert all five front artboards from a flat carton into a chips-style pillow
pouch. The artwork is approved and final: keep every zone, the wordmark, the
roundel seal, the mascot badge, the food cluster on the cream disc, the flavour
name card, the heat meter, the footer, the marigold accents and the full value
ladder exactly as they are. This is a format change, not a redesign. Use the
attached chips packet photo for the bag's SHAPE ONLY. Do not borrow its logo,
colours, layout, photography or type.

1. THE SILHOUETTE
A portrait pillow pouch, roughly 0.75 width to height. Top and bottom edges are
flat heat seals; the two long sides bow outward slightly where the bag is
filled with air, and pinch inward at the four corners where the seals flatten
it. Corners are softly squared, not rounded blobs. The outline is drawn as one
continuous 3px ink line, same weight as every other outline on the pack.

2. THE CRIMPED SEALS
Top and bottom seal bands each take about 7% of the bag height. Fill them with
the flavour's deep shade, with fine vertical crimp ridges drawn as thin ink
lines at even spacing. The outer edge of each seal is serrated: a zig-zag of
small, even teeth, drawn in the same 3px ink outline. Add one small tear notch
on the top seal near the right edge. No text on the seal bands.

3. HOW THE ARTWORK SITS ON A PILLOW
The artwork fills the face between the two seals. Near the bowed sides it
should feel like it wraps away from you: the outer 5% on left and right steps
down to the flavour's deep shade in one or two hard-edged flat bands, never a
gradient. Near each seal, a narrow band of the same deep shade shows where the
film pinches into the crimp, with 3 to 5 short ink wrinkle strokes fanning in
from each corner. The eyebrow strip sits just below the top seal and the footer
strip just above the bottom seal, both following the pillow's slight curve.
Nothing important falls inside the side shade bands or the corner wrinkles.

4. THE PUFF, WITHOUT A GRADIENT
Show the bag is full of air with flat light, like a screenprint, not a render.
Two hard-edged highlight shapes in cream at low opacity: one long curved streak
down the upper-left bulge, one smaller streak on the lower-right. Hard edges,
zero blur, no gloss sheen, no reflections of a room. Finish reads matte film.
Grain overlay stays on every solid fill, including the seals.

5. SHADOW AND GROUND
One hard offset shadow under the whole bag, down and right, zero blur, in ink.
No floor, no table, no cast shadow in perspective. Background of the artboard
is paper #FFF8EE, not white.

6. LAYOUT ADJUSTMENTS ONLY WHERE THE SHAPE FORCES THEM
The seals eat about 14% of the height, so scale the five zones vertically to
fit the face between them, keeping their order and relative proportions. The
mascot badge, disc and flavour name keep the same sizes relative to each other.
The shelf test still has to pass: every zone boundary at the same height across
all five bags.

VARIETY PACK
Same pouch, same seals. The 2x2 quadrant grid and four mascot badges sit on the
face exactly as they do now.

UNCHANGED
Hinglish copy as written. No em dashes. 3px ink outline on every piece, card,
badge and the bag itself. Two flat colour planes per piece. No photography, no
gradient, no soft shadow. Border radius nowhere above 8px except pills.

DELIVER
Five artboards, 900x1260, in a single row, with the bag centred in each:
  front/pataka-peri-peri · front/malai-mood · front/jaadu-masala ·
  front/pudina-pehelwan · front/variety-pack
Check across the row: identical bag silhouettes, seals level, zone boundaries
level, and at 120px wide it reads instantly as a chips packet, not a box.
```

---

## Review

1. **Silhouette test.** Fill every bag solid ink. It should read as a chips
   packet from shape alone: serrated top and bottom, bowed sides.
2. **No-gradient check.** Zoom to 400% on the side bands and highlights. Every
   tone change must be a hard edge.
3. **Code impact.** The site renders packs in a 300x420 frame (`packImageSrc`).
   The 900x1260 artboard keeps that ratio, so exported fronts drop in without
   component changes. The `Pack360` sequence still assumes a box and needs its
   own pass later.
