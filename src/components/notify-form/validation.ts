import type { FlavourSlug } from "@/data/flavours";

export interface NotifyFormValues {
  email: string;
  phone: string;
  flavourSlugs: FlavourSlug[];
  pinCode: string;
  consent: boolean;
  honeypot: string;
}

export type NotifyFormField = "email" | "phone" | "flavourSlugs" | "pinCode" | "consent";

export type NotifyFormErrors = Partial<Record<NotifyFormField, string>>;

// Same 6-9 first-digit, 10-digit rule Indian telcos use for mobile ranges.
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_CODE = /^\d{6}$/;

// Standalone so any other email field (e.g. the footer newsletter) can
// reuse the exact same rule instead of re-implementing the regex.
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "required";
  if (!EMAIL.test(trimmed)) return "That email looks... unusual. Mind checking?";
  return undefined;
}

// Order here doubles as the DOM/focus order used on failed submit.
export const FIELD_ORDER: NotifyFormField[] = [
  "email",
  "phone",
  "pinCode",
  "flavourSlugs",
  "consent",
];

export function validateField(field: NotifyFormField, values: NotifyFormValues): string | undefined {
  switch (field) {
    case "email":
      return validateEmail(values.email);
    case "phone": {
      const value = values.phone.trim();
      if (!value) return undefined;
      if (!INDIAN_MOBILE.test(value)) return "10 digits, please.";
      return undefined;
    }
    case "pinCode": {
      const value = values.pinCode.trim();
      if (!value) return undefined;
      if (!PIN_CODE.test(value)) return "6 digits for the pin code.";
      return undefined;
    }
    case "flavourSlugs":
      return values.flavourSlugs.length === 0 ? "Pick at least one flavour, na." : undefined;
    case "consent":
      return values.consent ? undefined : "We need this to email you. That's kind of the point.";
    default:
      return undefined;
  }
}

export function validateAll(values: NotifyFormValues): NotifyFormErrors {
  const errors: NotifyFormErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
}

export function isBot(values: NotifyFormValues): boolean {
  return values.honeypot.trim().length > 0;
}
