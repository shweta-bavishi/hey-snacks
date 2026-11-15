import { InfoPage } from "../InfoPage";

export const metadata = { title: "Privacy | hey." };

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="PRIVACY"
      heading="Privacy policy."
      intro="What we collect, why we collect it and how we look after it."
      sections={[
        { heading: "Information we collect", body: ["Placeholder: the data we collect from visitors and customers."] },
        { heading: "How we use it", body: ["Placeholder: the purposes we use your information for."] },
        { heading: "Sharing and storage", body: ["Placeholder: who we share data with and how long we keep it."] },
        { heading: "Your rights", body: ["Placeholder: how to access, correct or delete your data."] },
        { heading: "Contact", body: ["Placeholder: who to write to about privacy questions."] },
      ]}
    />
  );
}
