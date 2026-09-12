"use client";

import { FormEvent, useId, useMemo, useRef, useState } from "react";
import type { Flavour, FlavourSlug } from "@/data/flavours";
import { Input } from "@/components/input/Input";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Chip, ChipGroup } from "@/components/chip/Chip";
import { Button } from "@/components/button/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { MakhanaConfetti } from "./MakhanaConfetti";
import {
  FIELD_ORDER,
  isBot,
  NotifyFormErrors,
  NotifyFormField,
  NotifyFormValues,
  validateAll,
  validateField,
} from "./validation";
import styles from "./notify-form.module.css";

export interface NotifyPayload {
  email: string;
  phone?: string;
  flavourSlugs: FlavourSlug[];
  pinCode?: string;
  consent: true;
  honeypot: string;
  turnstileToken: string;
}

export interface NotifyResult {
  status: "created" | "duplicate";
  ticket: string;
  mergedFlavourSlugs: FlavourSlug[];
}

export type NotifyFormLayout = "full" | "compact";

export interface NotifyFormProps {
  /** All 5 fields vs. email + chips (max 3 visible fields), for the command palette. */
  layout?: NotifyFormLayout;
  /** The flavour the user clicked from. Pre-checks its chip. */
  sourceSlug: FlavourSlug;
  /** Chip options. Never hardcoded here — comes from src/data/flavours.ts. */
  flavours: Flavour[];
  /** Injected network call. Resolves with the server's outcome, or throws/rejects on network failure. */
  onSubmit: (payload: NotifyPayload) => Promise<NotifyResult>;
  /** Fires once the outcome (new or duplicate) is confirmed. Caller flips the ProductCard and closes the modal. */
  onSuccess?: (result: NotifyResult) => void;
  /** Turnstile token supplier. Invisible widget, verified server-side — this just hands back the current token. */
  getTurnstileToken: () => Promise<string>;
  className?: string;
}

const EMPTY_VALUES = (sourceSlug: FlavourSlug): NotifyFormValues => ({
  email: "",
  phone: "",
  flavourSlugs: [sourceSlug],
  pinCode: "",
  consent: false,
  honeypot: "",
});

type SubmitPhase = "idle" | "submitting" | "network-error";

export function NotifyForm({
  layout = "full",
  sourceSlug,
  flavours,
  onSubmit,
  onSuccess,
  getTurnstileToken,
  className,
}: NotifyFormProps) {
  const [values, setValues] = useState<NotifyFormValues>(() => EMPTY_VALUES(sourceSlug));
  const [errors, setErrors] = useState<NotifyFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<NotifyFormField, boolean>>>({});
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [expanded, setExpanded] = useState(layout === "full");
  const [confettiKey, setConfettiKey] = useState(0);
  const toast = useToast();

  const fieldRefs = useRef<Partial<Record<NotifyFormField, HTMLElement | null>>>({});
  const disclosureId = useId();

  const submitting = phase === "submitting";
  const disabled = submitting;

  // compact starts collapsed to email + chips; "more details" reveals the
  // rest without ever letting a submission skip required consent.
  const showFullFields = layout === "full" || expanded;

  const setField = <K extends keyof NotifyFormValues>(field: K, value: NotifyFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Once a field has shown an error, keep validating on every change so
    // the message clears the moment the user fixes it, instead of making
    // them blur again to find out.
    if (errors[field as NotifyFormField] !== undefined) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field as NotifyFormField, { ...values, [field]: value }),
      }));
    }
  };

  const handleBlur = (field: NotifyFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
  };

  const toggleFlavour = (slug: FlavourSlug, selected: boolean) => {
    setField(
      "flavourSlugs",
      selected ? [...values.flavourSlugs, slug] : values.flavourSlugs.filter((s) => s !== slug)
    );
  };

  const focusFirstInvalid = (nextErrors: NotifyFormErrors) => {
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

    // Bots that fill the honeypot see the same success UI (so they don't
    // learn they were caught) but nothing is actually sent.
    if (isBot(values)) {
      onSuccess?.({ status: "created", ticket: "#0000", mergedFlavourSlugs: values.flavourSlugs });
      return;
    }

    setPhase("submitting");
    try {
      const turnstileToken = await getTurnstileToken();
      const result = await onSubmit({
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        flavourSlugs: values.flavourSlugs,
        pinCode: values.pinCode.trim() || undefined,
        consent: true,
        honeypot: values.honeypot,
        turnstileToken,
      });

      setPhase("idle");
      toast({
        message:
          result.status === "duplicate"
            ? "Already on the list. We remember you."
            : `You're ${result.ticket} in line`,
        tone: "success",
      });
      if (result.status === "created") setConfettiKey((k) => k + 1);
      onSuccess?.(result);
    } catch {
      // Network failure: form stays open, every value stays exactly as
      // typed, and a persistent retry banner replaces the submit path.
      // Focus is left alone here — the user didn't do anything wrong.
      setPhase("network-error");
    }
  };

  const handleRetry = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  const formId = useId();

  const chipsErrorId = `${formId}-chips-error`;

  const isNewFlavour = (slug: FlavourSlug) => !values.flavourSlugs.includes(slug);

  const chipList = useMemo(() => flavours, [flavours]);

  return (
    <form
      id={formId}
      className={[styles.form, className].filter(Boolean).join(" ")}
      data-layout={layout}
      aria-busy={submitting || undefined}
      onSubmit={handleSubmit}
      noValidate
    >
      <fieldset className={styles.fieldset} disabled={disabled}>
        <legend className={styles.legend}>Notify me</legend>

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

        <div className={styles.chipsField}>
          <span className={styles.chipsLabel} id={`${formId}-chips-label`}>
            Flavour preference
          </span>
          <ChipGroup label="Flavour preference">
            {chipList.map((flavour) => (
              <Chip
                key={flavour.slug}
                theme={flavour.theme}
                selected={!isNewFlavour(flavour.slug)}
                onToggle={(selected) => toggleFlavour(flavour.slug, selected)}
                aria-describedby={errors.flavourSlugs ? chipsErrorId : undefined}
              >
                {flavour.short}
              </Chip>
            ))}
          </ChipGroup>
          {errors.flavourSlugs && touched.flavourSlugs && (
            <p id={chipsErrorId} className={styles.errorText} role="alert">
              {errors.flavourSlugs}
            </p>
          )}
        </div>

        {layout === "compact" && !expanded && (
          <button
            type="button"
            className={styles.disclosureToggle}
            aria-expanded={expanded}
            aria-controls={disclosureId}
            onClick={() => setExpanded(true)}
          >
            More details
          </button>
        )}

        {showFullFields && (
          <div id={disclosureId} className={styles.moreFields}>
            <Input
              ref={(el) => {
                fieldRefs.current.phone = el;
              }}
              type="tel"
              label="Phone"
              helperText="Optional"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => handleBlur("phone")}
              error={touched.phone ? errors.phone : undefined}
            />

            <Input
              ref={(el) => {
                fieldRefs.current.pinCode = el;
              }}
              type="pincode"
              label="Pin code"
              helperText="Optional — helps us find a store near you"
              value={values.pinCode}
              onChange={(e) => setField("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              onBlur={() => handleBlur("pinCode")}
              error={touched.pinCode ? errors.pinCode : undefined}
            />

            <Checkbox
              ref={(el) => {
                fieldRefs.current.consent = el;
              }}
              label={
                <>
                  I&apos;m okay getting an email when this drops.{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer">
                    Privacy
                  </a>
                </>
              }
              required
              checked={values.consent}
              onChange={(e) => setField("consent", e.target.checked)}
              onBlur={() => handleBlur("consent")}
              error={touched.consent ? errors.consent : undefined}
            />
          </div>
        )}

        {/* Honeypot: visually hidden but never display:none (bots skip that
            check specifically), and unreachable by Tab. */}
        <div className={styles.honeypotWrap} aria-hidden="true">
          <label htmlFor={`${formId}-website`}>Website</label>
          <input
            id={`${formId}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.honeypot}
            onChange={(e) => setField("honeypot", e.target.value)}
          />
        </div>

        {phase === "network-error" && (
          <div className={styles.retryBanner} role="alert">
            <span>Us tak nahi pahunch paaya. Try again?</span>
            <button type="button" className={styles.retryButton} onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        <Button type="submit" loading={submitting} className={styles.submit}>
          Notify me
        </Button>
      </fieldset>

      <MakhanaConfetti key={confettiKey} triggerKey={confettiKey} />
    </form>
  );
}
