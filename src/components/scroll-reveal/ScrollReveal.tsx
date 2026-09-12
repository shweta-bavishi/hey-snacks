"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./scroll-reveal.module.css";

export interface ScrollRevealProps {
  children: React.ReactNode;
  /** ms to wait after intersecting before the reveal starts. */
  delay?: number;
  /** ms added per direct child (index * stagger), on top of `delay`. */
  stagger?: number;
  /** fraction of the element's box that must be visible to fire. */
  threshold?: number;
  /** fire once and disconnect (default), or re-arm on every enter/exit. */
  once?: boolean;
  className?: string;
}

// SSR has no window, so effects that touch matchMedia/IntersectionObserver
// must wait for the client. useLayoutEffect (client) still runs before the
// browser paints the post-hydration frame, so flipping to "armed" there
// never shows as a visible-then-hidden flash — the browser paints straight
// to the hidden state. On the server this silently falls back to
// useEffect, which is fine since there's no paint to race there anyway.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * One reveal, used everywhere: translateY(24px) -> 0 plus opacity 0 -> 1,
 * nothing else. Direct children stagger via inline transition-delay set in
 * JS (CSS alone can't multiply an arbitrary nth-child index).
 *
 * Renders as `display: contents` so it never introduces a box into a
 * parent grid/flex. That means the reveal styles target this element's
 * *children*, not the element itself (a `display: contents` box can't be
 * animated — it has no box to animate). See scroll-reveal.module.css.
 *
 * No-JS / no-IntersectionObserver / pre-mount: children render exactly as
 * given, fully visible, with no wrapper styling applied at all. The
 * "hidden until revealed" state only exists once JS has confirmed motion
 * is not reduced and is about to observe — never before, never as a
 * fallback default.
 */
export function ScrollReveal({
  children,
  delay = 0,
  stagger = 0,
  threshold = 0.2,
  once = true,
  className,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // null = undecided (pre-mount / SSR): render plain, unarmed. Only ever
  // becomes a real boolean on the client, synchronously pre-paint.
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return; // still undecided, or reduced: no observer, no arming
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    Array.from(node.children).forEach((child, i) => {
      (child as HTMLElement).style.transitionDelay = `${delay + i * stagger}ms`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, delay, stagger, threshold, once]);

  // Reduced motion or pre-mount: never armed, children always visible as-is.
  const armed = reducedMotion === false;

  return (
    <div
      ref={containerRef}
      style={{ display: "contents" }}
      className={[armed && styles.armed, armed && revealed && styles.revealed, className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
