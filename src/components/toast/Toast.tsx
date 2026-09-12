"use client";

import { useEffect, useRef } from "react";
import { Grain } from "@/components/grain/Grain";
import styles from "./toast.module.css";

export type ToastTone = "default" | "success" | "error";

export interface ToastAction {
  label: string;
  onAction: () => void;
}

// Matches --dur-base (320ms) with headroom, so the fallback in the effect
// below never races ahead of a transitionend that does arrive normally.
const EXIT_DURATION_MS = 400;

interface ToastProps {
  message: string;
  tone: ToastTone;
  duration: number;
  action?: ToastAction;
  visible: boolean;
  onDismiss: () => void;
  onExited: () => void;
}

// error is the only tone urgent enough to interrupt: role=alert +
// aria-live="assertive" per the requirement. default/success are
// role=status + aria-live="polite" so they don't cut off other speech.
export function Toast({ message, tone, duration, action, visible, onDismiss, onExited }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const arm = (ms: number) => {
    clearTimer();
    startedAtRef.current = Date.now();
    remainingRef.current = ms;
    timerRef.current = setTimeout(onDismiss, ms);
  };

  useEffect(() => {
    if (visible) {
      arm(duration);
      return clearTimer;
    }
    // transitionend doesn't fire on a backgrounded tab (Chromium suppresses
    // it there) and can be lost if the transition gets interrupted — this
    // timer is the fallback that guarantees onExited still runs.
    const fallback = setTimeout(onExited, EXIT_DURATION_MS);
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration]);

  const handleMouseEnter = () => {
    if (!visible) return;
    remainingRef.current -= Date.now() - startedAtRef.current;
    clearTimer();
  };

  const handleMouseLeave = () => {
    if (!visible) return;
    arm(Math.max(remainingRef.current, 0));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onDismiss();
    }
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (!visible) onExited();
  };

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={[styles.toast, styles[tone], visible ? styles.visible : styles.hidden]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onTransitionEnd={handleTransitionEnd}
      tabIndex={action ? -1 : undefined}
    >
      <span className={styles.message}>{message}</span>
      {action && (
        <button
          type="button"
          className={styles.action}
          onClick={() => {
            action.onAction();
            onDismiss();
          }}
        >
          {action.label}
        </button>
      )}
      <Grain scope="panel" intensity="subtle" className={styles.grain} />
    </div>
  );
}
