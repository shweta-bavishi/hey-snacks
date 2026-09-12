// All shapes are authored in a fixed 240x200 viewBox and stretched to the
// real (content-sized) box with preserveAspectRatio="none" on the <svg>.
// That's the whole trick for "border follows an irregular polygon that
// auto-sizes to text": the polygon never needs to know its rendered size,
// it just gets non-uniformly scaled, and vector-effect="non-scaling-stroke"
// keeps the 3px ink line a constant screen-width even under that distortion
// — so there is no separate clip-path to go out of sync with a border.

export type SpeechBubbleTail = "bottom-left" | "bottom-right" | "top-left" | "none";
export type SpeechBubbleTone = "speech" | "thought" | "shout";

type Point = [number, number];

// Body outline, hand-inked: straight segments between deliberately uneven
// points (a real rounded rect would use identical radii on every corner —
// this doesn't).
const BODY: Point[] = [
  [16, 28],
  [72, 16],
  [142, 24],
  [206, 14],
  [228, 54],
  [220, 102],
  [230, 144],
  [186, 160],
  [118, 150],
  [58, 162],
  [16, 136],
  [8, 78],
];

// Where to splice a tail spike into the body outline: index of the point to
// splice after, and the spike's own tip + shoulder points (kept close to the
// body so the join reads as one continuous inked line, not a bolted-on
// triangle).
const TAIL_SPLICE: Record<Exclude<SpeechBubbleTail, "none">, { after: number; spike: Point[] }> = {
  "bottom-left": { after: 9, spike: [[36, 178], [14, 198], [4, 156]] },
  "bottom-right": { after: 7, spike: [[204, 176], [226, 196], [214, 150]] },
  "top-left": { after: 11, spike: [[-4, 40], [-22, 12], [30, 24]] },
};

function toPath(points: Point[]): string {
  const [first, ...rest] = points;
  return `M ${first[0]} ${first[1]} ` + rest.map(([x, y]) => `L ${x} ${y}`).join(" ") + " Z";
}

function speechOrThoughtBody(tail: SpeechBubbleTail): Point[] {
  if (tail === "none") return BODY;
  const { after, spike } = TAIL_SPLICE[tail];
  return [...BODY.slice(0, after + 1), ...spike, ...BODY.slice(after + 1)];
}

// Deterministic jagged ring (no Math.random — must render identically on
// server and client) for the "shout" tone's starburst outline.
const STARBURST_CENTER: Point = [120, 90];
const STARBURST_RADIUS: Point = [118, 82];
const STARBURST_SPIKES = 22;

// Shallower valleys than a "real" star (0.84 instead of, say, 0.5) so the
// safe reading area in the middle stays big enough for wrapped text —
// this is still visibly jagged without carving into the type.
function starburstPoint(i: number): Point {
  const [cx, cy] = STARBURST_CENTER;
  const [rx, ry] = STARBURST_RADIUS;
  const angle = (i / STARBURST_SPIKES) * Math.PI * 2;
  const isLong = i % 2 === 0;
  const wobble = 0.95 + 0.07 * Math.sin(i * 2.7);
  const r = (isLong ? 1 : 0.84) * wobble;
  return [cx + Math.cos(angle) * rx * r, cy + Math.sin(angle) * ry * r];
}

// Deterministic jagged ring (no Math.random — must render identically on
// server and client) for the "shout" tone's starburst outline.
function starburstBody(tail: SpeechBubbleTail): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < STARBURST_SPIKES; i++) points.push(starburstPoint(i));
  if (tail === "none") return points;
  // Index picked to sit on the correct side of the ring for each tail
  // direction (SVG y grows downward, so ~135deg is bottom-left, ~45deg is
  // bottom-right, ~225deg is top-left). The tip continues straight out
  // along that same spike's own angle so it can't cross its neighbours.
  const indexByTail: Record<Exclude<SpeechBubbleTail, "none">, number> = {
    "bottom-left": 8,
    "bottom-right": 3,
    "top-left": 14,
  };
  const index = indexByTail[tail];
  const [cx, cy] = STARBURST_CENTER;
  const [rx, ry] = STARBURST_RADIUS;
  const angle = (index / STARBURST_SPIKES) * Math.PI * 2;
  const tip: Point = [cx + Math.cos(angle) * rx * 1.7, cy + Math.sin(angle) * ry * 1.7];
  return [...points.slice(0, index + 1), tip, ...points.slice(index + 1)];
}

export function buildBubblePath(tone: SpeechBubbleTone, tail: SpeechBubbleTail): string {
  const points = tone === "shout" ? starburstBody(tail) : speechOrThoughtBody(tail);
  return toPath(points);
}

// Thought tone trades the merged spike for two trailing circles (the
// classic "thought bubble" convention) — returned as [cx, cy, r] in the same
// 240x200 viewBox, biggest-to-smallest, walking away from the body toward
// the tail corner.
export function thoughtTrail(tail: SpeechBubbleTail): [number, number, number][] {
  switch (tail) {
    case "bottom-left":
      return [[34, 178, 14], [16, 202, 8]];
    case "bottom-right":
      return [[208, 178, 14], [226, 202, 8]];
    case "top-left":
      return [[2, 30, 13], [-16, 4, 7]];
    default:
      return [];
  }
}
