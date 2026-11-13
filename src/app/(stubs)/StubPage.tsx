import Link from "next/link";
import styles from "./stub.module.css";

interface StubPageProps {
  eyebrow: string;
  heading: string;
  body: string;
}

// Thin styled "coming soon" page, tokens only, so header/footer links to
// /about, /store-locator, /wholesale and /faq stop pointing into the void.
export function StubPage({ eyebrow, heading, body }: StubPageProps) {
  return (
    <main id="main-content" className={styles.stub}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.body}>{body}</p>
      <Link href="/" className={styles.back}>
        ← Wapas hey. pe
      </Link>
    </main>
  );
}
