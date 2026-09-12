"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Flavour } from "@/data/flavours";
import { Grain } from "@/components/grain/Grain";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import { MakhanaPuff } from "@/components/makhana-puff/MakhanaPuff";
import { HeatMeter } from "@/components/heat-meter/HeatMeter";
import styles from "./flavour-column.module.css";

interface FlavourColumnProps {
  flavour: Flavour;
  /** 0-based position in the row, used for the "01 / 04" index label. */
  index: number;
  total: number;
  onNotify?: (slug: Flavour["slug"]) => void;
  className?: string;
}

// Kept in sync with the --debounce-hover-* tokens in tokens.css. Read as
// numbers here because setTimeout can't consume a CSS custom property.
const HOVER_IN_MS = 90;
const HOVER_OUT_MS = 90;
const PARTICLE_COUNT = 9;
const PARTICLE_LIFETIME_MS = 700;
const PUFF_SHAPES = ["a", "b", "c"] as const;

let puffUid = 0;

export function FlavourColumn({ flavour, index, total, onNotify, className }: FlavourColumnProps) {
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [particles, setParticles] = useState<{ id: number; shape: (typeof PUFF_SHAPES)[number]; drift: number }[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // One timeout per live particle so each can be individually cleared on
  // unmount — clearing only the array reference would leak the timers.
  const particleTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  // Guards the burst so a debounced hover-in that lands while the column is
  // still expanded from a prior focus (or vice versa) doesn't double-fire.
  const hasBurstRef = useRef(false);

  const expanded = hovering || focused;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearAllParticleTimers = useCallback(() => {
    particleTimers.current.forEach(clearTimeout);
    particleTimers.current.clear();
  }, []);

  const burst = useCallback(() => {
    if (reducedMotion || hasBurstRef.current) return;
    hasBurstRef.current = true;
    clearAllParticleTimers();
    const next = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: puffUid++,
      shape: PUFF_SHAPES[i % PUFF_SHAPES.length],
      drift: (i - (PARTICLE_COUNT - 1) / 2) * 14,
    }));
    setParticles(next);
    next.forEach((p) => {
      const timer = setTimeout(() => {
        particleTimers.current.delete(p.id);
        setParticles((cur) => cur.filter((c) => c.id !== p.id));
      }, PARTICLE_LIFETIME_MS);
      particleTimers.current.set(p.id, timer);
    });
  }, [reducedMotion, clearAllParticleTimers]);

  useEffect(() => {
    if (expanded) burst();
    else hasBurstRef.current = false;
  }, [expanded, burst]);

  // Unmount: flush every pending particle timer and any in-flight hover
  // debounce so nothing fires setState after this column is gone.
  useEffect(
    () => () => {
      clearAllParticleTimers();
      if (enterTimer.current) clearTimeout(enterTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    [clearAllParticleTimers]
  );

  const handlePointerEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
      return; // re-entered before the leave debounce fired — still hovering, nothing to do
    }
    if (enterTimer.current) return;
    enterTimer.current = setTimeout(() => {
      enterTimer.current = null;
      setHovering(true);
    }, HOVER_IN_MS);
  };

  const handlePointerLeave = () => {
    if (enterTimer.current) {
      clearTimeout(enterTimer.current);
      enterTimer.current = null;
      return; // left before the enter debounce fired — it never expanded, nothing to undo
    }
    if (leaveTimer.current) return;
    leaveTimer.current = setTimeout(() => {
      leaveTimer.current = null;
      setHovering(false);
    }, HOVER_OUT_MS);
  };

  return (
    <div
      className={[styles.column, expanded ? styles.expanded : "", className].filter(Boolean).join(" ")}
      data-theme={flavour.theme}
      style={{ color: `var(--${flavour.theme}-on)` }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <a href={`#${flavour.slug}`} className={styles.hit}>
        <span className={styles.index}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className={styles.mascotWrap}>
          <MascotAvatar flavour={flavour.theme} size={88} animateIdle={expanded} className={styles.mascot} />
        </span>
        <span className={styles.name}>{flavour.short}</span>
        <span className={styles.descriptor}>{flavour.flavour}</span>
        <HeatMeter value={flavour.heat} size="sm" className={styles.heat} />
      </a>
      <button
        type="button"
        className={styles.notify}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNotify?.(flavour.slug);
        }}
      >
        Notify Me →
      </button>
      <Grain scope="panel" intensity="default" className={styles.grain} />
      <div className={styles.puffs} aria-hidden="true">
        {particles.map((p) => (
          <span key={p.id} className={styles.puffSlot} style={{ "--puff-x": `${p.drift}px` } as React.CSSProperties}>
            <MakhanaPuff size={18} shape={p.shape} className={styles.puff} />
          </span>
        ))}
      </div>
    </div>
  );
}
