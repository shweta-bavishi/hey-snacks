export interface ConnectFormValues {
  email: string;
  phone: string;
}

export type ConnectFormField = "email" | "phone";

export type ConnectFormErrors = Partial<Record<ConnectFormField, string>>;

// Same 6-9 first-digit, 10-digit rule Indian telcos use for mobile ranges —
// kept in sync with notify-form/validation.ts's INDIAN_MOBILE.
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FIELD_ORDER: ConnectFormField[] = ["email", "phone"];

export function validateField(field: ConnectFormField, values: ConnectFormValues): string | undefined {
  switch (field) {
    case "email": {
      const value = values.email.trim();
      if (!value) return "required";
      if (!EMAIL.test(value)) return "That email looks... unusual. Mind checking?";
      return undefined;
    }
    case "phone": {
      const value = values.phone.trim();
      if (!value) return "required";
      if (!INDIAN_MOBILE.test(value)) return "10 digits, please.";
      return undefined;
    }
    default:
      return undefined;
  }
}

export function validateAll(values: ConnectFormValues): ConnectFormErrors {
  const errors: ConnectFormErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
}
