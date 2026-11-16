"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import posthog from "posthog-js";
import { useConsent } from "@/lib/consent";
import { captureUtm } from "@/lib/utm";

// Public IDs by design. Leave either unset and that tool simply never loads
// (local dev, preview deploys).
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Renders nothing visible. Mounts PostHog and the Meta pixel only after the
 * visitor accepts. Declining (or not answering) loads zero third-party code.
 */
export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();

  useEffect(() => {
    captureUtm(window.location.search);
  }, []);

  // PostHog is the one place posthog-js is initialised, and only on consent
  // (instrumentation-client.ts used to start it on every load). Until then
  // posthog.capture() calls elsewhere are harmless no-ops.
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (consent === "granted") {
      if (posthog.__loaded) {
        posthog.opt_in_capturing();
      } else {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          defaults: "2025-05-24",
          person_profiles: "identified_only",
          capture_exceptions: true,
          debug: process.env.NODE_ENV === "development",
        });
      }
    } else if (consent === "denied" && posthog.__loaded) {
      posthog.opt_out_capturing();
    }
  }, [consent]);

  // PostHog tracks history changes itself (defaults 2025-05-24); the pixel
  // needs a nudge per route.
  useEffect(() => {
    if (consent === "granted" && META_PIXEL_ID) window.fbq?.("track", "PageView");
  }, [consent, pathname]);

  if (consent !== "granted") return null;

  return (
    <>
      {META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');`}
        </Script>
      ) : null}
    </>
  );
}
