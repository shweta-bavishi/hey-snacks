"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import type { Flavour } from "@/data/flavours";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import mascotStyles from "@/components/mascot-avatar/mascot-avatar.module.css";
import { validateEmail } from "@/components/notify-form/validation";
import { useToast } from "@/components/toast/ToastProvider";
import styles from "./footer.module.css";

interface FooterLinkItem {
  label: string;
  /**
   * "#id" jumps within the page, "/path" is a route. Leave it out while a
   * destination doesn't exist yet: the label still shows, but as plain text
   * that goes nowhere, instead of a link that dead-ends or 404s.
   */
  href?: string;
}

const INFO_LINKS: FooterLinkItem[] = [
  { label: "About", href: "/about" },
  { label: "Store Locator", href: "/store-locator" },
  { label: "FAQ", href: "#faq" },
];

// No pages behind these yet. Add an href the day each one exists.
const SUPPORT_LINKS: FooterLinkItem[] = [
  { label: "Contact" },
  { label: "Shipping" },
  { label: "Returns" },
  { label: "Privacy" },
  { label: "Terms" },
];

interface SocialItem {
  name: string;
  glyph: string;
  /** Profile URL. Leave it out until the account is live. */
  href?: string;
}

// TikTok is deliberately absent: it has been banned in India since 2020.
const SOCIALS: SocialItem[] = [
  { name: "Instagram", glyph: "IG" },
  { name: "YouTube", glyph: "YT" },
  { name: "WhatsApp", glyph: "WA" },
];

function FooterLink({ item }: { item: FooterLinkItem }) {
  if (!item.href) {
    return <span className={styles.linkInert}>{item.label}</span>;
  }
  if (item.href.startsWith("/")) {
    return (
      <Link className={styles.link} href={item.href}>
        {item.label}
      </Link>
    );
  }
  return (
    <a className={styles.link} href={item.href}>
      {item.label}
    </a>
  );
}

export interface FooterProps {
  /** Never hardcoded — comes from src/data/flavours.ts. */
  flavours: Flavour[];
  /** Injected network call, same shape as NotifyForm's onSubmit. */
  onSubscribe: (email: string) => Promise<void>;
  className?: string;
}

type SubscribePhase = "idle" | "submitting";

export function Footer({ flavours, onSubscribe, className }: FooterProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [phase, setPhase] = useState<SubscribePhase>("idle");
  const formId = useId();
  const toast = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase === "submitting") return;

    const nextError = validateEmail(email);
    setError(nextError);
    if (nextError) return;

    setPhase("submitting");
    try {
      await onSubscribe(email.trim());
      setEmail("");
      toast({ message: "You're on the list.", tone: "success" });
    } catch {
      toast({
        message: "Us tak nahi pahunch paaya. Try again?",
        tone: "error",
      });
    } finally {
      setPhase("idle");
    }
  };

  return (
    <footer className={[styles.footer, className].filter(Boolean).join(" ")}>
      <div className={styles.wordmarkCrop} aria-hidden="true">
        <span className={styles.wordmark}>hey.</span>
      </div>

      <div className={styles.inner}>
        <div className={styles.columns}>
          <nav className={styles.column} aria-label="Shop">
            <h2 className={styles.columnHeading}>Shop</h2>
            <ul className={styles.linkList}>
              {flavours.map((flavour) => (
                <li key={flavour.slug}>
                  <a className={styles.link} href={`#shop-${flavour.slug}`}>
                    {flavour.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-label="Info">
            <h2 className={styles.columnHeading}>Info</h2>
            <ul className={styles.linkList}>
              {INFO_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-label="Support">
            <h2 className={styles.columnHeading}>Support</h2>
            <ul className={styles.linkList}>
              {SUPPORT_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <h2 className={styles.columnHeading}>Newsletter</h2>
            <p className={styles.newsletterCopy}>
              Get the drop before everyone else.
            </p>
            <form
              className={styles.newsletterForm}
              onSubmit={handleSubmit}
              noValidate
            >
              <Input
                id={`${formId}-newsletter-email`}
                type="email"
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(validateEmail(e.target.value));
                }}
                error={error}
                className={styles.newsletterInput}
                disabled={phase === "submitting"}
              />
              <Button
                type="submit"
                iconOnly
                loading={phase === "submitting"}
                aria-label="Subscribe"
                className={styles.newsletterSubmit}
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <ul className={styles.socialRow} aria-label="Follow hey.">
          {SOCIALS.map((social) => (
            <li key={social.name}>
              {social.href ? (
                <a
                  className={styles.socialSticker}
                  href={social.href}
                  aria-label={social.name}
                >
                  <span aria-hidden="true">{social.glyph}</span>
                </a>
              ) : (
                <span className={styles.socialSticker} data-inert="true">
                  <span aria-hidden="true">{social.glyph}</span>
                  <span className={styles.srOnly}>{social.name}, coming soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={[styles.mascotRow, mascotStyles.mascotHoverScope].join(" ")}
        aria-hidden="true"
      >
        {flavours.map((flavour) => (
          <MascotAvatar
            key={flavour.slug}
            flavour={flavour.theme}
            size={88}
            animateIdle
          />
        ))}
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.bottomBarText}>
          © hey. 2026 ✱ MADE WITH DIL SE LOVE ✱ BIHAR → YOUR FACE
        </p>
      </div>
    </footer>
  );
}
