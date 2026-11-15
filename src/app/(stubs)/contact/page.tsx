import { Button } from "@/components/button/Button";
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_DISPLAY,
  GMAIL_COMPOSE_URL,
  WHATSAPP_URL,
} from "@/data/contact";
import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";

export const metadata = { title: "Contact | hey." };

export default function ContactPage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>CONTACT</span>
        <h1 className={styles.heading}>Get in touch.</h1>
        <p className={styles.intro}>
          Questions, feedback or just a hello. Pick whichever way suits you.
        </p>
      </header>

      <div className={styles.options}>
        <section className={styles.card}>
          <h2 className={styles.cardHeading}>Email us</h2>
          <p className={styles.cardBody}>{CONTACT_EMAIL}</p>
          <Button
            as="a"
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            Email us
          </Button>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardHeading}>WhatsApp us</h2>
          <p className={styles.cardBody}>{CONTACT_WHATSAPP_DISPLAY}</p>
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            WhatsApp us
          </Button>
        </section>
      </div>

      <section className={styles.formCard} aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className={styles.cardHeading}>
          Send us a message
        </h2>
        <ContactForm />
      </section>
    </main>
  );
}
