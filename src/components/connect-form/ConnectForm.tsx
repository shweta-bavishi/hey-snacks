"use client";

import { FormEvent, useId, useRef, useState } from "react";
import type { FlavourSlug } from "@/data/flavours";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { useToast } from "@/components/toast/ToastProvider";
import {
  ConnectFormErrors,
  ConnectFormField,
  ConnectFormValues,
  FIELD_ORDER,
  validateAll,
  validateField,
} from "./validation";
import styles from "./connect-form.module.css";

export interface ConnectPayload {
  email: string;
  phone: string;
  flavourSlug: FlavourSlug;
}

export interface ConnectFormProps {
  /** The flavour the user clicked "Connect With Us" from. Threaded through to onSubmit. */
  sourceSlug: FlavourSlug;
  /** Display name for the read-only "Flavour" field at the top, e.g. "Dadi Masala". */
  flavourName: string;
  onSubmit: (payload: ConnectPayload) => Promise<{ ok: true }>;
  /** Fires once the details are sent. Caller closes the modal. */
  onSuccess?: () => void;
  className?: string;
}

const EMPTY_VALUES: ConnectFormValues = { email: "", phone: "" };

type SubmitPhase = "idle" | "submitting" | "network-error";

export function ConnectForm({ sourceSlug, flavourName, onSubmit, onSuccess, className }: ConnectFormProps) {
  const [values, setValues] = useState<ConnectFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ConnectFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ConnectFormField, boolean>>>({});
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const toast = useToast();

  const fieldRefs = useRef<Partial<Record<ConnectFormField, HTMLElement | null>>>({});

  const submitting = phase === "submitting";
  const disabled = submitting;

  const setField = <K extends keyof ConnectFormValues>(field: K, value: ConnectFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as ConnectFormField] !== undefined) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field as ConnectFormField, { ...values, [field]: value }),
      }));
    }
  };

  const handleBlur = (field: ConnectFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
  };

  const focusFirstInvalid = (nextErrors: ConnectFormErrors) => {
    const firstField = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstField) fieldRefs.current[firstField]?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));

    if (Object.keys(nextErrors).length > 0) {
      focusFirstInvalid(nextErrors);
      return;
    }

    setPhase("submitting");
    try {
      await onSubmit({
        email: values.email.trim(),
        phone: values.phone.trim(),
        flavourSlug: sourceSlug,
      });

      setPhase("idle");
      toast({ message: "We'll connect with you shortly.", tone: "success" });
      onSuccess?.();
    } catch {
      setPhase("network-error");
    }
  };

  const handleRetry = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  const formId = useId();

  return (
    <form
      id={formId}
      className={[styles.form, className].filter(Boolean).join(" ")}
      aria-busy={submitting || undefined}
      onSubmit={handleSubmit}
      noValidate
    >
      <fieldset className={styles.fieldset} disabled={disabled}>
        <legend className={styles.legend}>Connect with us</legend>

        <Input type="text" label="Flavour" value={flavourName} readOnly tabIndex={-1} aria-readonly="true" />

        <Input
          ref={(el) => {
            fieldRefs.current.email = el;
          }}
          type="email"
          label="Email"
          required
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={touched.email ? errors.email : undefined}
        />

        <Input
          ref={(el) => {
            fieldRefs.current.phone = el;
          }}
          type="tel"
          label="Phone"
          required
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
          onBlur={() => handleBlur("phone")}
          error={touched.phone ? errors.phone : undefined}
        />

        {phase === "network-error" && (
          <div className={styles.retryBanner} role="alert">
            <span>Us tak nahi pahunch paaya. Try again?</span>
            <button type="button" className={styles.retryButton} onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        <Button type="submit" loading={submitting} className={styles.submit}>
          Send details
        </Button>
      </fieldset>
    </form>
  );
}
