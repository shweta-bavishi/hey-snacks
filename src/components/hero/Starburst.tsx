import styles from "./starburst.module.css";

export interface StarburstProps {
  className?: string;
}

// The one permitted "gradient" on the page, done posterised: six nested
// spiky stars, each a single flat fill one step lighter than the one
// behind it (see starburst.module.css), never a smooth CSS gradient.
// Same Bollywood-poster burst the old banner art had behind the pack.
const SPIKES = 16;
const INNER_RATIO = 0.74;
const OUTER_RADII = [296, 252, 210, 170, 132, 96];

function starPoints(outer: number): string {
  const inner = outer * INNER_RATIO;
  const points: string[] = [];
  for (let i = 0; i < SPIKES * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    // Start at 12 o'clock so a spike, not a notch, points straight up.
    const angle = (Math.PI * i) / SPIKES - Math.PI / 2;
    points.push(`${(300 + radius * Math.cos(angle)).toFixed(1)},${(300 + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(" ");
}

const BANDS = OUTER_RADII.map(starPoints);

export function Starburst({ className }: StarburstProps) {
  return (
    <svg
      className={[styles.starburst, className].filter(Boolean).join(" ")}
      viewBox="0 0 600 600"
      aria-hidden="true"
      focusable="false"
    >
      {BANDS.map((points, i) => (
        <polygon key={i} points={points} className={styles.band} data-band={i} />
      ))}
    </svg>
  );
}
