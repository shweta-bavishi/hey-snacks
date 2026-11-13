import type { FlavourSlug } from "@/data/flavours";
import type { NotifyPayload, NotifyResult } from "@/components/notify-form/NotifyForm";

// Every async surface on the page runs through here — deliberately fake,
// deliberately slow, deliberately capable of failing. There is no backend
// yet; this is what stands in for /api/notify, ESP subscribe, pin-code
// lookup, the poll, and Turnstile until those exist for real.

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let ticketSeed = 140;
const seenEmails = new Set<string>();

export async function notifyMe(payload: NotifyPayload): Promise<NotifyResult> {
  await wait(600);
  const email = payload.email.trim().toLowerCase();
  const duplicate = seenEmails.has(email);
  seenEmails.add(email);
  ticketSeed += 1;
  return {
    status: duplicate ? "duplicate" : "created",
    ticket: `#${String(ticketSeed).padStart(4, "0")}`,
    mergedFlavourSlugs: payload.flavourSlugs,
  };
}

export async function subscribeNewsletter(email: string): Promise<{ ok: true }> {
  await wait(500);
  if (email.trim().toLowerCase().startsWith("taken@")) {
    // Same "we already know you" branch as notifyMe, surfaced as a
    // success rather than an error — duplicates are not failures.
    return { ok: true };
  }
  return { ok: true };
}

export type PinCodeResult = "serviceable" | "waitlist";

export async function checkPinCode(pin: string): Promise<PinCodeResult> {
  await wait(400);
  if (!/^\d{6}$/.test(pin)) {
    throw new Error("That pin code looks... unusual. Mind checking?");
  }
  // Deterministic-but-fake: even first digit reads as already serviceable,
  // odd reads as "we'll tell you" — gives both UI states without a backend.
  return Number(pin[0]) % 2 === 0 ? "serviceable" : "waitlist";
}

const POLL_STORAGE_KEY = "hey-poll-votes";

export async function votePoll(option: string): Promise<Record<string, number>> {
  const raw = typeof window === "undefined" ? null : window.localStorage.getItem(POLL_STORAGE_KEY);
  const votes: Record<string, number> = raw ? JSON.parse(raw) : {};
  votes[option] = (votes[option] ?? 0) + 1;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(votes));
  }
  return votes;
}

export function readPollVotes(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(POLL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function getTurnstileToken(): Promise<string> {
  await wait(120);
  return "mock-token";
}

export interface ConnectPayload {
  email: string;
  phone: string;
  flavourSlug: FlavourSlug;
}

export async function sendConnectMessage(payload: ConnectPayload): Promise<{ ok: true }> {
  await wait(600);
  void payload;
  return { ok: true };
}

export type { FlavourSlug };
