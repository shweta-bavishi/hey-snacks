"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { FlavourSlug } from "@/data/flavours";
import { FLAVOURS } from "@/data/flavours";
import { Modal } from "@/components/modal/Modal";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import { NotifyForm, NotifyResult } from "./NotifyForm";
import { notifyMe, getTurnstileToken } from "@/lib/mock-api";
import { BATCH, JOIN_LABEL } from "@/data/launch";

// Every CTA on the page — hero, flavour columns, shop cards, sticky mobile
// bar — opens the *same* Notify Me modal instance instead of each owning
// its own Modal + NotifyForm tree. `source` is threaded straight through to
// onSubmit's payload (unused by the mock API today, but kept so swapping in
// the real POST /api/notify later needs no call-site changes).
export type NotifySource = "hero" | "flavour_column" | "shop_card" | "variety_pack" | "sticky_bar" | "jar_finale";

interface NotifyModalContextValue {
  /**
   * Opens the shared modal pre-checked for `slug`. The returned promise
   * resolves once the user successfully submits (so a caller like
   * ProductCard can flip to its ticket face) and rejects if the modal is
   * closed first.
   */
  openNotify: (slug: FlavourSlug, source: NotifySource) => Promise<NotifyResult>;
}

const NotifyModalContext = createContext<NotifyModalContextValue | null>(null);

export function useNotifyModal() {
  const ctx = useContext(NotifyModalContext);
  if (!ctx) throw new Error("useNotifyModal must be used inside NotifyModalProvider");
  return ctx;
}

export function NotifyModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState<FlavourSlug>(FLAVOURS[0].slug);
  const [source, setSource] = useState<NotifySource>("hero");
  const pendingRef = useRef<{
    resolve: (result: NotifyResult) => void;
    reject: () => void;
  } | null>(null);

  const settleAndClose = useCallback((resolved: boolean, result?: NotifyResult) => {
    if (resolved && result) pendingRef.current?.resolve(result);
    else pendingRef.current?.reject();
    pendingRef.current = null;
    setOpen(false);
  }, []);

  const openNotify = useCallback((nextSlug: FlavourSlug, nextSource: NotifySource) => {
    // A modal already open for a different card is abandoned (rejected)
    // rather than left to resolve twice.
    pendingRef.current?.reject();
    setSlug(nextSlug);
    setSource(nextSource);
    setOpen(true);
    return new Promise<NotifyResult>((resolve, reject) => {
      pendingRef.current = { resolve, reject };
    });
  }, []);

  const activeFlavour = useMemo(
    () => FLAVOURS.find((f) => f.slug === slug) ?? FLAVOURS[0],
    [slug]
  );

  const handleSubmit = useCallback(
    async (payload: Parameters<typeof notifyMe>[0]): Promise<NotifyResult> => notifyMe(payload),
    []
  );

  return (
    <NotifyModalContext.Provider value={{ openNotify }}>
      {children}
      <Modal
        open={open}
        onClose={() => settleAndClose(false)}
        title={`${JOIN_LABEL} ✱ ${BATCH.dropDateLong}`}
        size="md"
        decoration={
          <MascotAvatar flavour={activeFlavour.theme} size={56} expression="happy" alt={activeFlavour.short} />
        }
      >
        <NotifyForm
          key={`${slug}-${source}`}
          sourceSlug={slug}
          flavours={FLAVOURS}
          onSubmit={handleSubmit}
          onSuccess={(result) => settleAndClose(true, result)}
          getTurnstileToken={getTurnstileToken}
        />
      </Modal>
    </NotifyModalContext.Provider>
  );
}
