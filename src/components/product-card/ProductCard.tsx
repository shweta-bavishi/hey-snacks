"use client";

import { useEffect, useState } from "react";
import type { Flavour } from "@/data/flavours";
import { Card } from "@/components/card/Card";
import { Stamp, stampHoverGroup } from "@/components/stamp/Stamp";
import { HeatMeter } from "@/components/heat-meter/HeatMeter";
import { Button } from "@/components/button/Button";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import styles from "./product-card.module.css";

interface StoredNotifyState {
  ticket: string;
}

function storageKey(slug: Flavour["slug"]) {
  return `hey-notify-${slug}`;
}

// Runs during render (not an effect), so the very first paint already shows
// the persisted face — no flash of the wrong side. Guarded for SSR, where
// localStorage doesn't exist; the client re-render on hydration then picks
// up the real value, which is why ProductCard is a client component.
function readStored(slug: Flavour["slug"]): StoredNotifyState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    return raw ? (JSON.parse(raw) as StoredNotifyState) : null;
  } catch {
    return null;
  }
}

function makeTicketNumber() {
  return `#${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

export interface ProductCardProps {
  flavour: Flavour;
  packImageSrc: string;
  onNotify?: (flavour: Flavour) => Promise<void> | void;
  /** Skeleton state, matching the card's exact footprint so there's no layout shift. */
  loading?: boolean;
  className?: string;
}

export function ProductCard({ flavour, packImageSrc, onNotify, loading = false, className }: ProductCardProps) {
  const [stored, setStored] = useState<StoredNotifyState | null>(() => readStored(flavour.slug));
  const [pending, setPending] = useState(false);
  // Flipped on load if persisted — set inside the same lazy initializer pass
  // as `stored`, so the flip transform is already correct before paint.
  const [isFlipped, setIsFlipped] = useState(() => readStored(flavour.slug) !== null);
  // Flipped on mount from storage must not animate. The transition rule
  // only applies once `.root[data-ready="true"]` — added after the first
  // paint has already committed the right rotateY value.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (loading) {
    return <div className={[styles.skeleton, className].filter(Boolean).join(" ")} aria-hidden="true" />;
  }

  const handleNotify = async () => {
    if (pending) return;
    setPending(true);
    try {
      await onNotify?.(flavour);
      const next = { ticket: makeTicketNumber() };
      window.localStorage.setItem(storageKey(flavour.slug), JSON.stringify(next));
      setStored(next);
      setIsFlipped(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className={[styles.root, stampHoverGroup, className].filter(Boolean).join(" ")}
      data-theme={flavour.theme}
      data-ready={ready ? "true" : undefined}
    >
      <Card shadowColor={flavour.theme} padding="none" className={styles.card}>
        <div className={styles.flipInner} data-flipped={isFlipped ? "true" : undefined}>
          <div className={styles.face} aria-hidden={isFlipped || undefined}>
            <div className={styles.imageArea} style={{ background: `var(--${flavour.theme}-tint)` }}>
              <img src={packImageSrc} alt="" className={styles.pack} />
              {!flavour.inStock && <Stamp variant="sold-out" className={styles.stamp} />}
              <MascotAvatar flavour={flavour.theme} expression="happy" size={56} className={styles.mascotPeek} />
            </div>
            <div className={styles.body}>
              <h3 className={styles.name}>{flavour.name}</h3>
              <p className={styles.meta}>{flavour.flavour.toUpperCase()} · 60G</p>
              <div className={styles.priceRow}>
                <span className={styles.mrp}>₹{flavour.mrp}</span>
                <span className={styles.price}>₹{flavour.price}</span>
              </div>
              <HeatMeter value={flavour.heat} className={styles.heat} />
              <Button
                className={styles.notify}
                loading={pending}
                onClick={handleNotify}
                tabIndex={isFlipped ? -1 : undefined}
                aria-hidden={isFlipped || undefined}
              >
                Notify Me
              </Button>
            </div>
          </div>
          <div className={styles.face} data-back aria-hidden={!isFlipped || undefined}>
            <div className={styles.backFill} style={{ background: `var(--${flavour.theme})`, color: `var(--${flavour.theme}-on)` }}>
              <div className={styles.ticketStub}>
                <span className={styles.ticketNumber}>{stored?.ticket ?? "#0000"}</span>
              </div>
              <p className={styles.backLine}>You&apos;re on the list</p>
              <MascotAvatar flavour={flavour.theme} expression="happy" size={56} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
