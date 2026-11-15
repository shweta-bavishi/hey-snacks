import { InfoPage } from "../InfoPage";

export const metadata = { title: "Shipping | hey." };

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="SHIPPING"
      heading="Shipping."
      intro="How and when your order reaches you."
      sections={[
        { heading: "Delivery times", body: ["Placeholder: estimated delivery windows by region."] },
        { heading: "Shipping charges", body: ["Placeholder: shipping rates and the free shipping threshold."] },
        { heading: "Order tracking", body: ["Placeholder: how to track your order once it ships."] },
        { heading: "Questions", body: ["Placeholder: delivery issues? Reach us on the Contact page."] },
      ]}
    />
  );
}
