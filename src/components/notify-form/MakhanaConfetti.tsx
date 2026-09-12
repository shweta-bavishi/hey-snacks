"use client";

import { useEffect, useMemo, useState } from "react";
import { MakhanaPuff, MakhanaPuffShape } from "@/components/makhana-puff/MakhanaPuff";
import styles from "./notify-form.module.css";

const SHAPES: MakhanaPuffShape[] = ["a", "b", "c"];
const PARTICLE_COUNT = 30;
// Long enough to clear the burst animation, short enough that a fast
// repeat submit (retry after duplicate) doesn't stack layers.
const LIFETIME_MS = 1400;

interface Particle {
  id: number;
  left: number;
  delay: number;
  drift: number;
  rotation: number;
  shape: MakhanaPuffShape;
}

function makeParticles(seed: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: seed * 1000 + i,
    left: Math.random() * 100,
    delay: Math.random() * 120,
    drift: (Math.random() - 0.5) * 120,
    rotation: Math.random() * 360,
    shape: SHAPES[i % SHAPES.length],
  }));
}

/**
 * Fires once per change of `triggerKey` (bump it from the parent on a
 * confirmed non-duplicate success). Reduced-motion: renders nothing — the
 * toast + live region already carry the "you're in" news, so the particles
 * are pure decoration, not information.
 */
// Keyed by the parent on `triggerKey` (like Toast keys its exit animation
// by id) so each burst is a fresh mount — no need to reset state by hand.
export function MakhanaConfetti({ triggerKey }: { triggerKey: number }) {
  const [burstExpired, setBurstExpired] = useState(false);
  const particles = useMemo(() => (triggerKey === 0 ? [] : makeParticles(triggerKey)), [triggerKey]);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => setBurstExpired(true), LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [particles]);

  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (particles.length === 0 || burstExpired || reducedMotion) return null;

  return (
    <div className={styles.confetti} aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={styles.confettiParticle}
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}ms`,
            // @ts-expect-error -- custom property, read by the keyframes in notify-form.module.css
            "--drift": `${particle.drift}px`,
          }}
        >
          <MakhanaPuff size={12} rotation={particle.rotation} shape={particle.shape} />
        </span>
      ))}
    </div>
  );
}
