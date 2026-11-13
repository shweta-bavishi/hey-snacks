import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IngredientSpriteSheet } from "../src/components/jar-story/ingredientSprites";
import { buildMix, MixField } from "./components/MixField";
import { maskStyle } from "./components/RakeMask";
import { BACKDROP, BANDS, EXPOSURE, GROUND, GROUND_BAND, INK, RAKE_FROM, RAKE_TO } from "./timeline";
import "../src/styles/tokens.css";

export const MIX_SAMPLE_FRAMES = 180;
const OPEN_END = 90;

const PIECES = buildMix(7);

/**
 * Sample of the two new beats only: the pack opening and the mix suspending.
 * The existing type/wordmark beats are untouched until this is signed off.
 *
 * Note there is no data-night attribute anywhere in here. That is deliberate:
 * the ingredient colours are color-mix chains rooted in --paper and --ink, so
 * flipping to night would invert the makhana to near-black. Keeping day tokens
 * against an explicitly dark backdrop is what puts pale pieces on dark ground.
 */
export const MixSample: React.FC<{ pack: string }> = ({ pack }) => {
  const frame = useCurrentFrame();
  const open = frame < OPEN_END;
  const progress = open ? frame / (OPEN_END - 1) : (frame - OPEN_END) / (MIX_SAMPLE_FRAMES - OPEN_END - 1);

  const rake = interpolate(progress, [0, 1], [RAKE_FROM, RAKE_TO], {
    easing: Easing.bezier(0.4, 0, 0.5, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hard cut between beats, same as every other transition in this film.
  const packScale = open
    ? interpolate(progress, [0, 1], [1.02, 1.06])
    : interpolate(progress, [0, 1], [0.58, 0.61]);
  const exposure = EXPOSURE.night;

  const packLayer = (filter: string) => (
    <AbsoluteFill style={{ display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: "62%",
          aspectRatio: "900 / 1260",
          backgroundImage: `url(${staticFile(pack)})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          border: `3px solid ${INK}`,
          transform: `scale(${packScale}) translate(0%, ${open ? 45 : 4}%)`,
          filter,
        }}
      />
    </AbsoluteFill>
  );

  const mixLayer = (filter: string) => (
    <AbsoluteFill style={{ filter }}>
      <MixField
        pieces={PIECES}
        phase={open ? "burst" : "suspend"}
        progress={progress}
        scale={open ? 1 : 1.25}
      />
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BACKDROP.night, overflow: "hidden" }}>
      <IngredientSpriteSheet />

      <AbsoluteFill
        style={{ backgroundColor: GROUND.night, opacity: 0.7, ...maskStyle(GROUND_BAND, rake) }}
      />

      {packLayer(exposure[0])}
      {BANDS.map((band, i) => (
        <AbsoluteFill key={band.join("-")} style={maskStyle(band, rake)}>
          {packLayer(exposure[i + 1])}
        </AbsoluteFill>
      ))}

      {/* The mix sits above the pack so pieces read as having left it, and
          carries the same four exposures through the same bands. Without this
          the pieces are evenly lit and read as pasted onto the film rather
          than being in it. */}
      {mixLayer(exposure[0])}
      {BANDS.map((band, i) => (
        <AbsoluteFill key={`mix-${band.join("-")}`} style={maskStyle(band, rake)}>
          {mixLayer(exposure[i + 1])}
        </AbsoluteFill>
      ))}

      {!open ? (
        <div
          style={{
            position: "absolute",
            left: "26%",
            right: "26%",
            bottom: "9.5%",
            height: 3,
            backgroundColor: "#FFF8EE",
            opacity: 0.55,
            transform: `scaleX(${interpolate(progress, [0, 0.38], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateRight: "clamp",
            })})`,
            transformOrigin: "0 50%",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

