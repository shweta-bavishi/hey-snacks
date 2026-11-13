"use client";

import { FLAVOURS, VARIETY_PACK } from "@/data/flavours";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { ProductCard } from "@/components/product-card/ProductCard";
import { Card } from "@/components/card/Card";
import { Stamp, stampHoverGroup } from "@/components/stamp/Stamp";
import { Button } from "@/components/button/Button";
import { MascotAvatar } from "@/components/mascot-avatar/MascotAvatar";
import mascotStyles from "@/components/mascot-avatar/mascot-avatar.module.css";
import { useNotifyModal } from "@/components/notify-form/NotifyModalProvider";
import { packImageSrc, VARIETY_PACK_IMAGE } from "@/lib/packArt";
import { BATCH, JOIN_LABEL } from "@/data/launch";
import styles from "./shop.module.css";

export function Shop() {
  const { openNotify } = useNotifyModal();

  return (
    <section id="shop" className={`${styles.section} snap-section`}>
      <div className={styles.headingRow}>
        <SectionHeading level={2} className={styles.heading}>
          Shop
        </SectionHeading>
        <p className={styles.sub}>
          [ 04 FLAVOURS ✱ {BATCH.name.toUpperCase()} DROPS {BATCH.dropDateShort} ]
        </p>
      </div>

      {/* <div className={styles.ribbon} aria-hidden="true">
        SAB KHATAM. FILHAAL.
      </div> */}

      <div className={styles.grid}>
        {FLAVOURS.map((flavour) => (
          <ProductCard
            key={flavour.slug}
            id={`shop-${flavour.slug}`}
            flavour={flavour}
            dropLabel={`Drops ${BATCH.dropDateShort}`}
            ctaLabel={JOIN_LABEL}
            packImageSrc={packImageSrc(flavour.slug)}
            onNotify={async () => {
              await openNotify(flavour.slug, "shop_card");
            }}
          />
        ))}

        <div className={[styles.varietyCard, stampHoverGroup].join(" ")}>
          <Card
            shadowColor="ink"
            padding="none"
            className={styles.varietyInner}
          >
            <div className={styles.varietyImage}>
              <img
                src={VARIETY_PACK_IMAGE}
                alt=""
                className={styles.varietyPack}
              />
              <Stamp variant="coming-soon">Drops {BATCH.dropDateShort}</Stamp>
              <div
                className={[
                  styles.mascotLineup,
                  mascotStyles.mascotHoverScope,
                ].join(" ")}
              >
                {FLAVOURS.map((f) => (
                  <MascotAvatar key={f.slug} flavour={f.theme} size={32} />
                ))}
              </div>
            </div>
            <div className={styles.varietyBody}>
              <h3 className={styles.varietyName}>{VARIETY_PACK.name}</h3>
              <p className={styles.varietyDesc}>{VARIETY_PACK.desc}</p>
              <div className={styles.priceRow}>
                <span className={styles.mrp}>₹{VARIETY_PACK.mrp}</span>
                <span className={styles.price}>₹{VARIETY_PACK.price}</span>
              </div>
              <Button
                className={styles.notify}
                onClick={() => {
                  openNotify(FLAVOURS[0].slug, "variety_pack").catch(() => {});
                }}
              >
                {JOIN_LABEL}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
