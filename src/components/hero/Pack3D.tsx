"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Flavour } from "@/data/flavours";
import styles from "./pack3d.module.css";

export interface Pack3DProps {
  /** 900×1260 front-panel art (see docs/packaging-design-plan.md). */
  front: string;
  /** 900×1260 back-panel art. */
  back: string;
  /**
   * Flavour palette the crimp seals and the turning-away shade are drawn in
   * (`--{theme}-sh`, the flavour's deep shade). The panel art carries its
   * own colours; this only feeds the parts of the pouch Pack3D draws itself.
   */
  theme: Flavour["theme"];
  alt: string;
  className?: string;
}

// ---- Pouch geometry (docs/packaging-pouch-prompt.md) ----
// The 900×1260 panel art is the whole bag: its own crimp bands, serrated
// edges and cream margin are already drawn in. Pack3D adds no seals of its
// own, or the pouch ends up as a pouch inside a pouch.
const ART_ASPECT = 900 / 1260;
/** Stage width ÷ height, for the CSS aspect-ratio. Kept in sync with pack3d.module.css. */
export const POUCH_ASPECT = ART_ASPECT;
// How far each face puffs out at its fullest, as a share of the bag width.
const PUFF_DEPTH = 0.13;
// How far the long sides bow outward at the middle, as a share of the width.
const SIDE_BOW = 0.035;
// Share of the body height, from each seal, over which the film pinches flat.
const PINCH_ZONE = 0.22;
// The surface is a mesh of flat tiles. Columns carry the side-to-side curve;
// rows are packed tight inside the two pinch zones and a single tall row
// covers the middle, where the bag's profile doesn't change top to bottom.
const COLUMNS = 16;
const ROW_STOPS = [0, 0.025, 0.06, 0.1, 0.15, PINCH_ZONE, 1 - PINCH_ZONE, 0.85, 0.9, 0.94, 0.975, 1];
// Each tile overdraws its neighbours by this many px so the mesh has no
// hairline cracks where two slightly-angled tiles meet.
const TILE_BLEED = 1;
const FILM_ART = "/packs/pouch/film.svg";

type Vec3 = [number, number, number];

const sub = (p: Vec3, q: Vec3): Vec3 => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const add = (p: Vec3, q: Vec3): Vec3 => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
const scale = (p: Vec3, k: number): Vec3 => [p[0] * k, p[1] * k, p[2] * k];
const cross = (p: Vec3, q: Vec3): Vec3 => [
  p[1] * q[2] - p[2] * q[1],
  p[2] * q[0] - p[0] * q[2],
  p[0] * q[1] - p[1] * q[0],
];
const normalize = (p: Vec3): Vec3 => scale(p, 1 / Math.hypot(p[0], p[1], p[2]));

/** 0 at a seal, easing up to 1 once clear of the pinch zone. */
function pinch(t: number) {
  return Math.sin((Math.PI / 2) * Math.min(1, Math.min(t, 1 - t) / PINCH_ZONE));
}

/** Pillow cross-section: full depth in the middle, 0 at the side folds. */
function puff(x: number) {
  const u = x * 2 - 1;
  return Math.pow(Math.max(0, 1 - u * u), 0.55);
}

interface PouchSize {
  width: number;
  bodyHeight: number;
}

interface Tile {
  key: string;
  src: string;
  width: number;
  height: number;
  bgX: number;
  bgY: number;
  matrix: string;
  yaw: number;
}

/**
 * Builds one face of the pouch as a tile mesh. `x`/`t` are positions in the
 * flat panel art (0–1 across, 0–1 down the body); each tile is the flat art
 * slice under it, mapped by matrix3d onto the curved surface. The back face
 * mirrors x and pushes z the other way, so both faces meet exactly at the
 * side folds (z = 0) and at the seals.
 */
function buildFace(size: PouchSize, src: string, side: 1 | -1): Tile[] {
  const { width: W, bodyHeight: H } = size;
  const depth = W * PUFF_DEPTH;
  const point = (x: number, t: number): Vec3 => {
    const p = pinch(t);
    return [
      W / 2 + side * (x - 0.5) * W * (1 + SIDE_BOW * p),
      t * H,
      side * depth * puff(x) * p,
    ];
  };

  const tiles: Tile[] = [];
  for (let r = 0; r < ROW_STOPS.length - 1; r++) {
    const t0 = ROW_STOPS[r];
    const t1 = ROW_STOPS[r + 1];
    for (let c = 0; c < COLUMNS; c++) {
      const x0 = c / COLUMNS;
      const x1 = (c + 1) / COLUMNS;
      const tw = W / COLUMNS;
      const th = (t1 - t0) * H;
      const p00 = point(x0, t0);
      const p10 = point(x1, t0);
      const p01 = point(x0, t1);
      const p11 = point(x1, t1);
      // Best-fit parallelogram through the four corners: average the two
      // opposite edges for each axis, centred on the corners' mean.
      const a = scale(add(sub(p10, p00), sub(p11, p01)), 1 / (2 * tw));
      const b = scale(add(sub(p01, p00), sub(p11, p10)), 1 / (2 * th));
      const n = normalize(cross(a, b));
      const centre = scale(add(add(p00, p10), add(p01, p11)), 0.25);
      const origin = sub(centre, add(scale(a, tw / 2 + TILE_BLEED), scale(b, th / 2 + TILE_BLEED)));
      tiles.push({
        key: `${side}-${r}-${c}`,
        src,
        width: tw + TILE_BLEED * 2,
        height: th + TILE_BLEED * 2,
        bgX: -(x0 * W - TILE_BLEED),
        bgY: -(t0 * H - TILE_BLEED),
        matrix: `matrix3d(${[...a, 0, ...b, 0, ...n, 0, ...origin, 1].map((v) => +v.toFixed(5)).join(",")})`,
        yaw: (Math.atan2(n[0], n[2]) * 180) / Math.PI,
      });
    }
  }
  return tiles;
}

// Ambient spin speed. A full turn in ~15s reads as "the product is idly
// rotating," not "look at me" — the spec's one hero animation per section
// budget doesn't buy a fidget-spinner.
const AUTO_ROTATE_DEG_PER_SEC = 360 / 15;
const KEY_STEP_DEG = 10;
const DRAG_DEG_PER_PX = 0.5;
const WHEEL_DEG_PER_PX = 0.4;
// How long after a drag/wheel/keyboard nudge before ambient rotation takes
// the wheel back. Long enough that a deliberate flick doesn't immediately
// get overridden; short enough that the pack doesn't just sit dead.
const RESUME_AUTO_ROTATE_MS = 1600;

/**
 * A real rotating chips pouch, not a rescue crop of one photo. The front and
 * back panel art is mapped onto two puffed pillow surfaces (a tile mesh,
 * each tile a flat slice of the art placed with matrix3d) that meet at the
 * side folds and pinch flat into crimped, serrated seals top and bottom, per
 * docs/packaging-pouch-prompt.md. A pillow pouch has no flat side face, so
 * mid-turn you see the bag's lens-shaped profile, not a carton spine.
 *
 * Light stays screenprint-flat: each tile's shade steps between a few hard
 * levels of the flavour's deep shade as it turns away from a fixed light
 * (pure CSS, off the same --pack-rotation), never a gradient. The 3px ink
 * outline is the silhouette itself, traced by zero-blur drop-shadows on
 * .wrap, so it follows the bag's outline at every angle.
 *
 * Rotation is driven by directly mutating a CSS custom property
 * (`--pack-rotation`) inside a rAF loop rather than React state — the same
 * pattern Hero's own puff-drift effect already uses, and for the same
 * reason: a value that changes every frame has no business going through
 * setState.
 *
 * `data-pack-stage` / `data-pack-cube` carry no styling — they're hooks
 * for scripts/capture-pack-3d.mjs (see docs/hero-360-plan.md §6), which
 * drives this exact component in a real browser to export the 360 video
 * and a discrete frame sequence. Since rotation never touches React
 * state, the script can safely override `--pack-rotation` on the cube
 * from outside React without fighting a re-render.
 */
export function Pack3D({ front, back, theme, alt, className }: Pack3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  // Timestamp (performance.now()) before which ambient auto-rotate stays
  // paused — pushed forward by every drag/wheel/keyboard nudge. A ref, not
  // state: read every animation frame, never needs to trigger a render.
  const resumeAtRef = useRef(0);
  const dragStartRef = useRef<{ x: number; rotation: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    setReducedMotion(motionQuery.matches);
    setCoarsePointer(pointerQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const onPointerChange = (e: MediaQueryListEvent) => setCoarsePointer(e.matches);
    motionQuery.addEventListener("change", onMotionChange);
    pointerQuery.addEventListener("change", onPointerChange);
    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      pointerQuery.removeEventListener("change", onPointerChange);
    };
  }, []);

  // The mesh is built in real px from the stage's rendered size (it's
  // `height: 52vh`, not a fixed box), so every tile lands exactly on the
  // curve at whatever size is on screen, not the 300px design reference.
  // Height drives everything: the seals and body share it, and the width
  // follows from the panel art's aspect.
  const [size, setSize] = useState<PouchSize | null>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const sync = () => {
      const h = stage.clientHeight;
      if (!h) return;
      const next = { width: h * ART_ASPECT, bodyHeight: h };
      setSize((prev) =>
        prev && Math.abs(prev.width - next.width) < 0.5 && Math.abs(prev.bodyHeight - next.bodyHeight) < 0.5
          ? prev
          : next
      );
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const tiles = useMemo(
    () => (size ? [...buildFace(size, front, 1), ...buildFace(size, back, -1)] : []),
    [size, front, back]
  );

  // Refs only — stable across renders, so effects that use it can list it
  // as a dependency honestly instead of suppressing the lint rule.
  const applyRotation = useCallback((deg: number) => {
    rotationRef.current = deg;
    cubeRef.current?.style.setProperty("--pack-rotation", `${deg}deg`);
  }, []);

  const pauseAutoRotate = useCallback(() => {
    resumeAtRef.current = performance.now() + RESUME_AUTO_ROTATE_MS;
  }, []);

  // Ambient auto-rotate. Paused while dragging, and for a short window
  // after any manual nudge (drag release, wheel, keyboard) so a deliberate
  // interaction doesn't get immediately overwritten.
  useEffect(() => {
    if (reducedMotion || dragging) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (now >= resumeAtRef.current) {
        applyRotation(rotationRef.current + AUTO_ROTATE_DEG_PER_SEC * dt);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, dragging, applyRotation]);

  // Drag-to-spin. Skipped entirely on coarse (touch) pointers — a vertical
  // swipe over the pack needs to scroll the page, not fight it for the
  // gesture, matching "mobile: auto-rotate only" from the design spec.
  const handlePointerDown = (e: React.PointerEvent) => {
    if (coarsePointer) return;
    dragStartRef.current = { x: e.clientX, rotation: rotationRef.current };
    setDragging(true);
    pauseAutoRotate();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const start = dragStartRef.current;
    if (!start) return;
    const deltaX = e.clientX - start.x;
    applyRotation(start.rotation + deltaX * DRAG_DEG_PER_PX);
  };

  const endDrag = () => {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    setDragging(false);
    pauseAutoRotate();
  };

  // Wheel-over-pack scrubs rotation instead of scrolling the page — but
  // only while the pointer is directly over the stage, and never on touch
  // (there's no wheel there) or under reduced motion (this is a continuous,
  // ambient-feeling interaction, gated the same as auto-rotate).
  //
  // Attached by hand with `{ passive: false }`, not via React's `onWheel`
  // prop — React delegates wheel listeners at the root as passive for
  // scroll performance, which silently defeats `preventDefault()` (a
  // console warning in dev, a no-op in prod). A real DOM listener is the
  // only way `preventDefault` here actually stops the page scrolling.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      if (reducedMotion || coarsePointer) return;
      e.preventDefault();
      applyRotation(rotationRef.current + e.deltaY * WHEEL_DEG_PER_PX);
      pauseAutoRotate();
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [reducedMotion, coarsePointer, applyRotation, pauseAutoRotate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      applyRotation(rotationRef.current - KEY_STEP_DEG);
      pauseAutoRotate();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      applyRotation(rotationRef.current + KEY_STEP_DEG);
      pauseAutoRotate();
    } else if (e.key === "Home") {
      e.preventDefault();
      applyRotation(0);
      pauseAutoRotate();
    }
  };

  const ariaLabel = useMemo(
    () => `${alt}. Rotating 3D preview — drag, or use arrow keys, to spin.`,
    [alt]
  );

  return (
    <div
      ref={stageRef}
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      data-pack-stage
      style={{ "--pouch-tone-sh": `var(--${theme}-sh)` } as CSSProperties}
      data-dragging={dragging || undefined}
      data-draggable={!coarsePointer || undefined}
      role="img"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.stage} style={size ? { perspective: size.bodyHeight * 3 } : undefined}>
        <div
          ref={cubeRef}
          className={styles.cube}
          data-pack-cube
          style={size ? { width: size.width, height: size.bodyHeight } : undefined}
        >
          {size && (
            <>
              {tiles.map((tile) => (
                <div
                  key={tile.key}
                  className={styles.tile}
                  style={
                    {
                      width: tile.width,
                      height: tile.height,
                      transform: tile.matrix,
                      backgroundImage: `url(${FILM_ART}), url(${tile.src})`,
                      backgroundSize: `${size.width}px ${size.bodyHeight}px`,
                      backgroundPosition: `${tile.bgX}px ${tile.bgY}px`,
                      "--tile-yaw": `${tile.yaw}deg`,
                    } as CSSProperties
                  }
                >
                  <span className={styles.shade} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
