"use client";

import { reopenConsent } from "@/lib/consent";

/** Footer link that re-opens the cookie notice so a choice can be changed. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={reopenConsent}>
      Cookie settings
    </button>
  );
}
