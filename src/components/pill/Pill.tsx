import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Grain } from "@/components/grain/Grain";
import styles from "./pill.module.css";

export type PillVariant = "label" | "action" | "kbd";
export type PillTone = "default" | "accent" | "inverse";

type SharedProps = {
  tone?: PillTone;
  /** Leading ✱ glyph. Purely decorative, hidden from screen readers. */
  glyph?: boolean;
  children?: ReactNode;
  className?: string;
};

type LabelProps = SharedProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof SharedProps> & {
    variant?: "label";
  };

type ActionProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> & {
    variant: "action";
  };

type KbdProps = SharedProps &
  Omit<HTMLAttributes<HTMLElement>, keyof SharedProps> & {
    variant: "kbd";
  };

export type PillProps = LabelProps | ActionProps | KbdProps;

function Glyph() {
  return (
    <span className={styles.glyph} aria-hidden="true">
      ✱
    </span>
  );
}

// Tone fills (accent tint, inverse ink) are solid colour fills and need the
// grain overlay per the brand rule; the default paper fill sits on paper
// already, so it's exempt.
function ToneGrain({ tone }: { tone: PillTone }) {
  if (tone === "default") return null;
  return <Grain scope="panel" intensity="subtle" className={styles.grain} />;
}

export function Pill(props: PillProps) {
  const { variant = "label", tone = "default", glyph, children, className, ...rest } = props;
  const classes = [styles.pill, styles[variant], styles[tone], className].filter(Boolean).join(" ");

  // 'kbd': a keyboard shortcut display is not interactive and semantically
  // is a key on a keyboard — the <kbd> element is the exact HTML primitive
  // for that, and it renders with a 6px radius (var(--radius-key)) so it
  // reads as a key, not a tag.
  if (variant === "kbd") {
    const kbdRest = rest as HTMLAttributes<HTMLElement>;
    return (
      <kbd className={classes} {...kbdRest}>
        {glyph ? <Glyph /> : null}
        {children}
        <ToneGrain tone={tone} />
      </kbd>
    );
  }

  // 'action': clickable (filter chips, the SKIP link affordance, etc.) —
  // a <button> gets keyboard focus, Enter/Space activation, and the
  // disabled state for free, matching Button's interaction model.
  if (variant === "action") {
    const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button type="button" className={classes} {...buttonRest}>
        {glyph ? <Glyph /> : null}
        {children}
        <ToneGrain tone={tone} />
      </button>
    );
  }

  // 'label': static text (section eyebrows, nutrition badges) — a <span>
  // carries no interactive or landmark semantics, which is correct since
  // there's nothing to act on.
  const spanRest = rest as HTMLAttributes<HTMLSpanElement>;
  return (
    <span className={classes} {...spanRest}>
      {glyph ? <Glyph /> : null}
      {children}
      <ToneGrain tone={tone} />
    </span>
  );
}
