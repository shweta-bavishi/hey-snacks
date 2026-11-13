import { BEATS } from "@/data/jarStoryBeats";
import { IngredientSprite } from "./ingredientSprites";
import styles from "./jar-story.module.css";

const PARTICLES = BEATS.flatMap((beat) =>
  beat.settlePositions.map((spot, i) => ({ key: `${beat.id}-${i}`, beat, spot }))
);

export const JAR_PARTICLES = PARTICLES;

interface JarContentsProps {
  /**
   * The pinned stage passes this so GSAP can grab each sprite and animate it
   * in; the static fallback leaves it off and the pieces just sit where the
   * inline transform puts them.
   */
  registerRef?: (key: string, el: HTMLDivElement | null) => void;
}

/**
 * Everything inside the glass: one drawn sprite per pre-computed settle
 * position, laid out as a percentage of the jar's interior.
 *
 * Shared by the stage and the static fallback deliberately. The fallback used
 * to draw an empty tinted jar next to six ingredient cards, which read as a
 * jar nobody had filled — the reduced-motion path is supposed to be the same
 * story told without movement, not a thinner one.
 */
export function JarContents({ registerRef }: JarContentsProps) {
  return (
    <div className={styles.particleField} aria-hidden="true">
      {PARTICLES.map(({ key, beat, spot }) => (
        <div
          key={key}
          ref={registerRef ? (el) => registerRef(key, el) : undefined}
          className={styles.particle}
          // left/top place the sprite's *centre* on its settle point. On the
          // stage GSAP re-applies the -50% shift as xPercent/yPercent so it
          // composes with the drop-in tween instead of being overwritten by
          // it; here the same transform is written inline so the static
          // fallback lands the pieces in exactly the same places. Width is a
          // percentage of the field, so every piece stays in proportion to
          // the glass at any viewport width.
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: `${beat.particleSize}%`,
            transform: `translate(-50%, -50%) rotate(${spot.rotation}deg) scale(${spot.scale})`,
          }}
        >
          <IngredientSprite kind={spot.shape} mirror={spot.mirror} className={styles.particleArt} />
        </div>
      ))}
    </div>
  );
}
