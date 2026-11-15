import { InfoPage } from "../InfoPage";

export const metadata = { title: "Terms | hey." };

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="TERMS"
      heading="Terms of service."
      intro="The rules for using this site and buying from us."
      sections={[
        { heading: "Using the site", body: ["Placeholder: acceptable use of the website."] },
        { heading: "Orders and pricing", body: ["Placeholder: how orders, prices and payments work."] },
        { heading: "Intellectual property", body: ["Placeholder: ownership of content, brand and artwork."] },
        { heading: "Liability", body: ["Placeholder: limits of our liability."] },
        { heading: "Changes to these terms", body: ["Placeholder: how and when we update these terms."] },
      ]}
    />
  );
}
