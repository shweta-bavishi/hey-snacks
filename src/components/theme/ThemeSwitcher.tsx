"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { FLAVOURS } from "@/data/flavours";
import styles from "./theme-switcher.module.css";

/**
 * Header theme pill — swaps the site accent by writing `data-theme` via
 * ThemeProvider. Flavour list comes from `FLAVOURS`, same source the rest
 * of the site reads from, so a fifth flavour shows up here for free.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const active = FLAVOURS.find((f) => f.theme === theme) ?? FLAVOURS[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" className={styles.swatch} data-tone={active.theme} />
        <span className={styles.triggerLabel}>{active.short}</span>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Choose theme">
          {FLAVOURS.map((flavour) => (
            <li key={flavour.slug} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={flavour.theme === theme}
                className={styles.option}
                data-tone={flavour.theme}
                onClick={() => {
                  setTheme(flavour.theme);
                  setOpen(false);
                }}
              >
                <span aria-hidden="true" className={styles.swatch} data-tone={flavour.theme} />
                {flavour.short}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
