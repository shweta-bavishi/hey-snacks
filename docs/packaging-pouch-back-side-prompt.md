# Packaging back + side: carton to pillow pouch

**Status:** ready to run · run after [`packaging-pouch-prompt.md`](./packaging-pouch-prompt.md) (fronts)
**Relates to:** [`packaging-back-panel-plan.md`](./packaging-back-panel-plan.md) · [`hero-360-plan.md`](./hero-360-plan.md) §3

Converts the five back panels and five side panels to match the new pillow-pouch
fronts. Content stays as it is in `public/packs/back/` and `public/packs/side/`,
except that Jaadu's "Masala Magic" becomes "Desi Masala" to match `flavours.ts`.

---

## PROMPT · back and side panels, all five SKUs

```
The five front artboards on this canvas are now chips-style pillow pouches.
Convert the five back artboards and the five side artboards to the same
pouch, so the fronts, backs and sides read as one physical bag. The content,
type, palette and value ladder on the back and side panels are approved. This
is a format change, plus one copy fix. Use the attached chips packet photo
for the bag's SHAPE ONLY. Do not borrow its logo, colours, layout or type.

MATCH THE FRONT POUCH EXACTLY
Same silhouette as the fronts: roughly 0.75 width to height, sides bowing
outward slightly, pinched corners. Same top and bottom crimp seals at about 7%
of bag height each, filled with the flavour's deep shade, fine vertical crimp
ridges in thin ink, serrated zig-zag teeth on the outer edge, 3px ink outline.
Same hard-edged side shade bands and corner wrinkle strokes. Same two flat
cream highlight streaks at low opacity, zero blur. Same hard offset ink shadow,
zero blur. Paper #FFF8EE artboard background. Grain on every solid fill. The
tear notch sits on the top seal near the LEFT edge on the back, so it lines up
with the front's right-edge notch when the bag is flipped over.

BACK PANEL

1. ADD A FIN SEAL
A real chips bag is one sheet of film sealed down the middle of the back. Draw
a vertical fin seal running from the top crimp to the bottom crimp, centred,
about 4% of the bag's width: a folded flat strip in the flavour's deep shade,
a 3px ink outline, and a thin hard-edged fold line along one edge. Where it
meets each crimp seal, the crimp teeth run straight across it.

2. REFLOW THE CONTENT AROUND THE FIN SEAL
No text or badge crosses the fin seal. Keep every existing zone and its copy,
in this arrangement between the two crimp seals:
  - Eyebrow strip, full width, just below the top seal. It may run across the
    fin seal because it is a solid ink band with the copy split either side:
    "CHOLESTEROL-FREE ✱ GLUTEN-FREE" left, "✱ ROASTED NOT FRIED" right.
  - LEFT COLUMN: the wordmark block with its roundel seal
    ("MAKHANA ✱ NUTS ✱ SEEDS", Jaadu's stays marigold), then the story block
    "From the ponds of Mithila" with its two sentences unchanged.
  - RIGHT COLUMN: the nutrition strip (PROTEIN 19.9g ✱ FAT 38.5g ✱
    CALCIUM 114mg, PER 100g), the ingredients line unchanged except for Jaadu,
    the green vegetarian mark, net weight, and the barcode placeholder (moved
    here from the old side panel, since a pouch has no spine to carry it).
  - Sign-off strip, full width, just above the bottom seal, same treatment as
    the eyebrow: "✱ made with dil se love" left, "hey. 2026" right.
Left and right columns start and end at the same heights on all five backs.

3. VARIETY PACK BACK
Same pouch and fin seal. The four colour-swatched seasoning lines go in the
right column, stacked. The four-stripe band motif stays, running along the top
and bottom seals.

SIDE PANEL: THE BAG IN PROFILE

A pillow pouch has no flat side face. The side artboard shows the bag seen
edge-on, the view you get halfway through turning it in your hand.

4. THE PROFILE SHAPE
Keep the 300x1260 artboard. The bag's side is a tall lens: thin at the top and
bottom where the crimp seals pinch it flat (the seal is just a short vertical
strip there, about 20px wide, with its serrated tip), swelling to the full
artboard width at the middle. One continuous 3px ink outline. Fill is the
flavour's primary colour, with a single hard-edged band of the deep shade down
one edge to show the curve turning away. One thin cream highlight streak,
hard-edged, zero blur.

5. SIDE CONTENT
Only what fits the widest middle section, all centred on the curve:
  - Small "hey." wordmark with the flavour-coloured full stop.
  - The flavour's short name, rotated 90 degrees to read bottom-to-top, chunky
    display face, ink on the flavour colour.
  - "NET WT ✱ 60g" (240g on the variety pack), small, mono.
No barcode here any more, it moved to the back. No mascot, no backdrop device.
Every side artboard shares the same lens silhouette, so they line up exactly.

COPY FIX, JAADU ONLY
Everywhere "MASALA MAGIC" or "masala magic" appears on Jaadu's artboards,
change it to "DESI MASALA" / "desi masala". On the back that is the wordmark
subtitle and the ingredients line ("desi masala seasoning, Salt."). Apply the
same fix to the Jaadu front: its wordmark subtitle and the descriptor line,
which becomes "DESI MASALA / SPICED".

UNCHANGED
All copy not named above, word for word. Hinglish tone, no em dashes. 3px ink
outline on the bag and every card and badge. No gradient, no soft shadow, no
photography. Border radius nowhere above 8px except pills. No new colours.

DELIVER
Two rows directly below the front row, same order, same names:
  back/pataka-peri-peri · back/malai-mood · back/jaadu-masala ·
  back/pudina-pehelwan · back/variety-pack          (900x1260 each)
  side/pataka-peri-peri · side/malai-mood · side/jaadu-masala ·
  side/pudina-pehelwan · side/variety-pack          (300x1260 each)
Check: front and back silhouettes are mirror images and the seals sit at the
same heights; fin seal centred on every back; no copy touches the fin seal;
all five side lenses identical in shape.
```

---

## Review

1. **Flip test.** Put each front beside its mirrored back. Outline, seals and
   shade bands should overlap exactly.
2. **Fin seal clearance.** Nothing but the eyebrow and sign-off bands crosses
   the centre strip.
3. **Jaadu copy.** Search the exported SVGs for "MAGIC". Zero hits.
4. **Code impact.** `Pack3D.tsx` builds a rectangular box from these faces. A
   lens-shaped side on a box looks wrong mid-spin, so once this art lands,
   Pack3D needs a pouch pass: either a curved side made from several narrow
   strips, or a front-back flip with no side face shown.
