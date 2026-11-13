import { StubPage } from "../StubPage";
import { BATCH } from "@/data/launch";

export default function StoreLocatorPage() {
  return (
    <StubPage
      eyebrow="STORE LOCATOR"
      heading="Stores abhi nahi, jaldi."
      body={`${BATCH.name} drops online on ${BATCH.dropDateLong}. Stores come after that. Home page pe list join karo, hum bata denge.`}
    />
  );
}
