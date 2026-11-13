import { FLAVOURS } from "@/data/flavours";
import { packBackImageSrc, packImageSrc } from "@/lib/packArt";
import { Pack3D } from "@/components/hero/Pack3D";
import styles from "./capture.module.css";

// A dedicated, minimal render target for scripts/capture-pack-3d.mjs — not
// a page anyone is meant to land on. Renders exactly one Pack3D instance,
// full-bleed, nothing else on the page, so a headless browser can
// frame-by-frame screenshot it without fighting the real site's header,
// hero copy, or any other chrome. See docs/hero-360-plan.md §6 for why
// this exists instead of a photographer or a rendered/photographed
// image-sequence pipeline. `?flavour=<slug>` picks the pouch; defaults to
// Dadi Masala.
const DEFAULT_SLUG = "dadi-masala";

export default async function CapturePack3DPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { flavour: requested } = await searchParams;
  const flavour =
    FLAVOURS.find((f) => f.slug === requested) ?? FLAVOURS.find((f) => f.slug === DEFAULT_SLUG)!;

  return (
    <div className={styles.stageWrap}>
      <Pack3D
        front={packImageSrc(flavour.slug)}
        back={packBackImageSrc(flavour.slug)}
        theme={flavour.theme}
        alt={`${flavour.name} pack`}
        className={styles.large}
      />
    </div>
  );
}
