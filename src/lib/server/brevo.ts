// Server-only. Brevo is best-effort: Supabase is the source of truth, so a
// Brevo outage must never fail a signup. Every function here swallows and
// logs its own errors.

const BREVO_API = "https://api.brevo.com/v3";

function apiKey(): string | undefined {
  return process.env.BREVO_API_KEY || undefined;
}

async function brevo(path: string, body: unknown): Promise<Response> {
  return fetch(`${BREVO_API}${path}`, {
    method: "POST",
    headers: { "api-key": apiKey() ?? "", "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

export type BrevoContact = {
  email: string;
  /** 10-digit Indian mobile. Sent to Brevo as +91XXXXXXXXXX. */
  phone?: string;
  flavourNames?: string[];
  pinCode?: string;
};

/** Adds or updates a contact on the launch list. */
export async function addBrevoContact(contact: BrevoContact): Promise<void> {
  if (!apiKey()) return;
  const listId = Number(process.env.BREVO_LIST_ID);
  const listIds = Number.isInteger(listId) && listId > 0 ? [listId] : undefined;

  const attributes: Record<string, string> = {};
  if (contact.phone) attributes.SMS = `+91${contact.phone}`;
  if (contact.flavourNames?.length) attributes.FLAVOURS = contact.flavourNames.join(", ");
  if (contact.pinCode) attributes.PIN_CODE = contact.pinCode;

  // First try with attributes. If Brevo rejects (attribute not created yet,
  // or that phone already belongs to another contact), retry with just the
  // email so the signup still lands on the list.
  const attempts = [{ email: contact.email, attributes, listIds, updateEnabled: true }, { email: contact.email, listIds, updateEnabled: true }];
  for (const payload of attempts) {
    try {
      const response = await brevo("/contacts", payload);
      if (response.ok) return;
      console.error("[brevo] add contact failed", response.status, (await response.text()).slice(0, 300));
    } catch (error) {
      console.error("[brevo] add contact error", error);
    }
  }
}

type Email = { to: string; subject: string; html: string; replyTo?: string };

export async function sendBrevoEmail({ to, subject, html, replyTo }: Email): Promise<void> {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey() || !senderEmail) return;
  try {
    const response = await brevo("/smtp/email", {
      sender: { email: senderEmail, name: process.env.BREVO_SENDER_NAME || "hey." },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    });
    if (!response.ok) {
      console.error("[brevo] send email failed", response.status, (await response.text()).slice(0, 300));
    }
  } catch (error) {
    console.error("[brevo] send email error", error);
  }
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
