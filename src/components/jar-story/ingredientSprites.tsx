// One real photograph per ingredient, cut out on a transparent background.
// Each file is cropped to the ingredient's own bounding box and padded to a
// square, so "fill the box" means the same thing for an almond and a seed and
// the per-beat `particleSize` in jarStoryBeats stays the only sizing knob.
//
// Several kinds have a second or third shot of the same ingredient (the
// `B` / `C` suffix). A beat cycles through them, which is what stops a jar of
// twenty makhana reading as one photo pasted twenty times.

export type SpriteKind =
  | "makhana"
  | "makhanaB"
  | "makhanaC"
  | "almond"
  | "almondB"
  | "cashew"
  | "cashewB"
  | "peanut"
  | "seed"
  | "seedStripe"
  | "dust";

/** Intrinsic pixel size of every sprite file. Written to width/height so the layout never shifts. */
export const SPRITE_PX = 288;

const SPRITE_SRC: Record<SpriteKind, string> = {
  makhana: "/jar/makhana-1.webp",
  makhanaB: "/jar/makhana-2.webp",
  makhanaC: "/jar/makhana-3.webp",
  almond: "/jar/almond-1.webp",
  almondB: "/jar/almond-2.webp",
  cashew: "/jar/cashew-1.webp",
  cashewB: "/jar/cashew-2.webp",
  peanut: "/jar/peanut.webp",
  seed: "/jar/seed-pumpkin.webp",
  seedStripe: "/jar/seed-sunflower.webp",
  dust: "/jar/masala.webp",
};

// The same photographs after the shake, dusted in masala: an orange cast
// multiplied into the photo's own shading, heavier in the creases, plus
// chilli flakes and grains. Baked by scripts/build-jar-assets.py so the
// browser crossfades two images instead of compositing a mask and a blend
// mode on every piece every frame. Masala itself has no coated version.
const COATED_SRC: Partial<Record<SpriteKind, string>> = {
  makhana: "/jar/coated/makhana-1.webp",
  makhanaB: "/jar/coated/makhana-2.webp",
  makhanaC: "/jar/coated/makhana-3.webp",
  almond: "/jar/coated/almond-1.webp",
  almondB: "/jar/coated/almond-2.webp",
  cashew: "/jar/coated/cashew-1.webp",
  cashewB: "/jar/coated/cashew-2.webp",
  peanut: "/jar/coated/peanut.webp",
  seed: "/jar/coated/seed-pumpkin.webp",
  seedStripe: "/jar/coated/seed-sunflower.webp",
};

/** The masala-coated photo of a sprite, or null for kinds that never get coated. */
export function coatedSpriteSrc(kind: SpriteKind): string | null {
  return COATED_SRC[kind] ?? null;
}

interface IngredientSpriteProps {
  kind: SpriteKind;
  /** Rendered width/height in px. Omit to fill the parent box instead. */
  size?: number;
  /** Flip horizontally. Only the Remotion compositions use it; the jar does not, since a flipped photo flips its lighting. */
  mirror?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** One photographed ingredient. */
export function IngredientSprite({ kind, size, mirror, className, style }: IngredientSpriteProps) {
  return (
    <img
      src={SPRITE_SRC[kind]}
      alt=""
      width={size ?? SPRITE_PX}
      height={size ?? SPRITE_PX}
      className={className}
      style={mirror ? { ...style, transform: [style?.transform, "scaleX(-1)"].filter(Boolean).join(" ") } : style}
      decoding="async"
      draggable={false}
    />
  );
}

/**
 * Kept so the Remotion compositions, which used to mount the old SVG artwork
 * sheet, still compile. Photographs need no shared sheet, so it renders nothing.
 */
export function IngredientSpriteSheet() {
  return null;
}
