import { MascotAvatar, MascotFlavour, MascotSize } from "@/components/mascot-avatar/MascotAvatar";
import styles from "@/components/mascot-avatar/mascot-avatar.module.css";

const FLAVOURS: MascotFlavour[] = ["pataka", "malai", "jaadu", "pehelwan"];
const SIZES: MascotSize[] = [20, 32, 56, 88];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-label)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--ink)",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--s-5)" }}>{children}</div>
    </div>
  );
}

export function MascotAvatarStory() {
  return (
    <div style={{ padding: "var(--s-5)", display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Mascot Avatar
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          Circular cropped mascot. One master illustration per flavour, reframed per size (head-only at 20/32px,
          head-and-shoulders at 56/88px) via CSS zoom + pan, not four separate exports.
        </p>
      </div>

      <Row label="Sizes, decorative (label already present alongside)">
        {SIZES.map((size) => (
          <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-1)" }}>
            <MascotAvatar flavour="pataka" size={size} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-label)" }}>{size}px</span>
          </div>
        ))}
      </Row>

      <Row label="All four flavours, 56px">
        {FLAVOURS.map((flavour) => (
          <MascotAvatar key={flavour} flavour={flavour} size={56} />
        ))}
      </Row>

      <Row label="Meaningful alt — sole identifier, e.g. notify-modal corner">
        <MascotAvatar flavour="jaadu" size={88} alt="Jaadu, the Masala Magic mascot" />
      </Row>

      <Row label="Idle loop, armed but only plays on ancestor hover/focus (hover this row)">
        <div className={styles.mascotHoverScope} style={{ display: "flex", gap: "var(--s-4)" }}>
          {FLAVOURS.map((flavour) => (
            <MascotAvatar key={flavour} flavour={flavour} size={56} expression="idle" animateIdle />
          ))}
        </div>
      </Row>

      <Row label="Keyboard focus (tab to it)">
        <a href="#" style={{ display: "inline-flex" }}>
          <MascotAvatar flavour="pehelwan" size={56} />
        </a>
      </Row>
    </div>
  );
}
