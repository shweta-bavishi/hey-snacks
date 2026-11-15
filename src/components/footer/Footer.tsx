import Link from "next/link";
import type { Flavour } from "@/data/flavours";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import mascotStyles from "@/components/mascot-avatar/mascot-avatar.module.css";
import styles from "./footer.module.css";

interface FooterLinkItem {
  label: string;
  /**
   * "#id" jumps within the page, "/path" is a route. Leave it out while a
   * destination doesn't exist yet: the label still shows, but as plain text
   * that goes nowhere, instead of a link that dead-ends or 404s.
   */
  href?: string;
}

const INFO_LINKS: FooterLinkItem[] = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "#faq" },
];

const SUPPORT_LINKS: FooterLinkItem[] = [
  { label: "Contact", href: "/contact" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function FooterLink({ item }: { item: FooterLinkItem }) {
  if (!item.href) {
    return <span className={styles.linkInert}>{item.label}</span>;
  }
  if (item.href.startsWith("/")) {
    return (
      <Link className={styles.link} href={item.href}>
        {item.label}
      </Link>
    );
  }
  return (
    <a className={styles.link} href={item.href}>
      {item.label}
    </a>
  );
}

export interface FooterProps {
  /** Never hardcoded — comes from src/data/flavours.ts. */
  flavours: Flavour[];
  className?: string;
}

export function Footer({ flavours, className }: FooterProps) {
  return (
    <footer className={[styles.footer, className].filter(Boolean).join(" ")}>
      <div className={styles.wordmarkCrop} aria-hidden="true">
        <span className={styles.wordmark}>hey.</span>
      </div>

      <div className={styles.inner}>
        <div className={styles.columns}>
          <nav className={styles.column} aria-label="Shop">
            <h2 className={styles.columnHeading}>Shop</h2>
            <ul className={styles.linkList}>
              {flavours.map((flavour) => (
                <li key={flavour.slug}>
                  <a className={styles.link} href={`#shop-${flavour.slug}`}>
                    {flavour.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-label="Info">
            <h2 className={styles.columnHeading}>Info</h2>
            <ul className={styles.linkList}>
              {INFO_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-label="Support">
            <h2 className={styles.columnHeading}>Support</h2>
            <ul className={styles.linkList}>
              {SUPPORT_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div
        className={[styles.mascotRow, mascotStyles.mascotHoverScope].join(" ")}
        aria-hidden="true"
      >
        {flavours.map((flavour) => (
          <MascotAvatar
            key={flavour.slug}
            flavour={flavour.theme}
            size={88}
            animateIdle
          />
        ))}
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.bottomBarText}>
          © hey. 2026 ✱ MADE WITH DIL SE LOVE
        </p>
      </div>
    </footer>
  );
}
