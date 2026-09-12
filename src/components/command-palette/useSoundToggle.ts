"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "hey-sound-enabled";

function readStoredEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Site-wide sound-effects flag. There's no audio system wired up yet — this
 * is the persisted on/off switch the command palette's Theme group exposes
 * ahead of one landing, so flipping it now doesn't require touching the
 * palette again later.
 */
export function useSoundToggle() {
  const [enabled, setEnabled] = useState(readStoredEnabled);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore write failures
      }
      return next;
    });
  }, []);

  return { enabled, toggle };
}
