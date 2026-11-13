import React from "react";
import { Composition } from "remotion";
import { HeroLightRake, HeroLightRakeProps } from "./HeroLightRake";
import { HeroBanner } from "./HeroBanner";
import { MixSample, MIX_SAMPLE_FRAMES } from "./MixSample";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./timeline";

const defaults: HeroLightRakeProps = {
  pack: "packs/pataka-peri-peri.svg",
  ground: "night",
  grain: false,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HeroLightRake"
      component={HeroLightRake}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaults}
    />
    {/* Same film on the page's own paper ground. Calmer, and the rake reads
        as saturation washing in rather than light arriving. */}
    <Composition
      id="HeroLightRakePaper"
      component={HeroLightRake}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ ...defaults, ground: "paper" }}
    />
    {/* Sample of the two proposed new beats, pending sign-off. */}
    <Composition
      id="MixSample"
      component={MixSample}
      durationInFrames={MIX_SAMPLE_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ pack: defaults.pack }}
    />
    {/* Stills. One frame each — these are rendered with `remotion still`. */}
    <Composition
      id="HeroBanner"
      component={HeroBanner}
      durationInFrames={1}
      fps={FPS}
      width={2400}
      height={1000}
      defaultProps={{ ground: "night" as const, pack: defaults.pack }}
    />
    <Composition
      id="HeroBannerPaper"
      component={HeroBanner}
      durationInFrames={1}
      fps={FPS}
      width={2400}
      height={1000}
      defaultProps={{ ground: "paper" as const, pack: defaults.pack }}
    />
  </>
);
