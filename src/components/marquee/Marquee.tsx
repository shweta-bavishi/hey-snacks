"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Grain } from "@/components/grain/Grain";
import styles from "./marquee.module.css";

export type MarqueeDirection = "left" | "right";
export type MarqueeTone = "marigold" | "peacock" | "rani" | "ink";

export interface MarqueeProps {
  items: string[];
  direction?: MarqueeDirection;
  /** Seconds for one full loop of `items` (before the ultrawide-safe repeat). */
  speed?: number;
  tone?: MarqueeTone;
  /** Leading/trailing glyph between items. */
  separator?: string;
  /**
   * false = this marquee carries real information (e.g. a shipping
   * threshold) and must be announced once to screen readers as static
   * text, with the scrolling copy hidden from the accessibility tree.
   * true (default) = purely decorative, hidden entirely.
   */
  decorative?: boolean;
  className?: string;
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function ItemRun({ items, separator }: { items: string[]; separator: string }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className={styles.separator}>
            {separator}
          </span>
          <span>{item}</span>
        </Fragment>
      ))}
    </>
  );
}

export function Marquee({
  items,
  direction = "left",
  speed = 40,
  tone = "marigold",
  separator = "✱",
  decorative = true,
  className,
}: MarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  // How many times `items` must repeat to build one "unit" at least as wide
  // as the viewport. The track renders exactly two of these units back to
  // back, so translating it by -50% always hands off from one full-width
  // unit to an identical one — no gap, however wide the screen gets.
  // 1 is the floor (a single raw `items` pass) until we can measure.
  const [unitRepeat, setUnitRepeat] = useState(1);

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    const measure = measureRef.current;
    if (!viewport || !measure) return;

    const recalc = () => {
      const singlePassWidth = measure.scrollWidth;
      const viewportWidth = viewport.clientWidth;
      if (singlePassWidth === 0) return;
      setUnitRepeat(Math.max(1, Math.ceil(viewportWidth / singlePassWidth)));
    };

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(viewport);
    return () => observer.disconnect();
    // measureRef's content (one `items` pass) never changes shape once
    // items/separator are fixed, so re-running only on those plus resize
    // is enough — no dependency on unitRepeat itself.
  }, [items, separator]);

  // Duration scales with unitRepeat so the per-item scroll speed stays
  // constant at `speed` regardless of how many copies ultrawide needed.
  const duration = speed * unitRepeat;
  const staticMessage = items.join(` ${separator} `);

  return (
    <div
      className={[styles.marquee, styles[tone], className].filter(Boolean).join(" ")}
      data-direction={direction}
    >
      <Grain scope="panel" intensity="subtle" className={styles.grain} />

      {/* Announced once, as plain text, when this instance carries real
          information (e.g. the shipping threshold). The scrolling copy
          below is aria-hidden in every case so screen readers never get
          the duplicated/looping track. */}
      {!decorative && <p className={styles.srMessage}>{staticMessage}</p>}

      <div className={styles.viewport} ref={viewportRef} aria-hidden="true">
        {/* Off-screen, single-pass, unstyled-width probe. Not part of the
            visible track — exists purely so ResizeObserver can tell us how
            wide one `items` pass is. */}
        <div className={styles.measure} ref={measureRef}>
          <ItemRun items={items} separator={separator} />
        </div>

        <div
          className={styles.track}
          style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
        >
          <div className={styles.unit}>
            {Array.from({ length: unitRepeat }, (_, r) => (
              <ItemRun key={r} items={items} separator={separator} />
            ))}
          </div>
          <div className={styles.unit}>
            {Array.from({ length: unitRepeat }, (_, r) => (
              <ItemRun key={r} items={items} separator={separator} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.staticMessage} aria-hidden="true">
        {staticMessage}
      </div>
    </div>
  );
}
