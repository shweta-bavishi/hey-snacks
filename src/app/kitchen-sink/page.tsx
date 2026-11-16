import { HeaderStory } from "./header-story";
import { ThemeStory } from "./theme-story";
import { GrainStory } from "./grain-story";
import { MakhanaPuffStory } from "./makhana-puff-story";
import { ButtonStory } from "./button-story";
import { PillStory } from "./pill-story";
import { InputStory } from "./input-story";
import { CheckboxStory } from "./checkbox-story";
import { ChipStory } from "./chip-story";
import { StampStory } from "./stamp-story";
import { MarqueeStory } from "./marquee-story";
import { CardStory } from "./card-story";
import { SectionHeadingStory } from "./section-heading-story";
import { MascotAvatarStory } from "./mascot-avatar-story";
import { MascotCutoutStory } from "./mascot-cutout-story";
import { SpeechBubbleStory } from "./speech-bubble-story";
import { HeatMeterStory } from "./heat-meter-story";
import { ModalStory } from "./modal-story";
import { ToastStory } from "./toast-story";
import { FlavourColumnStory } from "./flavour-column-story";
import { ComicPanelStory } from "./comic-panel-story";
import { ProductCardStory } from "./product-card-story";
import { NotifyFormStory } from "./notify-form-story";
import { CommandPaletteStory } from "./command-palette-story";
import { ScrollRevealStory } from "./scroll-reveal-story";
import { FooterStory } from "./footer-story";
import { JarStoryStory } from "./jar-story-story";
import { HeroStory } from "./hero-story";
import { ComicIntroStory } from "./comic-intro-story";
import { FlavourGridStory } from "./flavour-grid-story";
import { ProofBandStory } from "./proof-band-story";
import { ShopStory } from "./shop-story";
import { CookieNoticeStory } from "./cookie-notice-story";
import { FaqStory } from "./faq-story";
import { NotifyModalProvider } from "@/components/notify-form/NotifyModalProvider";
import { ConnectModalProvider } from "@/components/connect-form/ConnectModalProvider";

export default function KitchenSinkPage() {
  return (
    <main id="main-content">
      <HeaderStory />
      <ThemeStory />
      <GrainStory />
      <MakhanaPuffStory />
      <ButtonStory />
      <PillStory />
      <InputStory />
      <CheckboxStory />
      <ChipStory />
      <StampStory />
      <MarqueeStory />
      <CardStory />
      <SectionHeadingStory />
      <MascotAvatarStory />
      <MascotCutoutStory />
      <SpeechBubbleStory />
      <ComicPanelStory />
      <HeatMeterStory />
      <ModalStory />
      <ToastStory />
      <FlavourColumnStory />
      <ProductCardStory />
      <NotifyFormStory />
      <CommandPaletteStory />
      <ScrollRevealStory />
      <JarStoryStory />
      {/* New Phase 2-5 landing-page sections all resolve Notify Me through
          the shared modal, so they need a provider in scope here too. */}
      <NotifyModalProvider>
        <ConnectModalProvider>
          <HeroStory />
          <ComicIntroStory />
          <FlavourGridStory />
          <ProofBandStory />
          <ShopStory />
        </ConnectModalProvider>
      </NotifyModalProvider>
      <CookieNoticeStory />
      <FaqStory />
      <FooterStory />
    </main>
  );
}
