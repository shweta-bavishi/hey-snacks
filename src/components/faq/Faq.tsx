import { FAQ_ITEMS } from "@/data/faq";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import styles from "./faq.module.css";

// Native <details>/<summary> accordion — free keyboard and screen-reader
// behaviour, no ARIA to get wrong. The ✱ marker rotates on open via the
// [open] attribute selector, no JS required.
export function Faq() {
  return (
    <section id="faq" className={`${styles.section} snap-section`}>
      <SectionHeading level={2} align="center" className={styles.heading}>
        FAQ
      </SectionHeading>
      <div className={styles.list}>
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className={styles.row}>
            <summary className={styles.summary}>
              <span>{item.question}</span>
              <span className={styles.marker} aria-hidden="true">
                ✱
              </span>
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
