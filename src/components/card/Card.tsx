import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  ReactNode,
} from "react";
import { Grain } from "@/components/grain/Grain";
import styles from "./card.module.css";

export type CardElevation = "flat" | "raised" | "floating";
export type CardPadding = "none" | "sm" | "md" | "lg";

type BaseProps = {
  /** Shadow depth. 'flat' has none, 'raised' is --shadow, 'floating' is --shadow-lg. */
  elevation?: CardElevation;
  /**
   * Token for the hard-offset shadow colour, e.g. "ink" (default) or a
   * flavour's own shadow token name, e.g. "pataka" -> var(--pataka-sh).
   */
  shadowColor?: string;
  /** Makes the whole card a single focusable, clickable element. Never put a button inside. */
  interactive?: boolean;
  /** Static rotation in degrees, applied via transform. Default 0 (no tilt). */
  tilt?: number;
  padding?: CardPadding;
  children?: ReactNode;
  className?: string;
};

type PolymorphicProps<E extends ElementType> = BaseProps & {
  as?: E;
} & Omit<
    E extends "a"
      ? AnchorHTMLAttributes<HTMLAnchorElement>
      : E extends "button"
        ? ButtonHTMLAttributes<HTMLButtonElement>
        : Record<string, unknown>,
    keyof BaseProps | "as"
  >;

export type CardProps<E extends ElementType = "div"> = PolymorphicProps<E>;

export function Card<E extends ElementType = "div">({
  as,
  elevation = "raised",
  shadowColor = "ink",
  interactive = false,
  tilt = 0,
  padding = "md",
  children,
  className,
  ...rest
}: CardProps<E>) {
  // Interactive cards must be a single focusable element with one clear
  // action (see nested-interactive note in the design doc). If the caller
  // hasn't picked an element, default to <button> so keyboard/AT support is
  // automatic instead of relying on a div+role+tabIndex shim.
  const Component = (as ?? (interactive ? "button" : "div")) as ElementType;
  const isNativeButton = Component === "button";

  const classes = [
    styles.card,
    styles[elevation],
    interactive ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // "ink" (the default) has no matching --ink-sh token, so it resolves to
  // var(--ink) directly; every flavour instead names its own -sh shadow
  // token (e.g. shadowColor="pataka" -> var(--pataka-sh)).
  const style = {
    "--card-shadow-color": shadowColor === "ink" ? "var(--ink)" : `var(--${shadowColor}-sh)`,
    "--card-tilt": `${tilt}deg`,
    padding: padding === "none" ? 0 : `var(--card-padding-${padding})`,
  } as React.CSSProperties;

  return (
    <Component
      className={classes}
      style={style}
      type={isNativeButton ? ((rest as { type?: string }).type ?? "button") : undefined}
      {...rest}
    >
      {children}
      <Grain scope="panel" intensity="subtle" className={styles.grain} />
    </Component>
  );
}
