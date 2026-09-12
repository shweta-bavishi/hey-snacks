"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import mascotStyles from "@/components/mascot-avatar/mascot-avatar.module.css";
import { CommandPaletteTrigger } from "@/components/command-palette/CommandPaletteTrigger";
import { useHeaderShrink } from "./useHeaderShrink";
import { useFocusTrap } from "./useFocusTrap";
import styles from "./header.module.css";

const NAV_LEFT = [
  { label: "Shop", href: "#shop" },
  { label: "Store Locator", href: "#store-locator" },
];

const NAV_RIGHT = [{ label: "About Us", href: "#about" }];

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
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <Link href="/" className={styles.logotype} aria-label="hey. home">
          <span aria-hidden="true">hey</span>
          <span aria-hidden="true" className={styles.dot} />
        </Link>

        <div className={styles.navRight}>
          <nav aria-label="About" className={styles.navRightLinks}>
            {NAV_RIGHT.map((item) => (
              <a key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>
          <CommandPaletteTrigger className={styles.paletteTrigger} />
          <a href="#cart" className={styles.cartLink}>
            Cart<span aria-hidden="true">(0)</span>
          </a>
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
            {[...NAV_LEFT, ...NAV_RIGHT, { label: "Cart (0)", href: "#cart" }].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.takeoverLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <MascotAvatar flavour={activeTheme} size={88} animateIdle className={styles.takeoverMascot} />
        </div>
      )}
    </>
  );
}
