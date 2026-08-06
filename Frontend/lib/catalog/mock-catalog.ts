import type { ProductViewModel } from "@/types/product";

export interface MockProductWorldPresentation {
  displayTitle?: string;
  subtitle?: string;
  primaryMeta?: string;
  secondaryMeta?: string;
  badge?: string;
  accentColor?: string;
  available?: boolean;
}

export interface MockProduct {
  slug: string;
  baseTitle: string;
  basePrice: number;
  currency: string;
  worlds: Record<string, MockProductWorldPresentation>;
}

const USD = "$";

export const mockProducts: MockProduct[] = [
  {
    slug: "the-one-hoodie",
    baseTitle: "The One Hoodie",
    basePrice: 89,
    currency: USD,
    worlds: {
      tech: {
        displayTitle: "Mono Hoodie",
        subtitle: "240gsm graphite fleece · ESD-safe lining",
        primaryMeta: "4.9k",
        secondaryMeta: "2d ago",
        badge: "New Build",
      },
      gaming: {
        displayTitle: "Legendary Hoodie",
        subtitle: "Rare drop · silent-camper fleece",
        primaryMeta: "Legendary",
        secondaryMeta: "12 left",
        badge: "Drop",
        accentColor: "#FFB800",
      },
      anime: {
        displayTitle: "The One Hoodie",
        subtitle: "S-Rank · limited run",
        primaryMeta: "S-Rank",
        secondaryMeta: "Apparel",
        badge: "S",
      },
      poetry: {
        displayTitle: "قميص القصيدة",
        subtitle: "نسخة محدودة بخط ديواني",
        primaryMeta: "الأندلسي",
        secondaryMeta: "الوافر",
        badge: "معلقة",
      },
      football: {
        displayTitle: "The One Kit",
        subtitle: "Home kit · number 9",
        primaryMeta: "92",
        secondaryMeta: "ST",
        badge: "9",
      },
      chess: {
        displayTitle: "The One Hoodie",
        subtitle: "Tournament-casual weave",
        primaryMeta: "Tournament",
        secondaryMeta: "Fleece",
        badge: "New",
      },
    },
  },
  {
    slug: "universe-cap",
    baseTitle: "Universe Cap",
    basePrice: 29,
    currency: USD,
    worlds: {
      tech: {
        subtitle: "Low-profile · brushed twill",
        primaryMeta: "3.1k",
        secondaryMeta: "5d ago",
        badge: "Restock",
      },
      gaming: {
        subtitle: "Common drop",
        primaryMeta: "Common",
        secondaryMeta: "In stock",
        accentColor: "#8A8F98",
      },
      anime: {
        subtitle: "B-Rank accessory",
        primaryMeta: "B-Rank",
        secondaryMeta: "Accessory",
      },
      poetry: {
        displayTitle: "قبعة الديوان",
        subtitle: "تطريز ذهبي",
        primaryMeta: "العباسي",
        secondaryMeta: "البسيط",
      },
      football: {
        subtitle: "Terrace cap",
        primaryMeta: "85",
        secondaryMeta: "GK",
        badge: "1",
      },
      chess: {
        subtitle: "Club-lounge cotton",
        primaryMeta: "Classic",
        secondaryMeta: "Cotton",
      },
    },
  },
  {
    slug: "worlds-poster",
    baseTitle: "Worlds Poster",
    basePrice: 24,
    currency: USD,
    worlds: {
      tech: {
        displayTitle: "Blueprints Poster",
        subtitle: "Isometric blueprint print",
        primaryMeta: "1.8k",
        secondaryMeta: "1w ago",
        badge: "New",
      },
      gaming: {
        subtitle: "Rare wall art",
        primaryMeta: "Rare",
        secondaryMeta: "38 left",
        accentColor: "#4FA8FF",
      },
      anime: {
        subtitle: "A-Rank wall art",
        primaryMeta: "A-Rank",
        secondaryMeta: "Wall Art",
        badge: "A",
      },
      poetry: {
        displayTitle: "ملصق القصيدة",
        subtitle: "خط وورق مذهّب",
        primaryMeta: "الحديث",
        secondaryMeta: "الكامل",
        badge: "معلقة",
      },
      football: {
        subtitle: "Fixture wall print",
        primaryMeta: "88",
        secondaryMeta: "CAM",
        badge: "10",
      },
      chess: {
        subtitle: "Opening diagram print",
        primaryMeta: "Classic",
        secondaryMeta: "Paper",
      },
    },
  },
  {
    slug: "hyperion-runtime",
    baseTitle: "Hyperion Runtime",
    basePrice: 99,
    currency: USD,
    worlds: {
      tech: {
        subtitle: "v2.4.1 · WASM-native scheduler",
        primaryMeta: "12.4k",
        secondaryMeta: "3h ago",
        badge: "Stable",
      },
    },
  },
  {
    slug: "sundial-db",
    baseTitle: "Sundial DB",
    basePrice: 149,
    currency: USD,
    worlds: {
      tech: {
        subtitle: "Event-sourced PostgreSQL core",
        primaryMeta: "8.1k",
        secondaryMeta: "1d ago",
        badge: "Beta",
      },
    },
  },
  {
    slug: "marrow-cli",
    baseTitle: "Marrow CLI",
    basePrice: 49,
    currency: USD,
    worlds: {
      tech: {
        subtitle: "Config that ships itself",
        primaryMeta: "3.7k",
        secondaryMeta: "2d ago",
        badge: "New",
      },
    },
  },
  {
    slug: "obsidian-panel",
    baseTitle: "Obsidian Panel",
    basePrice: 199,
    currency: USD,
    worlds: {
      tech: {
        subtitle: "Air-gapped telemetry UI",
        primaryMeta: "5.2k",
        secondaryMeta: "1w ago",
        badge: "Enterprise",
        available: false,
      },
    },
  },
  {
    slug: "neon-katana",
    baseTitle: "Neon Katana",
    basePrice: 79,
    currency: USD,
    worlds: {
      gaming: {
        subtitle: "Energy blade · emits light in the dark",
        primaryMeta: "Epic",
        secondaryMeta: "5 left",
        badge: "Drop",
        accentColor: "#B24FFF",
      },
    },
  },
  {
    slug: "void-runner-pack",
    baseTitle: "Void Runner Pack",
    basePrice: 45,
    currency: USD,
    worlds: {
      gaming: {
        subtitle: "Phantom mobility gear bundle",
        primaryMeta: "Rare",
        secondaryMeta: "38 left",
        accentColor: "#4FA8FF",
      },
    },
  },
  {
    slug: "chroma-headset",
    baseTitle: "Chroma Headset",
    basePrice: 320,
    currency: USD,
    worlds: {
      gaming: {
        subtitle: "Spatial audio · squad sync",
        primaryMeta: "Legendary",
        secondaryMeta: "1 left",
        accentColor: "#FFB800",
      },
    },
  },
  {
    slug: "starter-crate",
    baseTitle: "Starter Crate",
    basePrice: 20,
    currency: USD,
    worlds: {
      gaming: {
        subtitle: "Guaranteed common or better",
        primaryMeta: "Common",
        secondaryMeta: "In stock",
        accentColor: "#8A8F98",
      },
    },
  },
  {
    slug: "yuki-last-ember",
    baseTitle: "Yuki, the Last Ember",
    basePrice: 120,
    currency: USD,
    worlds: {
      anime: {
        subtitle: "Fire Caster · S-Rank",
        primaryMeta: "S-Rank",
        secondaryMeta: "Caster",
        badge: "S",
      },
    },
  },
  {
    slug: "rin-foxblade",
    baseTitle: "Rin Foxblade",
    basePrice: 95,
    currency: USD,
    worlds: {
      anime: {
        subtitle: "Scarlet Phantom",
        primaryMeta: "A-Rank",
        secondaryMeta: "Rogue",
        badge: "A",
      },
    },
  },
  {
    slug: "momo-caramel",
    baseTitle: "Momo Caramel",
    basePrice: 65,
    currency: USD,
    worlds: {
      anime: {
        subtitle: "Cosmic Barista",
        primaryMeta: "B-Rank",
        secondaryMeta: "Support",
        badge: "B",
      },
    },
  },
  {
    slug: "verse-laila",
    baseTitle: "Verse of Laila",
    basePrice: 30,
    currency: USD,
    worlds: {
      poetry: {
        displayTitle: "سَلَامٌ على الديارِ وإنْ بدتْ لنا",
        subtitle: "مطلع قصيدة من العصر الأندلسي",
        primaryMeta: "الأندلسي",
        secondaryMeta: "الوافر",
        badge: "معلقة",
      },
    },
  },
  {
    slug: "verse-imru",
    baseTitle: "Verse of Imru",
    basePrice: 45,
    currency: USD,
    worlds: {
      poetry: {
        displayTitle: "قِفا نَبكِ من ذِكرى حبيبٍ ومَنزِلِ",
        subtitle: "من المعلقات السبع",
        primaryMeta: "الجاهلي",
        secondaryMeta: "الطويل",
        badge: "معلقة",
      },
    },
  },
  {
    slug: "verse-abbasid",
    baseTitle: "Abbasid Verse",
    basePrice: 35,
    currency: USD,
    worlds: {
      poetry: {
        displayTitle: "سهرُ العيونِ وشوقُهنَّ شقاءُ",
        subtitle: "من الشعر العباسي",
        primaryMeta: "العباسي",
        secondaryMeta: "البسيط",
      },
    },
  },
  {
    slug: "verse-modern",
    baseTitle: "Modern Verse",
    basePrice: 28,
    currency: USD,
    worlds: {
      poetry: {
        displayTitle: "يا ليتَ قومي يعلمونَ بأنَّني",
        subtitle: "قصيدة عصر النهضة",
        primaryMeta: "الحديث",
        secondaryMeta: "الكامل",
        available: false,
      },
    },
  },
  {
    slug: "karim-elmasry",
    baseTitle: "Karim Elmasry",
    basePrice: 89,
    currency: USD,
    worlds: {
      football: {
        subtitle: "Number 9 · Striker",
        primaryMeta: "92",
        secondaryMeta: "ST",
        badge: "9",
      },
    },
  },
  {
    slug: "layla-rashidi",
    baseTitle: "Layla Rashidi",
    basePrice: 74,
    currency: USD,
    worlds: {
      football: {
        subtitle: "Playmaker",
        primaryMeta: "88",
        secondaryMeta: "CAM",
        badge: "10",
      },
    },
  },
  {
    slug: "sami-boutaleb",
    baseTitle: "Sami Boutaleb",
    basePrice: 59,
    currency: USD,
    worlds: {
      football: {
        subtitle: "Sweeper Keeper",
        primaryMeta: "85",
        secondaryMeta: "GK",
        badge: "1",
      },
    },
  },
  {
    slug: "zinedine-farouk",
    baseTitle: "Zinedine Farouk",
    basePrice: 69,
    currency: USD,
    worlds: {
      football: {
        subtitle: "Backline General",
        primaryMeta: "90",
        secondaryMeta: "CB",
        badge: "5",
        available: false,
      },
    },
  },
  {
    slug: "ebony-king",
    baseTitle: "Ebony King",
    basePrice: 240,
    currency: USD,
    worlds: {
      chess: {
        subtitle: "Hand-carved rosewood",
        primaryMeta: "Grandmaster",
        secondaryMeta: "Rosewood",
        badge: "Limited",
      },
    },
  },
  {
    slug: "ivory-queen",
    baseTitle: "Ivory Queen",
    basePrice: 180,
    currency: USD,
    worlds: {
      chess: {
        subtitle: "Bone finish",
        primaryMeta: "Classic",
        secondaryMeta: "Bone",
      },
    },
  },
  {
    slug: "brass-rook",
    baseTitle: "Brass Rook",
    basePrice: 95,
    currency: USD,
    worlds: {
      chess: {
        subtitle: "Solid brass",
        primaryMeta: "Tournament",
        secondaryMeta: "Brass",
        badge: "New",
      },
    },
  },
  {
    slug: "obsidian-knight",
    baseTitle: "Obsidian Knight",
    basePrice: 310,
    currency: USD,
    worlds: {
      chess: {
        subtitle: "Polished volcanic glass",
        primaryMeta: "Collector",
        secondaryMeta: "Obsidian",
        available: false,
      },
    },
  },
];

function toViewModel(product: MockProduct, worldSlug: string): ProductViewModel {
  const presentation = product.worlds[worldSlug];
  return {
    slug: product.slug,
    title: presentation.displayTitle ?? product.baseTitle,
    subtitle: presentation.subtitle,
    primaryMeta: presentation.primaryMeta,
    secondaryMeta: presentation.secondaryMeta,
    price: product.basePrice,
    currency: product.currency,
    badge: presentation.badge,
    accentColor: presentation.accentColor,
    available: presentation.available ?? true,
  };
}

export function getWorldProductSlugs(worldSlug: string): string[] {
  return mockProducts.filter((product) => product.worlds[worldSlug]).map((product) => product.slug);
}

export function getAllMockProducts(): ProductViewModel[] {
  return mockProducts.map((product) => ({
    slug: product.slug,
    title: product.baseTitle,
    price: product.basePrice,
    currency: product.currency,
    available: true,
  }));
}

export function getMockProducts(worldSlug: string): ProductViewModel[] {
  return getWorldProductSlugs(worldSlug).map((slug) => getMockProduct(slug, worldSlug)!);
}

export function getMockProduct(slug: string, worldSlug?: string): ProductViewModel | undefined {
  const product = mockProducts.find((candidate) => candidate.slug === slug);
  if (!product) {
    return undefined;
  }
  if (worldSlug) {
    if (!product.worlds[worldSlug]) {
      return undefined;
    }
    return toViewModel(product, worldSlug);
  }
  return {
    slug: product.slug,
    title: product.baseTitle,
    price: product.basePrice,
    currency: product.currency,
    available: true,
  };
}
