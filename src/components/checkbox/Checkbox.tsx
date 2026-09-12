"use client";

import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";
import { Grain } from "@/components/grain/Grain";
import styles from "./checkbox.module.css";

type BaseProps = {
  label: ReactNode;
  /** Shown below the field, in --chilli, with the indicator border matching. */
  error?: ReactNode;
  className?: string;
};

export type CheckboxProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | "type" | "size">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, required, disabled, id, className, onClick, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const showError = Boolean(error);

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label className={styles.row} data-disabled={disabled || undefined}>
        <input
          type="checkbox"
          ref={ref}
          id={inputId}
          className={styles.input}
          required={required}
          disabled={disabled}
          aria-required={required || undefined}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          // Clicks on nested elements (e.g. the Privacy link) bubble up to this
          // <label>, which would otherwise re-toggle the checkbox it targets.
          onClick={(e) => {
            if (e.target !== e.currentTarget && (e.target as HTMLElement).closest("a")) {
              e.preventDefault();
            }
            onClick?.(e);
          }}
          {...rest}
        />
        <span
          aria-hidden="true"
          className={[styles.indicator, showError ? styles.errorState : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <svg viewBox="0 0 24 24" className={styles.tick} fill="none">
            <path
              d="M5 12.5 L10 17 L19 6.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Grain scope="panel" intensity="subtle" className={styles.grain} />
        </span>
        <span className={styles.label}>{label}</span>
      </label>

      {showError && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
