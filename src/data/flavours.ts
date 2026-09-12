export type FlavourSlug = 'pataka-peri-peri'|'malai-mood'|'jaadu-masala'|'pudina-pehelwan';

export interface Flavour {
  slug: FlavourSlug;
  name: string;          // "Pataka Peri Peri"
  short: string;         // "Pataka"
  flavour: string;       // "Peri Peri"
  theme: 'pataka'|'malai'|'jaadu'|'pehelwan';
  heat: 1|2|3|4|5;
  price: number;         // 99
  mrp: number;           // 129
  inStock: boolean;      // all false for now
  line: string;          // comic panel dialogue
  desc: string;
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
    keywords: ['malai', 'creamy', 'cheese', 'mild', 'मलाई'],
  },
  {
    slug: 'jaadu-masala',
    name: 'Jaadu Masala',
    short: 'Jaadu',
    flavour: 'Masala Magic',
    theme: 'jaadu',
    heat: 3,
    price: 99,
    mrp: 129,
    inStock: false,
    line: 'Ek chutki jaadu.',
    desc: 'Masala magic, every bite.',
    keywords: ['masala', 'jaadu', 'magic', 'purple', 'जादू', 'मसाला'],
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
    keywords: ['pudina', 'mint', 'green', 'tangy', 'पुदीना', 'पहलवान'],
  },
];