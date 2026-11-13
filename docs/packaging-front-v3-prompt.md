# Packaging front — v3 contrast + hierarchy pass

**Status:** ready to run · supersedes the v2 disc pass
**Reference render:** [`packaging-front-v3-target.svg`](./packaging-front-v3-target.svg) — Pataka, showing the fixes applied
**Relates to:** [`packaging-claude-design-prompt.md`](./packaging-claude-design-prompt.md) · [`packaging-front-snack-pile-prompt.md`](./packaging-front-snack-pile-prompt.md)

v2 failed on value structure: cream wordmark card, cream seal, cream disc, cream
flavour card and cream-coloured food gave the panel only two values, so nothing
could stand out. The mascot was red-on-dark-red-on-red and vanished. This pass
fixes value, not layout.

---

## PROMPT · v3, all five fronts

```
Revise all five front artboards. The five-zone template stays — zone order, the
wordmark, the roundel seal, the flavour name card, the heat meter, the footer.
The shelf test still has to pass: every zone boundary at the same height across
all five. Everything below is a contrast and hierarchy fix, not a re-layout.

THE PROBLEM BEING FIXED
Right now the panel has only two values: light cream and mid-red. The wordmark
card, the seal, the disc, the flavour card AND the food are all the same cream,
so cream stopped being an accent and became a second background. The food has no
separation from the disc it sits on, and the mascot is a red character on a
dark-red backdrop on a red field. Build a real value ladder: ink black, deep
red, mid red, cream, plus one marigold accent.

1. GIVE THE FOOD A HARD CONTACT SHADOW, DO NOT DARKEN IT
The makhana stay pale ivory — a browned makhana stops reading as makhana. The
separation comes from a shadow, not from tinting: every piece in the cluster
casts a hard flat shadow onto the cream disc, offset down-and-right by about 9px
at 900px artboard width, zero blur, in a warm mid-tan. All the shadows are drawn
as one layer beneath the whole cluster, so they merge into a single offset
silhouette — the way a poster prints a shadow, not the way a photo makes one. No
soft shadow, no blur, no gradient anywhere.

2. MAKHANA MUST READ AS MAKHANA
Each one is an organic puffed ball with a genuinely irregular outline — radius
varying visibly around its circumference, never a clean circle, never a
straight-sided or boxy shape. Pale ivory base, one hard-edged shade plane on the
lower-right at about a 15% step down, two small brown scorch blisters placed
asymmetrically, and a small halftone dot patch confined to the shade plane.
No centre seam, no hilum "eye" in the middle, and no two spots sitting
symmetrically above a curve — anything that reads as a face on the food steals
the mascot's job. Size ladder: one hero piece, two large, two mid, three small.

3. DARK NUTS GO ON TOP, NOT BEHIND
Almonds are the darkest thing in the cluster and are the punctuation that makes
the pile legible. Put 3 of them in the FRONT layer, spread around the cluster's
edge, drawn large. Pumpkin seeds (muted green) and sunflower seeds (near-ink with
cream stripes) also sit in front, not buried. Order the cluster so the beige
pieces never form one continuous unbroken mass — a dark piece must interrupt the
silhouette at least three times around its perimeter.

4. THE MASCOT BECOMES A HIGH-CONTRAST BADGE
Stop trying to make a red character read on a red field. The mascot sits inside a
circular die-cut badge overlapping the disc's upper-left: solid ink-black fill,
a marigold ring, an ink keyline outside that, and a hard offset shadow in the
flavour's deep shade. Badge diameter about 38% of the hero window's width.
Because the badge is ink-black, the mascot inside it is outlined in CREAM, not
ink — an ink outline on an ink plate is invisible. Keep the mascot's design,
pose, props and colours exactly as drawn; only the outline colour and the plate
behind it change. It is small and loud instead of big and camouflaged.

5. PUSH THE BACKDROP DEVICE TO A THIRD VALUE
The starburst / bands / rings / stripes currently sit one step from the field, so
they read as texture rather than a device. Take them down to a near-ink deep
shade of the flavour colour — dark enough to be a distinct third value in a
greyscale squint. Reduce the starburst to 10 points with a larger inner radius so
it reads as a halo, not as spikes.

6. DROP THE HALFTONE FRINGE AROUND THE DISC
It fuzzed the crispest edge on the pack. The disc gets a 4px ink keyline and a
hard flat offset shadow in the deep shade. Nothing else.

7. ADD ONE MARIGOLD ACCENT, AT ABOUT 5% OF AREA
#FF9F1C, in exactly three places and nowhere else: the star inside the roundel
seal, the filled squares of the heat meter, and the live price in the footer.
A two-colour pack always reads flat; this is what makes the red sing.

8. FIX THE INVERTED HIERARCHY
The two highest-contrast elements are solid black bars carrying the least
important copy. Slim the eyebrow strip and the footer strip to about 5% and 7% of
panel height respectively, reduce the eyebrow's letter-spacing so the line fits
the panel width with margin on both sides, and raise the flavour name to roughly
104px at 900px artboard width in the heaviest weight available. The flavour name
should be the second-loudest thing on the pack after the food.

9. GARNISH
Whole, larger than any snack piece, sitting ON the cream disc at the lower-right
of the cluster, with 1-2 pieces breaking over the disc's outline. Slim and
tapered, not fat — the last pass produced a chilli that read as a slipper. Give
the garnish a thin cream highlight along its top edge so it separates where it
crosses onto the flavour colour. Nothing cropped by the panel border.
  - PATAKA: two slim red peri peri chillies with green stems, plus coarse flakes.
  - MALAI: an ink-outlined bowl of cream with a spoon, two drips beside it.
  - JAADU: three hard-edged mounds of ground masala (turmeric, chilli, garam
    masala), one star anise, two dried chillies.
  - PEHELWAN: a mint sprig with flat vein lines, a fallen leaf, a lime wedge.
  - VARIETY: no garnish; one disc centred over the 2x2 quadrant grid, the four
    mascot badges arranged around it, mix dusted with all four seasoning colours.

10. FLAVOUR-SPECIFIC SILHOUETTE
At shop-grid size all four packs currently differ only in hue. Let each flavour's
garnish break the disc outline in a different direction — Pataka's chillies out
to the lower-right, Pehelwan's mint out to the upper-left, Jaadu's masala mounds
low and centre, Malai's bowl to the left — so the packs differ in shape, not just
colour, when you cannot read them.

UNCHANGED
Snack pieces stay pantry neutrals on every artboard — ivory makhana, amber
peanut, dark brown almond, pale cashew, green and near-ink seeds. Only garnish
and masala dust carry flavour hue. 3px ink outline on every piece, card and
badge. Two flat colour planes per piece. Grain over every solid fill. No
photography, no gradient, no soft shadow, no plate or table under the disc.

DELIVER
Same five artboards, same names, 900x1260, in a single row:
  front/pataka-peri-peri · front/malai-mood · front/jaadu-masala ·
  front/pudina-pehelwan · front/variety-pack
Check three things across the row: zone boundaries level, discs the same size and
centre height, and — squinting until the artwork blurs — five distinct values
visible on every pack.
```

---

## Review

1. **Greyscale squint.** Desaturate the row. If you cannot count five values, the
   pass failed regardless of how it looks in colour.
2. **Thumbnail at 120px.** The shop-grid width. The disc reads as a disc, the
   mascot badge as a dark dot, the makhana as distinct lumps.
3. **Makhana test.** Cover the copy. "Makhana and nuts" passes; "nuts" or
   "potatoes" means the ivory/shade step is wrong or the outline is too regular.
