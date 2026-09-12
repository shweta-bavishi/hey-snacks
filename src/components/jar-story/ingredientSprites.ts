// One silhouette per ingredient so almonds don't read as cashews don't read
// as makhana. Each is delivered as a CSS `mask-image` rather than an <img>
// or inline <svg>, for two reasons:
//
//  1. DOM budget. A particle stays a single <div>. Inline SVG would cost
//     2-3 nodes each and blow the ~140-node cap from the spec.
//  2. Colour tokens. A data-URI <svg> can't read CSS custom properties, so
//     an <img> sprite would force a hardcoded hex. As a mask, the shape only
//     supplies alpha and the actual colour comes from `background-color`,
//     which stays a token. The `#000` below is a mask alpha channel, not a
//     design colour.

export type SpriteKind = "makhana" | "almond" | "cashew" | "peanut" | "seed" | "dust";

// All drawn in a 24x24 box, each a closed loop, none of them a plain circle
// except `dust` (which is meant to read as a soft speck of masala).
const SPRITE_PATHS: Record<SpriteKind, string> = {
  // Irregular popped-seed blob, same family as MakhanaPuff's outlines.
  makhana:
    "M12 2 C16 1.5 20 4 20.5 8.5 C21 12 19 14.5 20.5 17.5 C21.5 20 18.5 22.5 14 22 C11 21.5 10 23 6.5 21.5 C3 20 2 16.5 3.5 13.5 C1.5 11 2.5 6.5 5 4.5 C7.5 2 9 2.5 12 2 Z",
  // Pointed at the top, broad and rounded at the base.
  almond: "M12 1.5 C16.5 6 19 12 12 22.5 C5 12 7.5 6 12 1.5 Z",
  // Kidney curve with a concave inner edge.
  cashew:
    "M6.5 3.5 C13.5 1.5 20 7 18.5 14.5 C17 21 9.5 23 6.5 18.5 C10 17.5 13 14.5 13 11.5 C13 8.5 10 6 6.5 3.5 Z",
  // Two lobes with a pinched waist — the in-shell peanut silhouette.
  peanut:
    "M12 1.5 C16 1.5 18.5 4.5 17.5 7.5 C16.5 10 16.5 14 17.5 16.5 C18.5 19.5 16 22.5 12 22.5 C8 22.5 5.5 19.5 6.5 16.5 C7.5 14 7.5 10 6.5 7.5 C5.5 4.5 8 1.5 12 1.5 Z",
  // Broad teardrop, pumpkin-seed proportions. Rendered small so it reads as
  // "tiny but loud" next to the nuts.
  seed: "M12 2 C17 4 20 9 19 14 C18 19 15 22 12 22 C9 22 6 19 5 14 C4 9 7 4 12 2 Z",
  // Soft round speck — the masala cloud, not a solid piece.
  dust: "M12 3.5 C16.5 3.5 20.5 7.5 20.5 12 C20.5 16.5 16.5 20.5 12 20.5 C7.5 20.5 3.5 16.5 3.5 12 C3.5 7.5 7.5 3.5 12 3.5 Z",
};

function toMaskUrl(path: string) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>` +
    `<path d='${path}' fill='#000'/>` +
    `</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export const SPRITE_MASKS: Record<SpriteKind, string> = Object.fromEntries(
  Object.entries(SPRITE_PATHS).map(([kind, path]) => [kind, toMaskUrl(path)])
) as Record<SpriteKind, string>;
