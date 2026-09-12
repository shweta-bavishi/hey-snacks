"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CommandPalette } from "./CommandPalette";

interface CommandPaletteContextValue {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
  /** True for the first 3s-after-load window the header pill should pulse. Consumed once, then never again. */
  shouldPulse: boolean;
  consumePulse: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

const PULSE_STORAGE_KEY = "hey-palette-pulsed";
const PULSE_DELAY_MS = 3000;

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);

  const consumePulse = useCallback(() => {
    setShouldPulse(false);
    try {
      localStorage.setItem(PULSE_STORAGE_KEY, "true");
    } catch {
      // ignore write failures
    }
  }, []);

  // ⌘K / Ctrl+K toggles from anywhere; "/" opens from anywhere that isn't
  // already accepting text input.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (event.key === "/" && !open && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // One-time discoverability pulse, 3s after first load, never repeated.
  useEffect(() => {
    let alreadyPulsed = true;
    try {
      alreadyPulsed = localStorage.getItem(PULSE_STORAGE_KEY) === "true";
    } catch {
      // treat unreadable storage as "already pulsed" so we never pulse loop
    }
    if (alreadyPulsed) return;
    pulseTimerRef.current = setTimeout(() => setShouldPulse(true), PULSE_DELAY_MS);
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  const value = useMemo(
    () => ({ open, openPalette, closePalette, shouldPulse, consumePulse }),
    [open, openPalette, closePalette, shouldPulse, consumePulse]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  return ctx;
}
