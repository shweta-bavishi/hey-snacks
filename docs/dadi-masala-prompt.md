# Jaadu → Dadi: character swap

**Status:** ready to run
**Relates to:** [`mascot-art-brief.md`](./mascot-art-brief.md) · [`packaging-pouch-prompt.md`](./packaging-pouch-prompt.md) · [`packaging-pouch-back-side-prompt.md`](./packaging-pouch-back-side-prompt.md)

The flavour is now Desi Masala, so the street magician no longer fits. Jaadu is
replaced by **Dadi**, a grandmother who guards the family masala dabba. The
product becomes **Dadi Masala**. Everything else stays: the Jamun purple
palette, heat 3, price, the rings backdrop, and the marigold seal.

**File names stay on the `jaadu` key** (`bust/jaadu-default.svg`,
`front/jaadu-masala`, etc.) so the new art drops into the existing paths with
no code changes. Only the art and the copy change.

Two prompts. Run A in the mascot canvas first. Run B in the packaging canvas
once A is approved, because B uses the approved Dadi art.

---

## PROMPT A · Dadi character art (mascot canvas)

```
Replace JAADU, the street magician, with a new character called DADI. The
other three characters on this canvas (Pataka, Malai, Pehelwan) are approved
and must not change. Dadi must look like she was drawn by the same hand, on
the same day, for the same matchbox label.

WHO SHE IS
Dadi. The grandmother whose masala nobody in the family can copy. Small, sharp,
completely sure of herself. She never measures, she never looks at the pot,
and she is never wrong. Affectionate but bossy. Her flavour is Desi Masala.

HOW SHE LOOKS
- Short and compact, the shortest of the four, but she stands very straight.
- A saree in Jamun purple #6B2FD6 with a cream #FFF8EE border, the pallu
  tucked firmly into her waist: sleeves-up, ready to cook.
- Hair pulled into a tight round bun, drawn in cream with ink strand lines.
- Round wire spectacles slipped down her nose, drawn as ink linework only. One
  eyebrow permanently raised over the top of them.
- A small firm smile, not a sweet granny grin. She knows something you don't.
- A round steel masala dabba held on her hip like a trophy, lid open, the
  seven little katoris visible inside. The dabba is cream and ink with
  halftone shading. The spice in each katori is a different halftone dot
  density in the purple shadow, NOT seven different colours.
- Skin, like every other mascot, is tinted within her own palette.

PALETTE, SAME AS JAADU'S
Primary #6B2FD6, shadow #3D137F, highlight #FFF8EE, ink #14110F. Nothing else.
Specs and dabba add no fourth colour: they are ink and cream.

SIGNATURE POSE
Mid-pinch. Her free hand is raised high, wrist flicked, dropping a pinch of
masala from a height, while her eyes look straight at the viewer, not at the
food. The dabba stays on her hip. It is the same "spice leaving the hand"
beat Jaadu had, so the comic panel still reads the same way.

SILHOUETTE
As a pure black shape she reads as a small bell with a knob on top (the bun),
one arm raised high, and a round disc sticking out at the hip (the dabba).
It must not read as a cone like Jaadu, a narrow vertical like Pataka, a wide
mound like Malai or an X like Pehelwan. Check it against all three.

SAME RULES AS THE REST OF THE GANG
3px ink outline, identical weight to the other three. Halftone dots are the
only shading, no gradients, blurs, glows or soft shadows. Transparent
background. No text in the art. Same shared baseline and eye-line as the
character sheet, even though she is shorter: her eyes sit on the eye-line
guide by standing tall, not by being scaled up. Stylised and graphic like
Pehelwan, never a realistic portrait. Do not use anything in mascots2 as
reference.

DELIVER, IN THIS ORDER
1. The character sheet updated: Pataka, Malai, DADI, Pehelwan in a row,
   2400x1200, the other three untouched.
2. Dadi's expression set, same sizes and framing rules as the others:
   BUST 1024x1024, head in the top third, must read at 20px:
     bust/jaadu-default   the signature look, eyebrow up, small smile
     bust/jaadu-happy     proud and delighted, eyes crinkled shut, big grin,
                          dabba lifted beside her face like a trophy
     bust/jaadu-idle      tiny change from default: specs nudged up the nose
   CUTOUT 1200x1600, full body, feet flush with the bottom edge:
     cutout/jaadu-default the mid-pinch signature pose
     cutout/jaadu-happy   both arms up, dabba held overhead, masala flying
   (Keep the jaadu file names. Label each artboard "Dadi" on the canvas.)
3. The comic panel "THE REVEAL" restaged with Dadi, 1600x1600, tint #EBE1FF.
   Same composition rules as before: dead centre, symmetrical, the 4
   concentric purple rings off-centred so they radiate from her raised,
   pinching hand. The roughly 14 marigold #FF9F1C halftone dust dots now fall
   DOWN from her fingers in a loose stream instead of spiralling up, plus 5
   four-point sparkles. Bubble slot stays mid-right, marked as an empty
   labelled rectangle.
```

---

## PROMPT B · Packaging update (packaging canvas)

```
The Jaadu Masala flavour has a new mascot and a new name. JAADU the magician
is replaced by DADI, a grandmother with a masala dabba, and the product name
changes from "Jaadu Masala" to "DADI MASALA". Use the approved Dadi art
[attach bust/jaadu-default and cutout/jaadu-default] exactly as drawn.

Change only what is listed. Colours, layout, pouch shape, seals, zones, the
purple palette, the rings backdrop, the marigold roundel seal, heat meter at
3 of 5, prices, nutrition and every other artboard stay exactly as they are.

FRONT (front/jaadu-masala)
1. Mascot badge: swap Jaadu for Dadi's bust inside the same ink-black badge,
   same size, same position, marigold ring, cream outline on the character
   since she sits on an ink plate.
2. Flavour name card: "JAADU" becomes "DADI". Same face, same size, same
   angle. It is a shorter word, so centre it; do not scale it up to fill.
3. Wordmark subtitle: "DESI MASALA".
4. Descriptor line: "DESI MASALA / SPICED".
5. Garnish stays the three hard-edged masala mounds, star anise and two dried
   chillies. Add one small steel katori beside the mounds so the dabba idea
   carries onto the pack.

BACK (back/jaadu-masala)
6. Wordmark subtitle: "DESI MASALA".
7. Ingredients line ends "desi masala seasoning, Salt." Nothing else in the
   line changes.

SIDE (side/jaadu-masala)
8. Rotated short name: "JAADU" becomes "DADI".

VARIETY PACK (front, back, side of variety-pack)
9. Swap Jaadu's mascot badge for Dadi's in the quadrant grid. Any quadrant
   label or seasoning line reading Jaadu now reads "DADI MASALA" / "Desi
   Masala". The purple quadrant and its swatch stay purple.

ANYWHERE ELSE
Search every artboard for "JAADU", "Jaadu", "MAGIC" and "magic". After this
pass there should be zero hits.

UNCHANGED
Hinglish copy, no em dashes, 3px ink outlines, no gradients, no soft shadows,
grain on every solid fill, no new colours, file names unchanged.

DELIVER
The same artboards, same names, same positions on the canvas. Check the
shelf test still holds: the DADI name card sits on the same baseline as
PATAKA, MALAI and PEHELWAN's.
```

---

## After the art lands (code, not design)

- `src/data/flavours.ts`: `name` → "Dadi Masala", `short` → "Dadi", new
  `line` (e.g. `"Andaaz se daala hai. Naapna mat."`), keywords add `dadi`,
  `दादी`. Keep `slug: 'jaadu-masala'` and `theme: 'jaadu'`, or rename both in
  one pass with the CSS tokens and asset paths.
- Comic-panel and speech-bubble copy that still uses Jaadu's voice.
- `hey-makhana-design-spec.md` §5 table and `mascot-art-brief.md` character 3.
