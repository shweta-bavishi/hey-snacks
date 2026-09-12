"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "hey-recent-commands";
const MAX_RECENTS = 3;

function readRecents(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Last 3 command ids used, most-recent-first, persisted across sessions.
 * Read lazily on mount (SSR has no localStorage) rather than in an effect,
 * so the RECENT group doesn't pop in a frame after the palette opens.
 */
export function useRecentCommands() {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const hydrate = useCallback(() => {
    if (hydrated) return;
    setRecentIds(readRecents());
    setHydrated(true);
  }, [hydrated]);

  const addRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((existing) => existing !== id)].slice(0, MAX_RECENTS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore write failures (private mode, quota)
      }
      return next;
    });
  }, []);

  return { recentIds, hydrate, addRecent };
}
