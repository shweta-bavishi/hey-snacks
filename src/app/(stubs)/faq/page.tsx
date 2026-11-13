import { StubPage } from "../StubPage";

// The full FAQ accordion lives at #faq on the home page (src/data/faq.ts +
// src/components/faq/Faq.tsx). This route exists only so a direct /faq
// link never dead-ends; it hands off straight to the real section.
export default function FaqPage() {
  return (
    <StubPage
      eyebrow="FAQ"
      heading="Saare sawaal home page pe hain."
      body="Shelf life, shipping, allergens — sab kuch neeche milega."
    />
  );
}
