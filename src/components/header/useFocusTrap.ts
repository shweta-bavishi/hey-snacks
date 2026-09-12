"use client";

import { RefObject, useEffect, useRef } from "react";

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
    (el) => el.offsetParent !== null
  );
}

/**
 * Same inert-app-root + Tab-trap + focus-restore contract as Modal, reused
 * here for the mobile takeover. Kept as its own hook (rather than importing
 * Modal) since the takeover is a `<div role="dialog">` panel embedded in
 * Header's own markup, not a portalled Modal instance.
 */
export function useFocusTrap(open: boolean, panelRef: RefObject<HTMLElement | null>, onClose: () => void) {
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const appRoot = document.getElementById("app-root");
    appRoot?.setAttribute("inert", "");
    appRoot?.setAttribute("aria-hidden", "true");

    triggerRef.current = document.activeElement;
    if (panel) {
      const firstFocusable = getFocusable(panel)[0];
      (firstFocusable ?? panel).focus();
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    return () => {
      appRoot?.removeAttribute("inert");
      appRoot?.removeAttribute("aria-hidden");
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;

      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) {
        setTimeout(() => trigger.focus(), 0);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
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
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);
}
