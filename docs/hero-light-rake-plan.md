# The hero film: light rake + macro crops

**Status:** built. `remotion/` renders it; `npm run render:hero` produces the MP4.
**Relates to:** [`hey-makhana-design-spec.md`](./hey-makhana-design-spec.md) §10 · [`hero-360-plan.md`](./hero-360-plan.md) §6
**Touches:** `remotion/`, `remotion.config.ts`, `public/packs/`

---

## 1. What it is

A 10 second silent loop for the hero's pack column. Three beats, hard cuts between them, no audio.
1080×1080, 30fps, 300 frames.

| Beat | Frames | Framing | Move |
|---|---|---|---|
| type | 0–104 | 4.3× on the display type | drifts laterally 4.4% |
| wordmark | 105–209 | 3.62× on the `hey.` lockup | slow push to 3.95× |
| wide | 210–299 | 0.78× — the whole pack, small | slow push to 0.822×, hairline rule draws |

**The pack never moves.** Not in any frame. Every change of framing is a hard cut, never a tween, so
nothing ever reads as the object animating. The only things that move are the camera and the light.

## 2. Why it looks the way it does

This replaced two earlier cuts that were rejected as childish. The tells were specific and worth
recording, because they are easy to reintroduce:

- **Squash and stretch.** Scaling on impact is a cartoon principle and the loudest one.
- **Overshoot.** Springs that pass their target read as playful by definition. Spec §10 says
  *"Everything overshoots"* — that rule is correct for the site's UI and wrong for this film. The only
  eased motion here is the light itself, so it does not travel at a mechanical constant speed.
- **A mascot peeking into frame**, and **wobbly blobs drifting around**. Both removed.

What replaced them is restraint: one subject, long holds, a lot of empty ground, and crops tight
enough that the Modak letterforms stop reading as a cartoon typeface and become graphic shape. That
last point is the load-bearing one. Beats 1 and 2 never show the whole pack, which is what keeps the
film away from the mascot roundel and the illustrated makhana.

**The honest limit:** beat 3 pulls wide, and there the illustration is simply present. Darkness and a
small size manage it; they do not remove it. A more premium hero than this is a packaging
conversation, not a video one.

## 3. Two decisions that are easy to get wrong later

**The dark ground is on-system, not a departure.** `tokens.css` already carries
`[data-night="true"]`, which swaps `--ink` and `--paper` to `#14110F`. The hero section going dark
while every section below stays paper uses that pair. A `HeroLightRakePaper` composition renders the
same film on `--paper` if that is ever wanted; it is calmer and the rake reads as saturation washing
in rather than light arriving.

**Grain is not in the file, deliberately.** It is high-frequency noise, the most expensive thing a
codec can be asked to carry, and baking it in roughly triples the bitrate. The `grain` prop defaults
to `false`; keep the site's own `<Grain>` component layered over the `<video>` element instead. This
is also why the file is 832 KB rather than ~2.5 MB.

**The light is masked with hard colour stops.** Three nested bands at rising exposure, no blend
anywhere, so the page keeps its promise of no visible gradients. The bands are 5.6× the frame width:
an early attempt used narrow bands and it read as stripes sitting on top of the pack rather than
light passing over it. Band width is the whole difference.

## 4. Running it

```bash
npm run remotion            # studio, for scrubbing and tuning
npm run render:hero         # out/hero-light-rake.mp4   (h264, ~832 KB)
npm run render:hero:webm    # out/hero-light-rake.webm  (vp9)
npm run render:hero:poster  # out/hero-light-rake-poster.png
```

`out/` is gitignored — these are regenerable from the pack art, not build artifacts worth committing.
The first render downloads a headless Chrome; that happens once.

Every beat boundary, crop and exposure value lives in [`remotion/timeline.ts`](../remotion/timeline.ts)
and nowhere else. It asserts at module load that the beats tile the composition exactly, because a
gap there is invisible in a still and shows up only as a stutter at one cut.

## 5. Wiring it into the hero

Not done yet — it is a live design change and it has a dependency (§6). When it happens:

```tsx
{reducedMotion ? (
  <Pack3D front={...} back={...} side={...} alt={...} />
) : (
  <video
    className={styles.packVideo}
    autoPlay muted loop playsInline
    poster="/hero/hero-light-rake-poster.webp"
    aria-hidden="true"
  >
    <source src="/hero/hero-light-rake.webm" type="video/webm" />
    <source src="/hero/hero-light-rake.mp4" type="video/mp4" />
  </video>
)}
```

Copy the rendered files to `public/hero/` first. Reduced motion falls back to the live `Pack3D`
frozen at 0°, which satisfies spec §10.5 (*"360° pack becomes a single frame"*) without a second
asset. The text column stays real DOM: the `<h1>`, the price row and the `Notify Me` button are
untouched.

## 6. The dependency: `FlavourShowcase` must change too

The hero and `FlavourShowcase` are currently the same composition — copy left, `Pack3D` right,
auto-rotating, grain overlay, accent tint, separated only by `--paper` vs `--paper-2`. Two changes
keep them distinct once the hero is a film:

1. **Rotation belongs to the showcase alone.** This film contains none, which is what frees the 360 to
   be the showcase's move. Spec §10.4 allows one hero animation per section and names the 360° pack as
   one of the page's three big moments; it should be spent once.
2. **The showcase needs a stronger ground than `--paper-2`.** Painting `.section` with
   `var(--accent-tint)` separates it from the hero unmistakably and makes the flavour tabs feel
   consequential — click Jaadu, the room goes lavender. It is close to a one-line change since the
   section is already themed by `data-theme`.
