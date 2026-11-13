import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { maskStyle } from "./components/RakeMask";
import {
  BACKDROP,
  BANDS,
  beatAt,
  Crop,
  EXPOSURE,
  GROUND,
  GROUND_BAND,
  INK,
  PAPER,
  RAKE_FROM,
  RAKE_TO,
  RULE,
} from "./timeline";

export type Ground = "night" | "paper";

/**
 * A type alias rather than an interface, deliberately. Remotion's
 * <Composition> constrains its component to `Record<string, unknown>`, and an
 * interface has no implicit index signature to satisfy that — a type alias
 * does. Switching this back to `interface` breaks Root.tsx with an error that
 * does not mention index signatures at all.
 */
export type HeroLightRakeProps = {
  /** Pack front art, relative to public/. Any flavour works. */
  pack: string;
  /** Night is the one we ship; paper keeps the hero on the page's own ground. */
  ground: Ground;
  /**
   * Grain is deliberately NOT rendered into the file by default. It is
   * high-frequency noise and the single most expensive thing a codec can be
   * asked to carry — baking it in roughly triples the bitrate. Keep the site's
   * own <Grain> component layered over the <video> element instead.
   */
  grain: boolean;
};

/** Percent through the beat containing `frame`, 0 at its first frame, 1 at its last. */
function beatProgress(frame: number): number {
  const beat = beatAt(frame);
  const last = beat.durationInFrames - 1;
  if (last <= 0) return 0;
  return (frame - beat.from) / last;
}

function cropAt(frame: number): Crop {
  const beat = beatAt(frame);
  const t = beatProgress(frame);
  // Linear within a beat, always. Any ease here would read as a camera that
  // accelerates, and the whole point of this cut is a camera that does not.
  return {
    scale: beat.fromCrop.scale + (beat.toCrop.scale - beat.fromCrop.scale) * t,
    x: beat.fromCrop.x + (beat.toCrop.x - beat.fromCrop.x) * t,
    y: beat.fromCrop.y + (beat.toCrop.y - beat.fromCrop.y) * t,
  };
}

/** The light makes exactly one pass per beat. This is the only eased motion. */
function rakeAt(frame: number): number {
  const beat = beatAt(frame);
  return interpolate(beatProgress(frame), [0, 1], [RAKE_FROM, RAKE_TO], {
    easing: Easing.bezier(...beat.rakeEasing),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

const ArtLayer: React.FC<{ pack: string; filter: string; crop: Crop }> = ({
  pack,
  filter,
  crop,
}) => (
  <AbsoluteFill style={{ display: "grid", placeItems: "center" }}>
    <div
      style={{
        width: "62%",
        aspectRatio: "900 / 1260",
        backgroundImage: `url(${staticFile(pack)})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        border: `3px solid ${INK}`,
        transformOrigin: "50% 50%",
        transform: `scale(${crop.scale}) translate(${crop.x}%, ${crop.y}%)`,
        filter,
      }}
    />
  </AbsoluteFill>
);

export const HeroLightRake: React.FC<HeroLightRakeProps> = ({ pack, ground, grain }) => {
  const frame = useCurrentFrame();
  const crop = cropAt(frame);
  const rake = rakeAt(frame);
  const exposure = EXPOSURE[ground];

  // Beat 3 only. Draws in, holds, then clears before the loop point so that
  // the last frame matches frame 0 exactly.
  const ruleScale = interpolate(frame, [RULE.drawFrom, RULE.drawTo], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ruleOpacity =
    frame < RULE.drawFrom
      ? 0
      : interpolate(frame, [RULE.fadeFrom, RULE.fadeTo], [RULE.opacity, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill style={{ backgroundColor: BACKDROP[ground], overflow: "hidden" }}>
      {/* The ground catches the light too, one step only. */}
      <AbsoluteFill
        style={{
          backgroundColor: GROUND[ground],
          opacity: 0.7,
          ...maskStyle(GROUND_BAND, rake),
        }}
      />

      {/* Unlit base, then three raked copies at rising exposure. Every copy
          carries the identical crop, so they register exactly. */}
      <ArtLayer pack={pack} filter={exposure[0]} crop={crop} />
      {BANDS.map((band, i) => (
        <AbsoluteFill key={band.join("-")} style={maskStyle(band, rake)}>
          <ArtLayer pack={pack} filter={exposure[i + 1]} crop={crop} />
        </AbsoluteFill>
      ))}

      <div
        style={{
          position: "absolute",
          left: "26%",
          right: "26%",
          bottom: "9.5%",
          height: 3,
          backgroundColor: ground === "night" ? PAPER : INK,
          opacity: ruleOpacity,
          transform: `scaleX(${ruleScale})`,
          transformOrigin: "0 50%",
        }}
      />

      {grain ? <GrainOverlay /> : null}
    </AbsoluteFill>
  );
};

/** Only rendered when explicitly asked for. See the note on `grain` above. */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>` +
      `<feColorMatrix type='matrix' values='0 0 0 0 0.078  0 0 0 0 0.067  0 0 0 0 0.059  0 0 0 1 0'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

const GrainOverlay: React.FC = () => (
  <AbsoluteFill style={{ backgroundImage: `url("${NOISE}")`, opacity: 0.09 }} />
);
