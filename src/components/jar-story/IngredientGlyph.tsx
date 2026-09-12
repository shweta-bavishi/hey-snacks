import { SPRITE_MASKS, type SpriteKind } from "./ingredientSprites";
import styles from "./jar-story.module.css";

interface IngredientGlyphProps {
  kind: SpriteKind;
  size?: number;
  /** Token to tint the silhouette with, e.g. "var(--malai)". */
  color: string;
  className?: string;
}

/**
 * A single ingredient silhouette at card size. Same masked-sprite technique
 * as the scroll-stage particles, so an almond in the static fallback is the
 * same shape as the almonds that pour into the jar.
 */
export function IngredientGlyph({ kind, size = 40, color, className }: IngredientGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.glyph, className].filter(Boolean).join(" ")}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        maskImage: SPRITE_MASKS[kind],
        WebkitMaskImage: SPRITE_MASKS[kind],
      }}
    />
  );
}
