"use client";

/**
 * Queue, not stack. hey. only ever shows one toast at a time, bottom-centre.
 * Reasons:
 *  - A single ink pill matches the brand's one-hero-statement-at-a-time voice —
 *    two overlapping "action pills" competing for the same 12rem of screen
 *    reads as clutter, not feedback.
 *  - Screen readers already struggle to keep up with one live region;
 *    stacked toasts firing near-simultaneously would talk over each other.
 *  - Nothing in the product (cart-free, checkout-free) fires toasts fast
 *    enough to need parallel visibility — everything is sequential feedback
 *    ("added", "copied", "error"), so queueing preserves order without
 *    ever dropping a message the way a naive "replace" would.
 * New calls join a FIFO queue and wait for the current toast to finish its
 * full lifecycle (including exit animation) before mounting.
 */

import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Toast, ToastAction, ToastTone } from "./Toast";

export interface ToastOptions {
  message: string;
  tone?: ToastTone;
  duration?: number;
  action?: ToastAction;
}

interface QueuedToast extends Required<Pick<ToastOptions, "message" | "tone" | "duration">> {
  id: number;
  action?: ToastAction;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 2200;

export function ToastProvider({ children }: { children: ReactNode }) {
  // queue[0] (if any) is the toast currently on screen; the rest are
  // waiting their turn. Advancing the queue happens directly inside the
  // event handlers below (the click that calls toast(), the timer/keyboard
  // dismiss, the exit-transition callback) rather than in an effect, so a
  // toast finishing never depends on an extra render round-trip.
  const [queue, setQueue] = useState<QueuedToast[]>([]);
  const [visible, setVisible] = useState(false);
  const nextId = useRef(0);

  const current = queue[0] ?? null;

  const toast = useCallback((options: ToastOptions) => {
    const entry: QueuedToast = {
      id: nextId.current++,
      message: options.message,
      tone: options.tone ?? "default",
      duration: options.duration ?? DEFAULT_DURATION,
      action: options.action,
    };

    setQueue((prev) => {
      // Same message already on screen or already queued: refresh it in
      // place instead of adding a duplicate. This is what keeps a repeated
      // call ("Added to cart" x2 from a double click) from being announced
      // twice by assistive tech.
      const dupeIndex = prev.findIndex(
        (item) => item.message === entry.message && item.tone === entry.tone
      );
      if (dupeIndex !== -1) {
        const next = [...prev];
        next[dupeIndex] = { ...next[dupeIndex], duration: entry.duration, action: entry.action };
        return next;
      }
      const isFirst = prev.length === 0;
      if (isFirst) setVisible(true);
      return [...prev, entry];
    });
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  // The current toast has finished its exit transition — drop it and, if
  // another is waiting, bring it on screen.
  const handleExited = useCallback(() => {
    setQueue((prev) => {
      const rest = prev.slice(1);
      if (rest.length > 0) setVisible(true);
      return rest;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof document !== "undefined" &&
        current &&
        createPortal(
          <Toast
            key={current.id}
            message={current.message}
            tone={current.tone}
            duration={current.duration}
            action={current.action}
            visible={visible}
            onDismiss={dismiss}
            onExited={handleExited}
          />,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.toast;
}
