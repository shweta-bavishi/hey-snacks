"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { Grain } from "@/components/grain/Grain";
import { setConsent, subscribeReopen, useConsent } from "@/lib/consent";
import styles from "./cookie-notice.module.css";

/**
 * Bottom-left notice. Accept and decline carry equal weight (both real
 * buttons, same size) so "no" is as easy as "yes". Not modal: the page stays
 * usable while it is open. Esc declines, same as the Decline button.
 */
export function CookieNotice() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const noticeRef = useRef<HTMLElement>(null);
  const open = consent === "pending" || reopened;
  useEffect(() => subscribeReopen(() => setReopened(true)), []);

  useEffect(() => {
    if (reopened) noticeRef.current?.focus();
  }, [reopened]);

  if (!open) return null;

  const answer = (next: "granted" | "denied") => {
    setConsent(next);
    setReopened(false);
  };

  return (
    <section
      ref={noticeRef}
      tabIndex={-1}
      role="region"
      aria-label="Cookie notice"
      className={styles.notice}
      onKeyDown={(event) => {
        if (event.key === "Escape" && consent !== "pending") setReopened(false);
        else if (event.key === "Escape") answer("denied");
      }}
    >
      <Grain scope="panel" intensity="subtle" />
      <p className={styles.title}>Cookies? Thodi si.</p>
      <p className={styles.body}>
        We use PostHog analytics and the Meta pixel to see which posts and pages work. Nothing loads unless you
        say yes.{" "}
        <a href="/privacy" className={styles.link}>
          Privacy policy
        </a>
      </p>
      <div className={styles.actions}>
        <Button size="sm" icon="" variant="primary" onClick={() => answer("granted")}>
          Accept
        </Button>
        <Button size="sm" icon="" variant="secondary" onClick={() => answer("denied")}>
          Decline
        </Button>
      </div>
    </section>
  );
}
