"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import mascotStyles from "@/components/mascot-avatar/mascot-avatar.module.css";
import { useHeaderShrink } from "./useHeaderShrink";
import { useFocusTrap } from "./useFocusTrap";
import styles from "./header.module.css";

interface NavItem {
  label: string;
  /** "#id" jumps within the landing page; "/path" is its own route. */
  href: string;
}

// Each link goes where its label says. Shop is a section on this page;
// Store Locator and About Us have their own pages (src/app/(stubs)), so
// they no longer land on an unrelated card in the proof band.
const NAV_LEFT: NavItem[] = [
  { label: "Shop", href: "#shop" },
  { label: "Store Locator", href: "/store-locator" },
];

const NAV_RIGHT: NavItem[] = [{ label: "About Us", href: "/about" }];

function NavLink({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) {
  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} className={className} onClick={onClick}>
      {item.label}
    </a>
  );
}

/**
 * The full-stop dot reads `background: var(--accent)`, not a JS-computed
 * colour. `--accent` is what ThemeProvider repaints on `data-theme` — both
 * for an explicit `setTheme()` pick and, before any explicit pick is made,
 * for scroll-driven section preview (see `useSectionTheme`). So the dot
 * recolours per flavour section for free while scrolling, and the instant
 * the user makes an explicit theme choice (here or from the command
 * palette), preview locks out and the dot simply reflects that choice —
 * same variable, no second source of truth to fight over.
 */
export function Header() {
  const { activeTheme } = useTheme();
  const { shrunk, sentinel } = useHeaderShrink();
  const [menuOpen, setMenuOpen] = useState(false);
  const takeoverRef = useRef<HTMLDivElement | null>(null);
  const headingId = useId();

  useFocusTrap(menuOpen, takeoverRef, () => setMenuOpen(false));

  return (
    <>
      {sentinel}
      <a href="#main-content" className={styles.skipLink}>
        Seedha content pe jao
      </a>
      <header className={styles.header} data-shrunk={shrunk}>
        <nav className={styles.navLeft} aria-label="Shop">
          {NAV_LEFT.map((item) => (
            <NavLink key={item.href} item={item} className={styles.navLink} />
          ))}
        </nav>

        <Link href="/" className={styles.logotype} aria-label="hey. home">
          <span aria-hidden="true">hey</span>
          <span aria-hidden="true" className={styles.dot} />
        </Link>

        <div className={styles.navRight}>
          <nav aria-label="About" className={styles.navRightLinks}>
            {NAV_RIGHT.map((item) => (
              <NavLink key={item.href} item={item} className={styles.navLink} />
            ))}
          </nav>
          <ThemeSwitcher className={styles.themeSwitcher} />
          <button
            type="button"
            className={styles.hamburger}
            aria-expanded={menuOpen}
            aria-controls={headingId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          ref={takeoverRef}
          id={headingId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          className={[styles.takeover, mascotStyles.mascotHoverScope].join(" ")}
        >
          <button
            type="button"
            className={styles.takeoverClose}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✱
          </button>
          <nav className={styles.takeoverNav} aria-label="Main">
            {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
              <NavLink
                key={item.href}
                item={item}
                className={styles.takeoverLink}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </nav>
          <MascotAvatar flavour={activeTheme} size={88} animateIdle className={styles.takeoverMascot} />
        </div>
      )}
    </>
  );
}
