import { useSyncExternalStore } from "react";

/**
 * Analytics consent. One key, two real answers. Nothing that sets a cookie
 * (PostHog, Meta pixel) loads until the visitor says "granted".
 *
 * "unknown" is what the server (and first hydration pass) renders, before
 * storage has been read, so a returning visitor who already answered never
 * sees the notice flash in. "pending" means storage was read and is empty.
 */
export type ConsentState = "unknown" | "pending" | "granted" | "denied";

export const CONSENT_STORAGE_KEY = "hey-consent";
const CONSENT_EVENT = "hey-consent-change";
// Set while the visitor re-opens the notice from the footer.
const REOPEN_EVENT = "hey-consent-reopen";

function readStored(): ConsentState {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "pending";
  } catch {
    // Storage blocked (private mode, strict settings): treat as unanswered.
    return "pending";
  }
}

export function setConsent(next: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, next);
  } catch {
    // Still notify listeners so this tab honours the choice.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Footer "Cookie settings": asks the notice to show again. */
export function reopenConsent() {
  window.dispatchEvent(new Event(REOPEN_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, readStored, () => "unknown");
}

export function subscribeReopen(onReopen: () => void) {
  window.addEventListener(REOPEN_EVENT, onReopen);
  return () => window.removeEventListener(REOPEN_EVENT, onReopen);
}
