import type { NotifyPayload, NotifyResult } from "@/components/notify-form/NotifyForm";
import type { ConnectPayload } from "@/components/connect-form/ConnectForm";
import { readStoredUtm } from "@/lib/utm";

// The real network layer. Same signatures the mock exposed, so the form
// components never knew the difference. Anything that is not a 2xx throws,
// which every form already treats as its "network error" state.
// The poll, pin-code check and newsletter stay in mock-api.ts until they
// have a backend of their own.

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`${path} failed (${response.status})`);
  return (await response.json()) as T;
}

export function notifyMe(payload: NotifyPayload): Promise<NotifyResult> {
  return post<NotifyResult>("/api/notify", { ...payload, utm: readStoredUtm() });
}

export function sendConnectMessage(payload: ConnectPayload): Promise<{ ok: true }> {
  return post<{ ok: true }>("/api/connect", { ...payload, utm: readStoredUtm() });
}

export type ContactMessagePayload = { name: string; email: string; message: string };

export function sendContactMessage(payload: ContactMessagePayload): Promise<{ ok: true }> {
  return post<{ ok: true }>("/api/contact", payload);
}
