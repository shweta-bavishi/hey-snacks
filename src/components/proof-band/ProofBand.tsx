import { Card } from "@/components/card/Card";
import { Pill } from "@/components/pill/Pill";
import styles from "./proof-band.module.css";

// Per 100g of the blended mix (makhana 50g, peanuts 75g, almonds 50g,
// cashews 50g, seeds 35g — 260g batch, scaled to a 100g serving). Nuts push
// fat well above pure makhana's near-zero baseline, so a straight "hey. vs
// chips" FAT comparison no longer favours us and is deliberately left out
// here rather than shipped as a losing (or misleading) row.
const NUTRITION = [
  { label: "PROTEIN", hey: "19.9g", chips: "6g" },
  { label: "CARBS", hey: "32.1g", chips: "53g" },
  { label: "FRIED", hey: "no", chips: "yes" },
];

// Same order as the packaging back panel (docs/packaging-back-panel-plan.md
// §8) — heaviest ingredient first, that's a food-labelling convention, not
// a style choice, so this list and the printed one on the box can never
// silently drift apart. Seasoning is flavour-specific, so it stays generic
// here rather than naming one flavour on a section that isn't flavour-scoped.
const INGREDIENTS = [
  "Peanuts",
  "Makhana",
  "Almonds",
  "Cashews",
  "Seeds",
  "Sunflower oil",
  "Your flavour's seasoning",
  "Salt",
];

export function ProofBand() {
  return (
    <section id="about" className={`${styles.band} snap-section`} data-theme="indigo">
      <div className={styles.grid}>
        <Card elevation="raised" shadowColor="ink" className={styles.card}>
          <Pill glyph className={styles.cardEyebrow}>
            THE NUMBERS
          </Pill>
          <p className={styles.numbers}>PROTEIN 19.9g · FAT 38.5g · CALCIUM 114mg</p>
          <ul className={styles.tickList}>
            <li>Roasted not fried</li>
            <li>No palm oil</li>
            <li>Cholesterol-free</li>
            <li>Gluten-free</li>
          </ul>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th></th>
                <th>hey.</th>
                <th>chips</th>
              </tr>
            </thead>
            <tbody>
              {NUTRITION.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.hey}</td>
                  <td>{row.chips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card elevation="raised" shadowColor="ink" className={styles.card}>
          <Pill glyph className={styles.cardEyebrow}>
            WHAT&apos;S INSIDE
          </Pill>
          <h3 className={styles.cardHeading}>Nothing you can&apos;t pronounce.</h3>
          <ul className={styles.ingredientsBox}>
            {INGREDIENTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
