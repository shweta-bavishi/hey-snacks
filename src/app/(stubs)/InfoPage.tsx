import Link from "next/link";
import styles from "./info-page.module.css";

export interface InfoSection {
  heading: string;
  /** One string per paragraph. */
  body: string[];
}

interface InfoPageProps {
  eyebrow: string;
  heading: string;
  intro: string;
  sections: InfoSection[];
}

// Skeleton for text-led pages (about, contact, shipping, returns, privacy,
// terms). Placeholder copy lives in each route file until the real text lands.
export function InfoPage({ eyebrow, heading, intro, sections }: InfoPageProps) {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.intro}>{intro}</p>
      </header>

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.heading} className={styles.card}>
            <h2 className={styles.cardHeading}>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className={styles.cardBody}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <Link href="/" className={styles.back}>
        ← Back to hey.
      </Link>
    </main>
  );
}
