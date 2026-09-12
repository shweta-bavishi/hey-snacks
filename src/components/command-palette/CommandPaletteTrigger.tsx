"use client";

import { useEffect } from "react";
import { useCommandPalette } from "./CommandPaletteProvider";
import styles from "./command-palette.module.css";

/**
 * Header ⌘K pill on desktop, floating search bubble bottom-right on mobile —
 * CSS swaps which one is visible at the same 640px breakpoint the rest of
 * the design system uses, so there's only ever one trigger in the DOM.
 */
export function CommandPaletteTrigger({ className }: { className?: string }) {
  const { openPalette, shouldPulse, consumePulse } = useCommandPalette();

  // Pulse plays once, then the flag is consumed so it can't restart on a
  // re-render (e.g. theme change) within the same load.
  useEffect(() => {
    if (!shouldPulse) return;
    const timer = setTimeout(consumePulse, 900);
    return () => clearTimeout(timer);
  }, [shouldPulse, consumePulse]);

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className={[styles.trigger, shouldPulse ? styles.pulse : "", className].filter(Boolean).join(" ")}
        aria-label="Open command palette"
      >
        <span aria-hidden="true">⌘K</span>
      </button>
      <button
        type="button"
        onClick={openPalette}
        className={[styles.mobileTrigger, shouldPulse ? styles.pulse : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-label="Search hey."
      >
        <span aria-hidden="true">✱</span>
      </button>
    </>
  );
}
