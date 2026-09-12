"use client";

import { Button } from "@/components/button/Button";
import { useToast } from "@/components/toast/ToastProvider";

export function ToastStory() {
  const toast = useToast();

  return (
    <section style={{ padding: "var(--s-6)", display: "grid", gap: "var(--s-5)" }}>
      <h2>Toast</h2>
      <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
        <Button onClick={() => toast({ message: "Link copied" })}>Default</Button>
        <Button onClick={() => toast({ message: "Order confirm ho gaya", tone: "success" })}>
          Success
        </Button>
        <Button
          variant="danger"
          onClick={() => toast({ message: "Kuch gadbad ho gaya, phir try karo", tone: "error" })}
        >
          Error
        </Button>
        <Button
          onClick={() =>
            toast({
              message: "Item hata diya",
              action: { label: "Undo", onAction: () => toast({ message: "Wapas aa gaya" }) },
            })
          }
        >
          With action
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            toast({ message: "Line mein lag gaye ho" });
            toast({ message: "Ek aur message" });
            toast({ message: "Teesra message" });
          }}
        >
          Queue three
        </Button>
      </div>
    </section>
  );
}
