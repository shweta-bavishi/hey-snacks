import { Header } from "@/components/header/Header";

export function HeaderStory() {
  return (
    <section style={{ marginBottom: "var(--s-8)" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)" }}>Header</h2>
      <p style={{ maxWidth: "62ch", marginBottom: "var(--s-4)" }}>
        Sticky, 72px, shrinks to 56px after 100vh of scroll (spring, instant under reduced motion). The
        `.` in the logotype reads `var(--accent)`, so it recolours with whatever section theme is active
        without any header-specific scroll logic. Resize below 640px to see the hamburger takeover.
      </p>
      <div style={{ border: "var(--stroke) solid var(--ink)", position: "relative" }}>
        <Header />
        <div style={{ height: "160vh", padding: "var(--s-5)" }}>
          Scroll this box past 100vh to see the header shrink.
        </div>
      </div>
    </section>
  );
}
