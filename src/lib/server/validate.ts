import { FLAVOURS, type FlavourSlug } from "@/data/flavours";

// Mirrors the client rules in components/notify-form/validation.ts. The
// client is a convenience; this is the check that counts.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const PIN_CODE = /^\d{6}$/;

const SLUGS = new Set<string>(FLAVOURS.map((f) => f.slug));

type Record_ = Record<string, unknown>;
const isRecord = (v: unknown): v is Record_ => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type Result<T> = { ok: true; value: T } | { ok: false };

export type Utm = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

function readUtm(raw: unknown): Utm {
  if (!isRecord(raw)) return {};
  const out: Utm = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    const value = str(raw[key], 100);
    if (value) out[key] = value;
  }
  return out;
}

export type NotifyInput = {
  email: string;
  phone?: string;
  pinCode?: string;
  flavourSlugs: FlavourSlug[];
  source?: string;
  honeypot: string;
  turnstileToken: string;
  utm: Utm;
};

export function parseNotify(raw: unknown): Result<NotifyInput> {
  if (!isRecord(raw)) return { ok: false };
  const email = str(raw.email, 254).toLowerCase();
  const phone = str(raw.phone, 10);
  const pinCode = str(raw.pinCode, 6);
  const slugs = Array.isArray(raw.flavourSlugs) ? raw.flavourSlugs : [];
  const flavourSlugs = [...new Set(slugs.filter((s): s is FlavourSlug => typeof s === "string" && SLUGS.has(s)))];

  if (!EMAIL.test(email)) return { ok: false };
  if (phone && !INDIAN_MOBILE.test(phone)) return { ok: false };
  if (pinCode && !PIN_CODE.test(pinCode)) return { ok: false };
  if (flavourSlugs.length === 0) return { ok: false };
  if (raw.consent !== true) return { ok: false };

  return {
    ok: true,
    value: {
      email,
      phone: phone || undefined,
      pinCode: pinCode || undefined,
      flavourSlugs,
      source: str(raw.source, 40) || undefined,
      honeypot: str(raw.honeypot, 200),
      turnstileToken: str(raw.turnstileToken, 2048),
      utm: readUtm(raw.utm),
    },
  };
}

export type ConnectInput = { email: string; phone: string; flavourSlug?: FlavourSlug; utm: Utm };

export function parseConnect(raw: unknown): Result<ConnectInput> {
  if (!isRecord(raw)) return { ok: false };
  const email = str(raw.email, 254).toLowerCase();
  const phone = str(raw.phone, 10);
  const slug = str(raw.flavourSlug, 40);
  if (!EMAIL.test(email) || !INDIAN_MOBILE.test(phone)) return { ok: false };
  return {
    ok: true,
    value: { email, phone, flavourSlug: SLUGS.has(slug) ? (slug as FlavourSlug) : undefined, utm: readUtm(raw.utm) },
  };
}

export type ContactInput = { name: string; email: string; message: string };

export function parseContact(raw: unknown): Result<ContactInput> {
  if (!isRecord(raw)) return { ok: false };
  const name = str(raw.name, 100);
  const email = str(raw.email, 254).toLowerCase();
  const message = str(raw.message, 2000);
  if (!name || !message || !EMAIL.test(email)) return { ok: false };
  return { ok: true, value: { name, email, message } };
}
