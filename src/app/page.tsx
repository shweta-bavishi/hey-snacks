"use client";

import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { Marquee } from "@/components/marquee/Marquee";
import { JarStory } from "@/components/jar-story/JarStory";
import { NotifyModalProvider } from "@/components/notify-form/NotifyModalProvider";
import { ConnectModalProvider } from "@/components/connect-form/ConnectModalProvider";
import { Hero } from "@/components/hero/Hero";
// ComicIntro is parked, not deleted — swapped out for FlavourShowcase below
// per the "our range" redesign. Re-enable by swapping the two back.
// import { ComicIntro } from "@/components/comic-intro/ComicIntro";
import { FlavourShowcase } from "@/components/flavour-showcase/FlavourShowcase";
import { FlavourGrid } from "@/components/flavour-grid/FlavourGrid";
import { ProofBand } from "@/components/proof-band/ProofBand";
import { Shop } from "@/components/shop/Shop";
import { Faq } from "@/components/faq/Faq";
import { FLAVOURS } from "@/data/flavours";
import { BATCH } from "@/data/launch";

const ANNOUNCEMENT_ITEMS = [
  `${BATCH.name.toUpperCase()} DROPS ${BATCH.dropDateShort}`,
  "FREE SHIPPING OVER ₹499",
  "MAKHANA + NUTS + SEEDS",
  "ZERO PALM OIL",
  "कुरकुरा",
  "ROASTED, NEVER FRIED",
];

const MID_MARQUEE_ITEMS = [
  "ROASTED NOT FRIED",
  "ZERO PALM OIL",
  "PLANT BASED",
  "NON GMO",
  "NO ADDED PRESERVATIVES",
  "ANTI OXIDANTS",
  "GLUTEN FREE",
];

export default function Home() {
  return (
    <NotifyModalProvider>
      <ConnectModalProvider>
        <Marquee items={ANNOUNCEMENT_ITEMS} tone="marigold" direction="left" speed={40} />
        <Header />
        <main id="main-content">
          <Hero />
          {/* <ComicIntro /> */}
          <FlavourShowcase />
          <FlavourGrid />
          <Marquee items={MID_MARQUEE_ITEMS} tone="peacock" direction="right" speed={36} />
          <section id="ingredients">
            <JarStory />
          </section>
          <ProofBand />
          <Shop />
          <Faq />
        </main>
        <Footer flavours={FLAVOURS} />
      </ConnectModalProvider>
    </NotifyModalProvider>
  );
}
