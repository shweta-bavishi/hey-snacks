export type FlavourSlug = 'pataka-peri-peri'|'malai-mood'|'dadi-masala'|'pudina-pehelwan';

export interface Flavour {
  slug: FlavourSlug;
  name: string;          // "Pataka Peri Peri"
  short: string;         // "Pataka"
  flavour: string;       // "Peri Peri"
  theme: 'pataka'|'malai'|'dadi'|'pehelwan';
  heat: 1|2|3|4|5;
  price: number;         // 99
  mrp: number;           // 129
  inStock: boolean;      // all false for now
  line: string;          // comic panel dialogue
  desc: string;
  tasteNote: string;     // one-line English taste description for the range showcase
  keywords: string[];    // for the command palette, incl. Hinglish + Devanagari
}

// The only place flavour data is allowed to live — every component (product
// cards, the flavour columns, the command palette, the notify form) reads
// from this array instead of hardcoding a flavour.
export const FLAVOURS: Flavour[] = [
  {
    slug: 'pataka-peri-peri',
    name: 'Pataka Peri Peri',
    short: 'Pataka',
    flavour: 'Peri Peri',
    theme: 'pataka',
    heat: 4,
    price: 99,
    mrp: 129,
    inStock: false,
    line: 'Aankh se paani, mooh se maza.',
    desc: 'Fiery peri peri, hand-tossed.',
    tasteNote: 'Sharp, smoky heat that builds fast. Chilli first, roasted crunch right behind it.',
    keywords: ['peri peri', 'spicy', 'hot', 'chilli', 'पटाका', 'पेरी पेरी'],
  },
  {
    slug: 'malai-mood',
    name: 'Malai Mood',
    short: 'Malai',
    flavour: 'Malai',
    theme: 'malai',
    heat: 1,
    price: 99,
    mrp: 129,
    inStock: false,
    line: 'Softly softly, malai mood.',
    desc: 'Creamy malai, no heat.',
    tasteNote: 'Mild and rich, with zero heat. Tastes buttery without a drop of dairy.',
    keywords: ['malai', 'creamy', 'cheese', 'mild', 'मलाई'],
  },
  {
    slug: 'dadi-masala',
    name: 'Dadi Masala',
    short: 'Dadi',
    flavour: 'Desi Masala',
    theme: 'dadi',
    heat: 3,
    price: 99,
    mrp: 129,
    inStock: false,
    line: 'Ek chutki dadi ka nuskha.',
    desc: 'Desi masala, every bite.',
    tasteNote: 'Layered chaat-style spice: tangy, salty, with a warmth that builds slowly.',
    keywords: ['masala', 'dadi', 'desi', 'terracotta', 'kulhad', 'orange', 'दादी', 'मसाला'],
  },
  {
    slug: 'pudina-pehelwan',
    name: 'Pudina Pehelwan',
    short: 'Pehelwan',
    flavour: 'Pudina',
    theme: 'pehelwan',
    heat: 2,
    price: 99,
    mrp: 129,
    inStock: false,
    line: 'Thanda thanda, pehelwan wala.',
    desc: 'Cool pudina punch.',
    tasteNote: 'Cool, herby and tangy, with a light citrus edge. Refreshing, not sharp.',
    keywords: ['pudina', 'mint', 'green', 'tangy', 'पुदीना', 'पहलवान'],
  },
];

// The fifth shop card (docs/landing-page-plan.md §08, addition #2). Kept
// separate from FLAVOURS rather than folded in as a fake fifth
// FlavourSlug — it isn't a flavour, it's a bundle of all four, and giving
// it its own slug type would force every FLAVOURS.map() call site to
// special-case it.
export interface VarietyPack {
  slug: 'variety-pack';
  name: string;
  price: number;
  mrp: number;
  inStock: boolean;
  desc: string;
}

export const VARIETY_PACK: VarietyPack = {
  slug: 'variety-pack',
  name: 'The Whole Gang',
  price: 349,
  mrp: 396,
  inStock: false,
  desc: 'All four flavours, one box. For when you can\'t pick just one.',
};