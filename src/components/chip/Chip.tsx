"use client";

import {
  ButtonHTMLAttributes,
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useId,
  useState,
} from "react";
import { Grain } from "@/components/grain/Grain";
import styles from "./chip.module.css";

export type ChipTheme = "pataka" | "malai" | "jaadu" | "pehelwan";

type BaseProps = {
  /** Flavour identity. Colours the chip regardless of the page's active --accent. */
  theme: ChipTheme;
  selected: boolean;
  /** Fires with the next selected state; use instead of onClick to toggle. */
  onToggle?: (selected: boolean) => void;
  /** 20px mascot avatar, leading. */
  avatarSrc?: string;
  avatarAlt?: string;
  /** Trailing count or percentage, e.g. "42%" — poll variant. */
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  /** @internal set by ChipGroup for roving-tabindex. Not part of the public API. */
  __tabIndex?: number;
};

export type ChipProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "onClick">;

export function Chip({
  theme,
  selected,
  onToggle,
  avatarSrc,
  avatarAlt = "",
  meta,
  children,
  className,
  disabled,
  __tabIndex,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-theme={theme}
      disabled={disabled}
      tabIndex={__tabIndex}
      className={[styles.chip, className].filter(Boolean).join(" ")}
      onClick={() => onToggle?.(!selected)}
      {...rest}
    >
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarSrc} alt={avatarAlt} className={styles.avatar} aria-hidden={avatarAlt ? undefined : "true"} />
      ) : null}
      <span className={styles.label}>{children}</span>
      {meta != null ? <span className={styles.meta}>{meta}</span> : null}
      <Grain scope="panel" intensity="subtle" className={styles.grain} />
    </button>
  );
}

// ---- ChipGroup: role=group + roving-tabindex arrow-key navigation ----
// Space/Enter toggling comes for free from each Chip being a native <button>;
// this only owns which chip is Tab-reachable and moves focus on arrows.
// Focus/keydown are handled via delegation on the container (querying its
// own DOM in the event handler), not per-chip refs read during render.

const CHIP_SELECTOR = "[data-theme]:not(:disabled)";

export function ChipGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const groupId = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  const items = Children.toArray(children).filter((child): child is ReactElement<ChipProps> => isValidElement(child));

  const cloned = items.map((child, index) =>
    cloneElement(child, {
      key: child.key ?? index,
      __tabIndex: index === activeIndex ? 0 : -1,
    })
  );

  // Delegated on the container (not per-chip refs) so focus/keydown handling
  // never needs to read a ref during render.
  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const chips = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(CHIP_SELECTOR));
    const index = chips.indexOf(e.target as unknown as HTMLButtonElement);
    if (index !== -1) setActiveIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const chips = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(CHIP_SELECTOR));
    const currentIndex = chips.indexOf(e.target as unknown as HTMLButtonElement);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIndex = (currentIndex + 1) % chips.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIndex = (currentIndex - 1 + chips.length) % chips.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = chips.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      setActiveIndex(nextIndex);
      chips[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label={label}
      id={groupId}
      className={[styles.group, className].filter(Boolean).join(" ")}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    >
      {cloned}
    </div>
  );
}
