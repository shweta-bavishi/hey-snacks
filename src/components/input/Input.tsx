"use client";

import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";
import styles from "./input.module.css";

export type InputType = "text" | "email" | "tel" | "pincode";

type BaseProps = {
  /** Controls prefix, inputMode, maxLength and pattern. 'pincode' is a numeric 6-digit variant. */
  type?: InputType;
  label: ReactNode;
  /** Shown below the field. Hidden whenever an error is present. */
  helperText?: ReactNode;
  /** Shown below the field in place of helperText, in --chilli, with an inline sticker on the field. */
  error?: ReactNode;
  className?: string;
};

export type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | "size">;

const TEL_PREFIX = "+91";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    label,
    helperText,
    error,
    required,
    disabled,
    readOnly,
    id,
    className,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  // Caller owns *when* `error` becomes non-empty (validate on blur/submit,
  // never on keystroke) — this component only renders whatever it's given.
  const showError = Boolean(error);
  const describedBy = showError ? errorId : helperText ? helperId : undefined;

  const typeProps: InputHTMLAttributes<HTMLInputElement> =
    type === "email"
      ? { type: "email", inputMode: "email" }
      : type === "tel"
        ? { type: "tel", inputMode: "tel", maxLength: 10 }
        : type === "pincode"
          ? {
              type: "text",
              inputMode: "numeric",
              maxLength: 6,
              pattern: "[0-9]{6}",
            }
          : { type: "text" };

  return (
    <div
      className={[styles.field, className].filter(Boolean).join(" ")}
      data-disabled={disabled || undefined}
    >
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          <>
            <span aria-hidden="true" className={styles.asterisk}>
              *
            </span>
            <span className={styles.requiredTag}>required</span>
          </>
        )}
      </label>

      <div
        className={[
          styles.control,
          type === "tel" ? styles.hasPrefix : "",
          showError ? styles.errorState : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {type === "tel" && (
          <span className={styles.prefix} aria-hidden="true">
            {TEL_PREFIX}
          </span>
        )}
        <input
          {...typeProps}
          ref={ref}
          id={inputId}
          className={styles.input}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {showError && (
          <span className={styles.sticker} aria-hidden="true">
            !
          </span>
        )}
      </div>

      {showError ? (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className={styles.helperText}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
