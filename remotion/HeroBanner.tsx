import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadRozha } from "@remotion/google-fonts/RozhaOne";
import { loadFont as loadHind } from "@remotion/google-fonts/Hind";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import {
  IngredientSprite,
  IngredientSpriteSheet,
  SpriteKind,
} from "../src/components/jar-story/ingredientSprites";
import "../src/styles/tokens.css";

const { fontFamily: DISPLAY } = loadRozha();
const { fontFamily: BODY } = loadHind();
const { fontFamily: MONO } = loadMono();

const INK = "#14110F";
const PAPER = "#FFF8EE";
const PATAKA = "#EF3E2F";
const PATAKA_SH = "#8C1A12";
const MARIGOLD = "#FF9F1C";
const RANI = "#FF2E88";

export type BannerGround = "night" | "paper";

export type HeroBannerProps = {
  ground: BannerGround;
  pack: string;
};

/**
 * A star drawn as an explicit polygon rather than a rotated-square trick, so
 * the point count and the inner radius are both tunable. Three of these nest
 * to make the burst: flat fills at hard steps, never a gradient.
 */
function starPoints(cx: number, cy: number, outer: number, inner: number, points: number, rot = 0) {
  const step = Math.PI / points;
  const out: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2 + rot;
    out.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return out.join(" ");
}

/**
 * Ingredients ringed around the pack. Hand-placed rather than generated: a
 * banner is one frame that will be looked at for a long time, so the few
 * seconds saved by a scatter function are not worth the arrangement being
 * slightly wrong forever.
 */
const GARNISH: { kind: SpriteKind; x: number; y: number; size: number; rot: number }[] = [
  { kind: "makhana", x: 57.5, y: 17, size: 150, rot: -18 },
  { kind: "almond", x: 66.5, y: 87, size: 118, rot: 34 },
  { kind: "cashew", x: 93.5, y: 24, size: 128, rot: -14 },
  { kind: "makhana", x: 95, y: 63, size: 142, rot: 40 },
  { kind: "peanut", x: 79, y: 92, size: 112, rot: -26 },
  { kind: "peanut", x: 71, y: 11, size: 104, rot: 22 },
  { kind: "seed", x: 88.5, y: 85, size: 76, rot: 16 },
  { kind: "cashew", x: 55.5, y: 55, size: 96, rot: 58 },
  { kind: "seedStripe", x: 61, y: 74, size: 70, rot: -30 },
];

const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>` +
      `<feColorMatrix type='matrix' values='0 0 0 0 0.078  0 0 0 0 0.067  0 0 0 0 0.059  0 0 0 1 0'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

export const HeroBanner: React.FC<HeroBannerProps> = ({ ground, pack }) => {
  const night = ground === "night";
  const bg = night ? INK : PAPER;
  const fg = night ? PAPER : INK;
  // On paper the burst carries the page; on ink it has to stay darker than the
  // pack or the pack stops being the brightest thing in the frame.
  // Wide steps, not near-neighbours. Three reds a few percent apart read as a
  // muddy gradient at a glance, which is exactly what the spec forbids — the
  // posterisation has to be legible as steps or it is not worth having.
  const burst = night ? ["#5E1009", "#A81F16", PATAKA] : [PATAKA, "#F97A63", "#FFC2A8"];

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <svg viewBox="0 0 2400 1000" style={{ position: "absolute", inset: 0 }}>
        {/* Nine broad points, not twelve thin ones. The pack carries its own
            starburst, and a spikier shape behind it reads as a second, louder
            burst competing with the first rather than as a ground for it. */}
        <polygon points={starPoints(1738, 500, 636, 410, 9, 0.1)} fill={burst[0]} />
        <polygon points={starPoints(1738, 500, 518, 338, 9, 0.1)} fill={burst[1]} />
        <polygon points={starPoints(1738, 500, 402, 268, 9, 0.1)} fill={burst[2]} />
      </svg>

      <IngredientSpriteSheet />

      {GARNISH.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${g.x}%`,
            top: `${g.y}%`,
            transform: `translate(-50%, -50%) rotate(${g.rot}deg)`,
          }}
        >
          <IngredientSprite kind={g.kind} size={g.size} mirror={i % 3 === 0} />
        </div>
      ))}

      <Img
        src={staticFile(pack)}
        style={{
          position: "absolute",
          left: "72.4%",
          top: "50%",
          height: 726,
          transform: "translate(-50%, -50%)",
          border: `3px solid ${INK}`,
          boxShadow: `14px 14px 0 ${night ? "#000" : PATAKA_SH}`,
        }}
      />

      <div style={{ position: "absolute", left: 132, top: 205, width: 1080, color: fg }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: MONO,
            fontSize: 21,
            letterSpacing: "0.07em",
            padding: "12px 26px",
            border: `3px solid ${fg}`,
            borderRadius: 999,
            marginBottom: 40,
          }}
        >
          CHOLESTEROL-FREE ✱ GLUTEN-FREE ✱ ROASTED, NOT FRIED
        </div>

        <p style={{ fontFamily: BODY, fontSize: 33, margin: "0 0 18px", opacity: 0.9 }}>
          Roasted right, snacked light.
        </p>

        <h1
          style={{
            fontFamily: DISPLAY,
            fontSize: 208,
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            margin: 0,
            textShadow: `5px 5px 0 ${RANI}`,
          }}
        >
          PATAKA
          <br />
          PERI PERI
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 46 }}>
          <div style={{ display: "flex", gap: 7 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  border: `3px solid ${fg}`,
                  backgroundColor: i < 4 ? MARIGOLD : "transparent",
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: MONO, fontSize: 21, letterSpacing: "0.06em" }}>HEAT 4 / 5</span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 25,
              opacity: 0.55,
              textDecoration: "line-through",
              marginLeft: 16,
            }}
          >
            ₹129
          </span>
          <span style={{ fontFamily: DISPLAY, fontSize: 52, color: night ? MARIGOLD : PATAKA }}>
            ₹99
          </span>
        </div>
      </div>

      <AbsoluteFill
        style={{ backgroundImage: `url("${NOISE}")`, opacity: 0.045, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
