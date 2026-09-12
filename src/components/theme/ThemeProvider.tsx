"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_THEME,
  FlavourTheme,
  NIGHT_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "./theme-script";

interface ThemeContextValue {
  /** The explicitly chosen (and persisted) flavour theme. */
  theme: FlavourTheme;
  setTheme: (theme: FlavourTheme) => void;
  /**
   * `theme`, unless an unlocked scroll preview is currently overriding it —
   * the same value driving `data-theme` (and therefore `--accent`) on
   * `<html>`. Read this instead of `theme` for any JS-selected asset (e.g.
   * a mascot image) that needs to stay in lockstep with CSS-var-driven
   * colour so the two never visibly disagree mid-scroll.
   */
  activeTheme: FlavourTheme;
  /** Independent night-mode toggle, persisted. */
  night: boolean;
  setNight: (night: boolean) => void;
}

interface InternalContextValue extends ThemeContextValue {
  previewTheme(theme: FlavourTheme | null): void;
}

const ThemeContext = createContext<InternalContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<FlavourTheme>(DEFAULT_THEME);
  const [night, setNightState] = useState(false);
  // section-scroll preview, never persisted, cleared as soon as an explicit
  // choice is made
  const [preview, setPreview] = useState<FlavourTheme | null>(null);
  // once the user has explicitly picked a theme, scroll-driven preview is
  // locked out for the rest of the session — a stored theme counts as an
  // explicit pick too, since it came from a prior setTheme() call
  const lockedRef = useRef(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const storedNight = localStorage.getItem(NIGHT_STORAGE_KEY);
      if (storedTheme) {
        setThemeState(storedTheme as FlavourTheme);
        lockedRef.current = true;
      }
      if (storedNight === "true") setNightState(true);
    } catch {
      // localStorage unavailable (private mode, SSR quirks) — fall back to defaults
    }
  }, []);

  const activeTheme = preview ?? theme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-night", String(night));
  }, [night]);

  const setTheme = useCallback((next: FlavourTheme) => {
    lockedRef.current = true;
    setPreview(null);
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore write failures
    }
  }, []);

  const setNight = useCallback((next: boolean) => {
    setNightState(next);
    try {
      localStorage.setItem(NIGHT_STORAGE_KEY, String(next));
    } catch {
      // ignore write failures
    }
  }, []);

  const previewTheme = useCallback((next: FlavourTheme | null) => {
    if (lockedRef.current) return;
    setPreview(next);
  }, []);

  const value = useMemo(
    () => ({ theme, activeTheme, setTheme, night, setNight, previewTheme }),
    [theme, activeTheme, setTheme, night, setNight, previewTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return {
    theme: ctx.theme,
    activeTheme: ctx.activeTheme,
    setTheme: ctx.setTheme,
    night: ctx.night,
    setNight: ctx.setNight,
  };
}

/**
 * Attach to a flavour section. While >= `threshold` of the section is
 * in view, the page temporarily previews that section's theme without
 * touching the persisted choice. Leaving the section reverts to the
 * explicit theme. Once the user has explicitly picked a theme (this
 * session or from a prior visit), scroll-driven preview is locked out
 * entirely — it becomes a no-op until the page is reloaded with a
 * cleared choice.
 */
export function useSectionTheme<T extends HTMLElement>(
  theme: FlavourTheme,
  threshold = 0.5
) {
  const ref = useRef<T | null>(null);
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useSectionTheme must be used inside ThemeProvider");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        ctx.previewTheme(entry.isIntersecting ? theme : null);
      },
      { threshold }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      ctx.previewTheme(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, threshold]);

  return ref;
}
