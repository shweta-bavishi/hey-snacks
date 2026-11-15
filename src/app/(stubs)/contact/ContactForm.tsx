"use client";

import { FormEvent, useId, useState } from "react";
import posthog from "posthog-js";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { validateEmail } from "@/components/notify-form/validation";
import { useToast } from "@/components/toast/ToastProvider";
import { sendContactMessage } from "@/lib/mock-api";
import styles from "./contact.module.css";

type Errors = { name?: string; email?: string; message?: string };

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const messageId = useId();
  const toast = useToast();

  const validate = (): Errors => ({
    name: name.trim() ? undefined : "required",
    email: validateEmail(email),
    message: message.trim() ? undefined : "required",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const next = validate();
    setErrors(next);
    if (next.name || next.email || next.message) return;

    setSubmitting(true);
    try {
      await sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
      setName("");
      setEmail("");
      setMessage("");
      posthog.capture("contact_message_sent");
      toast({ message: "Message sent. We'll get back to you soon.", tone: "success" });
    } catch {
      toast({ message: "Could not send your message. Please try again.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        disabled={submitting}
      />
      <Input
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={submitting}
      />
      <div className={styles.textareaField}>
        <label htmlFor={messageId} className={styles.textareaLabel}>
          Message
        </label>
        <textarea
          id={messageId}
          className={styles.textarea}
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          disabled={submitting}
        />
        {errors.message && <span className={styles.textareaError}>{errors.message}</span>}
      </div>
      <Button type="submit" loading={submitting}>
        Send message
      </Button>
    </form>
  );
}
