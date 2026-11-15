import { InfoPage } from "../InfoPage";

export const metadata = { title: "Returns | hey." };

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="RETURNS"
      heading="Returns and refunds."
      intro="What to do if something is not right with your order."
      sections={[
        { heading: "Eligibility", body: ["Placeholder: what can be returned and the time window."] },
        { heading: "How to request a return", body: ["Placeholder: steps to raise a return request."] },
        { heading: "Refunds", body: ["Placeholder: refund method and processing time."] },
        { heading: "Damaged or wrong items", body: ["Placeholder: what we need from you and how we make it right."] },
      ]}
    />
  );
}
