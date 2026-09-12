"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * True once the page has scrolled past 100vh. Driven by an
 * IntersectionObserver on a 1px sentinel — never an unthrottled scroll
 * handler. The sentinel is portalled straight into <body> (not rendered
 * inside Header) so Header's own `position: sticky` can never become its
 * containing block and drag `top: 100vh` along with it.
 *
 * The portal itself only mounts after the component has mounted client-side
 * (`mounted` state, not a `typeof document` render-time check) — `document`
 * exists during SSR-to-static-markup too, so branching on it directly would
 * make the server and first client render disagree and trip a hydration
 * mismatch.
 */
export function useHeaderShrink() {
  const [shrunk, setShrunk] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShrunk(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mounted]);

  const sentinel = !mounted
    ? null
    : createPortal(
        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "100vh",
            left: 0,
            width: 1,
            height: 1,
            pointerEvents: "none",
          }}
        />,
        document.body
      );

  return { shrunk, sentinel };
}
