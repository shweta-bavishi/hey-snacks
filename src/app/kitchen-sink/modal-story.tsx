"use client";

import { useState } from "react";
import { Modal, ModalSize } from "@/components/modal/Modal";
import { Button } from "@/components/button/Button";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";

function DemoModal({ size }: { size: ModalSize }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{`Open ${size}`}</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`${size.toUpperCase()} modal`} size={size}>
        <p>Kuch bhi ho sakta hai is modal ke andar. ESC dabao ya bahar click karo band karne ke liye.</p>
        <div style={{ display: "flex", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
          <Button size="sm" onClick={() => setOpen(false)}>
            Theek hai
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

function NotifyModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open with mascot decoration</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Batayenge jab aayega"
        size="sm"
        decoration={<MascotAvatar flavour="jaadu" size={56} />}
      >
        <p>Apna email daalo, stock aate hi sabse pehle tumhe pata chalega.</p>
        <div style={{ display: "flex", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
          <Button size="sm" onClick={() => setOpen(false)}>
            Notify me
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function ModalStory() {
  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-5)" }}>
      <h2>Modal</h2>
      <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
        <DemoModal size="sm" />
        <DemoModal size="md" />
        <DemoModal size="lg" />
        <NotifyModalDemo />
      </div>
    </section>
  );
}
