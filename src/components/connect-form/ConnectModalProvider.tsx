"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { FlavourSlug } from "@/data/flavours";
import { FLAVOURS } from "@/data/flavours";
import { Modal } from "@/components/modal/Modal";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import { ConnectForm } from "./ConnectForm";
import { sendConnectMessage } from "@/lib/api";

interface ConnectModalContextValue {
  openConnect: (slug: FlavourSlug) => void;
  /** The flavour the modal is currently open for, or null while closed — lets a
   *  caller (e.g. FlavourColumn) keep itself visually pinned/expanded for as
   *  long as its own modal instance stays open, and drop that the moment it
   *  closes for any reason (close icon, Escape, scrim click, or a successful send). */
  activeSlug: FlavourSlug | null;
}

const ConnectModalContext = createContext<ConnectModalContextValue | null>(null);

export function useConnectModal() {
  const ctx = useContext(ConnectModalContext);
  if (!ctx) throw new Error("useConnectModal must be used inside ConnectModalProvider");
  return ctx;
}

export function ConnectModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState<FlavourSlug | null>(null);

  const openConnect = useCallback((nextSlug: FlavourSlug) => {
    setSlug(nextSlug);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSlug(null);
  }, []);

  const activeFlavour = useMemo(() => FLAVOURS.find((f) => f.slug === slug) ?? null, [slug]);

  return (
    <ConnectModalContext.Provider value={{ openConnect, activeSlug: open ? slug : null }}>
      {children}
      <Modal
        open={open}
        onClose={handleClose}
        title={activeFlavour ? `Connect with us: ${activeFlavour.name}` : "Connect with us"}
        size="md"
        theme={activeFlavour?.theme}
        decoration={
          activeFlavour ? (
            <MascotAvatar flavour={activeFlavour.theme} size={56} expression="happy" alt={activeFlavour.short} />
          ) : undefined
        }
      >
        {activeFlavour && (
          <ConnectForm
            key={activeFlavour.slug}
            sourceSlug={activeFlavour.slug}
            flavourName={activeFlavour.name}
            onSubmit={sendConnectMessage}
            onSuccess={handleClose}
          />
        )}
      </Modal>
    </ConnectModalContext.Provider>
  );
}
