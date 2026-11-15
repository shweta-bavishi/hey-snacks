import { BEATS, JAR_PARTICLES, MASALA_CLOUD, MIXED_BACK_FILL } from "@/data/jarStoryBeats";
import type { JarParticleSpot } from "@/data/jarStoryBeats";
import { coatedSpriteSrc, IngredientSprite } from "./ingredientSprites";
import styles from "./jar-story.module.css";

const BACK_FILL_BEATS = BEATS.filter((beat) => beat.backFill);

/** Intrinsic size of the baked fill layers in public/jar/fill/. */
const FILL_WIDTH = 480;
const FILL_HEIGHT = 633;

export type JarContentsState = "layered" | "mixed";

export interface JarContentsTargets {
  particle: (key: string, el: HTMLDivElement | null) => void;
  backFill: (beatId: string, el: HTMLImageElement | null) => void;
  mixedFill: (el: HTMLImageElement | null) => void;
  cloud: (el: HTMLImageElement | null) => void;
}

interface JarContentsProps {
  /**
   * "layered" is the pour: every beat in its own band, nothing coated, and
   * the stage animates it from there. "mixed" is the finished jar after the
   * shake, shuffled and fully coated, drawn with no movement at all: what the
   * static fallback shows, since the product is the mix, not the layers.
   */
  state: JarContentsState;
  /** The pinned stage passes these so GSAP can grab each layer; the fallback leaves them off. */
  bindTargets?: JarContentsTargets;
}

function placement(spot: JarParticleSpot, size: number): React.CSSProperties {
  // left/top place the sprite's *centre* on its settle point. On the stage
  // GSAP re-applies the -50% shift as xPercent/yPercent so it composes with
  // the pour and mix tweens instead of being overwritten by them; here the
  // same transform is written inline so the fallback lands the pieces in
  // exactly the same places. Width is a percentage of the field, so every
  // piece stays in proportion to the glass at any viewport width.
  return {
    left: `${spot.x}%`,
    top: `${spot.y}%`,
    width: `${size}%`,
    transform: `translate(-50%, -50%) rotate(${spot.rotation}deg) scale(${spot.scale})`,
  };
}

/**
 * Everything inside the glass, back to front:
 *
 * 1. Baked back layers: the dense, shaded body of the pile, one per pour band
 *    plus the post-shake mix. Darker than the front because less light gets
 *    that far into a full jar, and it is what keeps glass from showing
 *    between the pieces.
 * 2. One photographed piece per settle position, pressed against the glass.
 *    Each carries its masala-coated twin as a pseudo-element whose opacity
 *    is the `--coat` custom property, so coating costs no extra DOM nodes.
 * 3. The masala powder cloud (stage only; it is a moment, not a state).
 *
 * Shared by the stage and the static fallback so the two never drift apart.
 */
export function JarContents({ state, bindTargets }: JarContentsProps) {
  const mixed = state === "mixed";

  return (
    <div className={styles.particleField} aria-hidden="true">
      <div className={styles.backFill}>
        {BACK_FILL_BEATS.map((beat) => (
          <img
            key={beat.id}
            ref={bindTargets ? (el) => bindTargets.backFill(beat.id, el) : undefined}
            src={beat.backFill ?? undefined}
            alt=""
            width={FILL_WIDTH}
            height={FILL_HEIGHT}
            className={styles.backLayer}
            style={mixed ? { opacity: 0 } : undefined}
            decoding="async"
            draggable={false}
          />
        ))}
        <img
          ref={bindTargets ? (el) => bindTargets.mixedFill(el) : undefined}
          src={MIXED_BACK_FILL}
          alt=""
          width={FILL_WIDTH}
          height={FILL_HEIGHT}
          className={styles.backLayer}
          style={mixed ? undefined : { opacity: 0 }}
          decoding="async"
          draggable={false}
        />
      </div>

      <div className={styles.frontLayer}>
        {JAR_PARTICLES.map(({ key, beat, spot, mixed: mixedSpot }) => {
          // Masala flakes dissolve into the coating, so the mixed jar has none.
          if (mixed && !mixedSpot) return null;
          const coat = coatedSpriteSrc(spot.shape);
          return (
            <div
              key={key}
              ref={bindTargets ? (el) => bindTargets.particle(key, el) : undefined}
              className={styles.particle}
              style={{
                ...placement(mixed && mixedSpot ? mixedSpot : spot, beat.particleSize),
                ...(coat ? { "--coat-src": `url(${coat})` } : null),
                ...(mixed ? { "--coat": 1 } : null),
              } as React.CSSProperties}
            >
              <IngredientSprite kind={spot.shape} className={styles.particleArt} />
            </div>
          );
        })}
      </div>

      {bindTargets ? (
        <img
          ref={(el) => bindTargets.cloud(el)}
          src={MASALA_CLOUD}
          alt=""
          width={520}
          height={520}
          className={styles.masalaCloud}
          decoding="async"
          draggable={false}
        />
      ) : null}
    </div>
  );
}
