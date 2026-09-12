"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { Grain } from "@/components/grain/Grain";
import styles from "./modal.module.css";

export type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Heading text or node. Wired to aria-labelledby — always required, there is no unlabelled modal. */
  title: ReactNode;
  size?: ModalSize;
  children?: ReactNode;
  /**
   * Content that overlaps the panel edge (e.g. the mascot in the notify
   * modal's top-left corner). Rendered outside the clipped panel body so it
   * isn't cut off, and always aria-hidden — it's decoration, never the
   * modal's accessible content.
   */
  decoration?: ReactNode;
  className?: string;
}

/**
 * Dialog overlay for forms (Notify Me), confirmations, or focused content.
 *
 * **Scrim implementation:**
 * - Background scrim uses `.scrim` class with `rgb(var(--scrim) / var(--scrim-opacity-dark))`
 * - This is a 70% opacity dark overlay (darker than CommandPalette's 60% for higher contrast)
 * - Both use the same `--scrim` colour token (20 17 15) but different opacity scales
 *
 * **Decoration slot:**
 * - Positioned absolutely to overlap the panel's top-left corner
 * - Always `aria-hidden` — it's visual decoration, never accessible content
 * - Example: the Notify Me modal's mascot peeking from the corner
 *
 * **Scroll handling:**
 * - `.scroll` wrapper handles overflow (max-height: 90vh); `.panel` stays overflow:visible
 * - This allows the decoration slot to hang off the panel edge without being clipped
 * - Scrollbar lives on the wrapper, not the panel itself
 *
 * **Focus management:**
 * - Focus is trapped inside the modal when open
 * - Focus is returned to the trigger element (document.activeElement at open time) on close
 * - Background scroll is locked (padding-right preserves layout; no shift)
 * - App root gets `inert` attribute; modal content is removed from inert subtree
 *
 * **Nested modals:**
 * - Not supported. If you need a confirmation step, replace the content instead of stacking.
 *
 * **Reduced motion:**
 * - Animations disabled; modal appears instantly without scale/translate effects
 */
export function Modal({
  open,
  onClose,
  title,
  size = "md",
  children,
  decoration,
  className,
}: ModalProps) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Lock background scroll without a layout shift: pad the body by
  // whatever width the scrollbar occupied instead of just hiding overflow.
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  // Content behind the modal is inert (assistive tech and Tab traversal
  // both skip it), and focus moves in on open / back to the trigger on
  // close. One useLayoutEffect, in this order, so both DOM mutations and
  // the focus calls happen synchronously in a single commit — split across
  // two effects, the inert removal and the focus restore raced each other
  // (whichever the browser scheduled second silently lost, dropping focus
  // to <body>), and using passive useEffect at all let React detach the
  // panel from the DOM before either cleanup ran, which has the same
  // failure mode.
  useLayoutEffect(() => {
    if (!open) return;
    const appRoot = document.getElementById("app-root");
    appRoot?.setAttribute("inert", "");
    appRoot?.setAttribute("aria-hidden", "true");

    triggerRef.current = document.activeElement;
    const panel = panelRef.current;
    if (panel) {
      const firstFocusable = getFocusable(panel)[0];
      (firstFocusable ?? panel).focus();
    }

    return () => {
      appRoot?.removeAttribute("inert");
      appRoot?.removeAttribute("aria-hidden");

      // Deferred a tick: the portal's DOM node is still being detached when
      // this cleanup runs, and the browser's own "focused node just left
      // the document" handling parks focus on <body> *after* this cleanup
      // returns, clobbering a synchronous trigger.focus() call here. Firing
      // after that settles is what actually wins.
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) {
        setTimeout(() => trigger.focus(), 0);
      }
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = getFocusable(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !panel.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!open) return null;

  return createPortal(
    <div
      className={styles.scrim}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={[styles.panel, styles[size], className].filter(Boolean).join(" ")}
      >
        {decoration && (
          <div className={styles.decoration} aria-hidden="true">
            {decoration}
          </div>
        )}
        <div className={styles.scroll}>
          <h2 id={headingId} className={styles.heading}>
            {title}
          </h2>
          <div className={styles.body}>{children}</div>
        </div>
        <Grain scope="panel" intensity="subtle" className={styles.grain} />
      </div>
    </div>,
    document.body
  );
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}
