import { InfoPage } from "../InfoPage";

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="ABOUT US"
      heading="Hum hain hey."
      intro="Makhana, par full filmy. Ek chhoti si kahani, ek bada sa crunch."
      sections={[
        { heading: "Kahani", body: ["Placeholder: hamari origin story yahan aayegi."] },
        { heading: "Makhana kyun", body: ["Placeholder: ingredient aur sourcing ki baat yahan."] },
        { heading: "Team", body: ["Placeholder: log jo hey. banate hain."] },
      ]}
    />
  );
}
