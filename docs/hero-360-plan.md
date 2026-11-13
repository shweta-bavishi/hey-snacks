# How the 360° pack rotation gets built

**Status:** done, including §6 — a real 360° video and a 36-frame sequence, both captured by code from the live `Pack3D` component. No photographer, no external render pipeline, no Claude Design pass needed for this part; the pack art already existed, all that was missing was a way to record it.
**Relates to:** [`hey-makhana-design-spec.md`](./hey-makhana-design-spec.md) §03 · [`landing-page-plan.md`](./landing-page-plan.md) §1.3 · [`packaging-design-plan.md`](./packaging-design-plan.md)
**Touches:** `src/components/hero/Pack360.tsx`, a new `Pack3D.tsx`, `public/packs/side/`

---

## 1. What exists today

[`Pack360.tsx`](../src/components/hero/Pack360.tsx) is built, but only half of it: it can cycle through an array of image URLs on a timer (auto-rotate) and freezes on frame 0 under reduced motion. With no `frames` supplied — the case today — it renders one static image and hides every rotation affordance rather than faking a spin. It does **not** yet do scroll-scrub, drag-to-spin, or keyboard stepping; those are in the spec (§03) but not built, because there's never been frame data to scrub through.

So "how does 360 get created" is really two separate questions: **where do the rotation frames come from**, and **is a photographed/rendered image sequence even the right mechanism for this project right now**. The spec itself already answered the second one (§14, locked): *"Until [the pack] exists, the hero uses a CSS-3D box built from the real design tokens... which is also a perfectly good production fallback."* That fallback was never built either — Pack360 shipped as a flat 2D placeholder instead. This plan is about building it.

---

## 2. Two real paths — pick based on what exists today, not what's ideal eventually

### Path A — CSS 3D box (recommended now)

An actual rotating cube in the DOM: six faces, `transform-style: preserve-3d`, each face showing one of the flat pack panel artworks already designed. One `rotateY` value, driven by scroll/drag/an idle timer, spins the whole thing. No photography, no rendering software, no export pipeline — it's built straight from the SVGs that already exist.

**Why this is the right call today:** the product hasn't been printed yet. There's no physical box to photograph, and a 3D-rendered mockup needs the same six faces of art a CSS box needs anyway. This path also matches what the spec already locked in as the intended fallback — it isn't a workaround, it's the plan.

**What it needs that doesn't exist yet:** front and back panels are designed (pending the fix-pass in `packaging-back-panel-plan.md`). **The two side panels are not** — they were deliberately deferred in `packaging-design-plan.md` §5 as "low priority, build only when a real 360° sequence... is scheduled." That sequence is being scheduled now, so they're no longer deferrable — a box rotating on its vertical axis shows front → side → back → other side → front, and without side art, half of every rotation is a blank or repeated face.

Top and bottom stay out of scope — they're essentially never visible on a horizontal spin and the original plan correctly called them functional-only.

### Path B — a real rendered or photographed frame sequence (later)

The spec's original vision: 36 WebP frames, 10° apart, ~120–180KB each, first 6 preloaded. This is the higher-fidelity path, but it needs either a 3D render (the six panel artworks wrapped onto a modelled carton in something like Blender, lit, and turntable-rendered at 10° steps) or actual product photography on a turntable rig once real boxes exist. Both are outside what Claude Design does — it's a 2D/HTML canvas tool, not a 3D renderer or a camera. This is real production work for later, not something to build against a product that hasn't been printed.

**Recommendation:** build Path A now — it's genuinely production-quality, not a placeholder, and it's buildable today. Revisit Path B once there's a print run to photograph or a reason to invest in a 3D render pipeline. `Pack360`'s `frames?: string[]` prop stays exactly as-is for that day; Path A doesn't touch or block it.

---

## 3. Side panels — the one blocking gap

Same shared-template discipline as the front and back: eyebrow and wordmark zones are **not** repeated here (a side panel is narrow — a spine, not a face — so it doesn't have room for the full block), just the minimum a real carton spine carries.

```
┌────────┐
│  hey.  │   ← small wordmark lockup, vertical
│   ✱    │
│        │
│ [flavour│  ← flavour name, rotated 90°, reads
│  name   │    top-to-bottom along the spine
│  rot 90°]
│        │
│  60g   │   ← net weight
│ ▮▮▮▮▮▮ │   ← barcode placeholder
└────────┘
```

Space Mono only, no illustration, no mascot — this face is functional, the same register as a real spine. Flavour primary background, 3px ink border, matching that flavour's palette. Two side artboards per SKU is overkill for a spine that's nearly symmetric left-to-right; one design per flavour, mirrored, is enough — a real box's two sides usually carry the same information anyway.

---

## 4. Claude Design prompt — five side panels

```
Design the side-panel artwork for the same five "hey." makhana cartons as
the front and back panels already on this canvas (four flavours plus a
variety box). This is the narrow spine of the box -- what shows during a
360-degree rotation between the front and back faces, and the one panel
that's mostly type, not illustration.

CANVAS
Each artboard is 300x1260 -- much narrower than the front/back panels
(900x1260), matching a real carton's spine width relative to its face.
Opaque, 3px ink outline as the full border, flavour-primary background,
same palette as that flavour's front panel. No new colours.

CONTENT, top to bottom, all centred:
1. A small "hey." wordmark lockup near the top -- Rozha-style serif,
   modest size (this is a spine, not a cover), with the same full-stop dot
   in the flavour's colour used on the front panel.
2. The flavour's short name, rotated 90 degrees so it reads bottom-to-top
   along the spine (like a book's spine text), Modak/chunky display face,
   ink text on the flavour background.
3. Net weight -- "60g" (or "240g" on the variety box), Space Mono, small.
4. A barcode placeholder -- a simple series of vertical ink bars of
   varying width, no real barcode data, purely a placeholder graphic.

RULES CARRIED OVER
Same 3px ink outline, same halftone-dot-only shading (this panel likely
needs none -- it's mostly flat colour and type), same grain overlay as
every other panel in this set. No mascot, no backdrop device -- this is
the plainest, most functional panel in the whole packaging system.

Jaadu's artboard keeps his flavour's own purple background -- the marigold
seal recolour from his front/back panels doesn't apply here, there's no
seal on this panel.

DELIVER
Five artboards, each 300x1260, positioned in their own row below the front
and back rows already on this canvas, named and labelled:
  side/pataka-peri-peri
  side/malai-mood
  side/jaadu-masala
  side/pudina-pehelwan
  side/variety-pack
```

---

## 5. Building `Pack3D` — implementation plan, not a design prompt

Once side art exists, this is a code task:

1. **New component** `src/components/hero/Pack3D.tsx` — six absolutely-positioned faces inside a `perspective` container, `transform-style: preserve-3d`. Front and back use the existing 900×1260 art; left/right use the new 300×1260 side art rotated into place with `rotateY(90deg) translateZ(...)`; top/bottom are flat `--paper-2` fills (spec's original call, still right — no one needs to see branded art on a lid mid-spin).
2. **One rotation value** — a single CSS custom property (`--pack-rotation`) drives the whole cube via `transform: rotateY(var(--pack-rotation))` on the container. Idle auto-rotation, scroll-scrub and drag all just become different things that *set* this one property — the mechanism `Pack360` already has for cycling frame URLs on a timer becomes cycling a rotation angle instead.
3. **Reduced motion** — freezes at `0deg` (the front face), same contract `Pack360` already honours. Drag stays available even under reduced motion, matching what the spec asked for and what `Pack360`'s doc comment already promises for the eventual frame-based version.
4. **Where it plugs in** — `Hero.tsx` swaps `<Pack360 staticSrc={...} />` for `<Pack3D front={...} back={...} sides={...} />`. `Pack360` itself doesn't get deleted; it stays as the mechanism for the day a real 36-frame sequence exists (Path B), and the two can coexist behind a single prop choice in `Hero.tsx`.

This part isn't a Claude Design prompt because there's nothing left to design — it's assembling art that will already exist into a working rotation. Say the word once the side panels are back from Claude Design and this gets built.

---

## 6. Exporting it as a real video — by code, not a photographer

Once `Pack3D` exists, it's a *working* rotation already running in a real browser — the only thing missing for a video file is a way to record that browser. No photographer, no Blender, no Claude Design pass: [`scripts/capture-pack-3d.mjs`](../scripts/capture-pack-3d.mjs) does this with Playwright, which was already a project dependency.

**How it works:**

1. A dedicated route, [`/capture/pack3d`](../src/app/capture/pack3d/page.tsx), renders exactly one `Pack3D` instance full-bleed on a plain background — nothing else on the page, so a recording isn't fighting the real site's header or hero copy. It's not a page anyone is meant to land on; it exists only for this script.
2. The script launches Chromium, opens that route in a context with Playwright's built-in `recordVideo` (no ffmpeg install needed — Playwright ships its own, used internally), and simply **waits 16 real seconds** while `Pack3D`'s own natural auto-rotate plays out — the video is genuinely the component in motion, not a simulation of it.
3. In a second pass, it emulates `prefers-reduced-motion: reduce` — which `Pack3D` already honours by pausing its own auto-rotate loop — and then, with nothing else touching the rotation, sets the exact CSS custom property `Pack3D` itself drives (`--pack-rotation`, exposed via a `data-pack-cube` hook) to each of 36 angles, 10° apart, screenshotting between each. That gives a deterministic frame sequence with the same fidelity as the live component, not a re-render of it.
4. The raw recording gets trimmed to one exact clean rotation (15s, matching `Pack3D`'s own turn speed) with Playwright's bundled `ffmpeg`, for a seamless, loop-ready clip.

**Run it:** `npm run capture:pack3d` (or `node scripts/capture-pack-3d.mjs`). Starts its own dev server if none is running, shuts it down after. Output lands in `capture-output/` (gitignored — regenerable any time the pack art changes, not a build artifact worth committing):

```
capture-output/
├── video/pack-360-loop.webm      # ~3.8MB, 900×900, 15s seamless loop
└── frames/pack3d/frame-00.png … frame-35.png   # 36 frames, 10° apart
```

**One real limitation, not hidden:** Playwright's bundled `ffmpeg` is a minimal build with only VP8/WebM support — no H.264, so no MP4 export came out of this pass, and there's no system `ffmpeg` in this environment to fall back to. WebM covers the actual use case (it plays natively in every modern browser and most video tooling), so this isn't blocking anything on the site, but if an MP4 is specifically needed for a platform that requires it, that's one more tool install away, not a redesign.

**Verified before calling it done:** probed the output `.webm` directly (valid VP8, 900×900, 25fps) rather than assuming the recording worked, and spot-checked three frames at 0°/90°/180° — each is a clean, undistorted, perpendicular face with fully legible text, confirming the cube's geometry (§5) is mathematically correct, not just visually plausible in a quick glance.

---

## 7. Pouch pass (2026-09-30)

The box is gone. Following [`packaging-pouch-prompt.md`](./packaging-pouch-prompt.md), `Pack3D` now builds a chips-style pillow pouch: front and back art mapped onto two puffed tile meshes (matrix3d per tile) that meet at the side folds and pinch flat into crimped, serrated seals (deep shade, crimp ridges, tear notch on the top seal). No side face, so mid-turn you see the bag's lens profile. The 3px outline is the silhouette traced by zero-blur drop-shadows, and shading steps in hard levels of the flavour's deep shade as tiles turn from a fixed light (CSS `cos()` + `round()`, no gradient). Highlight streaks and corner wrinkles live in `public/packs/pouch/film.svg`. Props changed: `side` is dropped and `theme` is added.

The capture script now renders frame by frame (450 frames, 30fps, exact `--pack-rotation` per frame) and encodes through Remotion's bundled ffmpeg, which has libx264. That closes the MP4 gap from §6:

```
node scripts/capture-pack-3d.mjs [slug ...]      # default dadi-masala
capture-output/video/pack-360-<slug>.mp4 / .webm # 1080×1080, 15s seamless loop
capture-output/frames/pack3d/<slug>/frame-NN.png # 36 stills, 10° apart
```

The fin seal on the back from `packaging-pouch-back-side-prompt.md` isn't drawn yet. The current back art has copy down the centre, so it waits for the reflowed back panels.
