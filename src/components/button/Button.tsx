import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { MakhanaPuff } from "@/components/makhana-puff/MakhanaPuff";
import { Grain } from "@/components/grain/Grain";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders as an icon-only square button. Meets the 44px touch target at every size. */
  iconOnly?: boolean;
  /** Trailing icon glyph or node. Defaults to → and is hidden while loading. */
  icon?: ReactNode;
  /** Shows a spinning MakhanaPuff in place of the trailing icon, sets aria-busy, disables the button. */
  loading?: boolean;
  children?: ReactNode;
  className?: string;
};

type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: "button";
  };

type AsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: "a";
  };

export type ButtonProps = AsButton | AsAnchor;

const DEFAULT_ICON = "→";

export function Button({
  as = "button",
  variant = "primary",
  size = "md",
  iconOnly = false,
  icon = DEFAULT_ICON,
  loading = false,
  children,
  className,
  ...rest
}: ButtonProps) {
  const { disabled: disabledProp, ...restWithoutDisabled } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;
  const disabled = as === "a" ? false : Boolean(disabledProp);
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly ? styles.iconOnly : "",
    loading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // primary/danger paint a solid --accent/--chilli fill and need the grain
  // overlay per the brand rule; secondary (paper on paper) and ghost
  // (transparent) are exempt.
  const isSolidFill = variant === "primary" || variant === "danger";

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      <span className={styles.trailing} aria-hidden={loading ? undefined : true}>
        {loading ? (
          <MakhanaPuff size={size === "sm" ? 16 : size === "lg" ? 24 : 20} className={styles.spinner} />
        ) : (
          icon
        )}
      </span>
      {isSolidFill && <Grain scope="panel" intensity="subtle" className={styles.grain} />}
    </>
  );

  if (as === "a") {
    const { href, ...anchorRest } = restWithoutDisabled as unknown as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...restWithoutDisabled}
    >
      {content}
    </button>
  );
}
