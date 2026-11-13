import type { FlavourSlug } from "@/data/flavours";

// Real pack renders, per docs/packaging-back-panel-plan.md — front, back and
// side all reviewed and landed. Front is what every 2D surface (ProductCard,
// Shop, the flat Pack360 fallback) has always read from this file for;
// back/side are new and only consumed by Pack3D so far. Same slug keys
// throughout so a component never has to know the file layout beneath.
const FRONT_ART: Record<FlavourSlug, string> = {
  "pataka-peri-peri": "/packs/pataka-peri-peri.svg",
  "malai-mood": "/packs/malai-mood.svg",
  "dadi-masala": "/packs/dadi-masala.svg",
  "pudina-pehelwan": "/packs/pudina-pehelwan.svg",
};

const BACK_ART: Record<FlavourSlug, string> = {
  "pataka-peri-peri": "/packs/back/pataka-peri-peri.svg",
  "malai-mood": "/packs/back/malai-mood.svg",
  "dadi-masala": "/packs/back/dadi-masala.svg",
  "pudina-pehelwan": "/packs/back/pudina-pehelwan.svg",
};

// One side art per flavour, not two — the design brief treats the carton's
// two sides as near-mirror-identical (net weight, barcode, rotated flavour
// name), so Pack3D reuses this same file for both the left and right face
// rather than needing a left/right pair.
const SIDE_ART: Record<FlavourSlug, string> = {
  "pataka-peri-peri": "/packs/side/pataka-peri-peri.svg",
  "malai-mood": "/packs/side/malai-mood.svg",
  "dadi-masala": "/packs/side/dadi-masala.svg",
  "pudina-pehelwan": "/packs/side/pudina-pehelwan.svg",
};

export const VARIETY_PACK_IMAGE = "/packs/variety-pack.svg";
export const VARIETY_PACK_BACK_IMAGE = "/packs/back/variety-pack.svg";
export const VARIETY_PACK_SIDE_IMAGE = "/packs/side/variety-pack.svg";

export function packImageSrc(slug: FlavourSlug): string {
  return FRONT_ART[slug];
}

export function packBackImageSrc(slug: FlavourSlug): string {
  return BACK_ART[slug];
}

export function packSideImageSrc(slug: FlavourSlug): string {
  return SIDE_ART[slug];
}
