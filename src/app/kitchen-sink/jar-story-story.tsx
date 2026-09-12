"use client";

import { JarStory } from "@/components/jar-story/JarStory";

export function JarStoryStory() {
  return (
    <div style={{ padding: "var(--s-5) 0", display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
      <div style={{ padding: "0 var(--s-5)" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--ink)" }}>
          Jar Story
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--ink)", maxWidth: "62ch" }}>
          §06 ingredient scrollytelling. Scroll through the pinned jar sequence below, or set your OS
          to reduce motion to see the static fallback that always renders as real, readable text.
        </p>
      </div>
      <JarStory />
    </div>
  );
}
