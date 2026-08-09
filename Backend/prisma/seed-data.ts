// Seed dataset — mirrors Frontend/lib/catalog/mock-catalog.ts and the world
// config name/tagline values 1:1 so a cutover from the mock to this backend is
// behavior-identical. Prices are in cents (DB convention). sortWeight encodes
// the mock's per-world array order so list/detail ordering is unchanged.

export interface SeedWorld {
  slug: string;
  name: { en: string; ar: string };
  tagline: { en: string; ar: string };
  isActive: boolean;
}

export interface SeedPresentation {
  worldSlug: string;
  title: string;
  subtitle?: string;
  primaryValue: string;
  secondaryValue?: string;
  badge?: string;
  accentColor?: string;
  available?: boolean;
}

export interface SeedProduct {
  slug: string;
  baseTitle: string;
  basePriceCents: number;
  currency: string;
  worlds: SeedPresentation[];
}

export const seedWorlds: SeedWorld[] = [
  {
    slug: "tech",
    name: { en: "The Instrument Panel", ar: "لوحة العدّادات" },
    tagline: {
      en: "Precision hardware for people who read the spec sheet.",
      ar: "أجهزة دقيقة لمن يقرؤون ورقة المواصفات قبل كل شيء.",
    },
    isActive: true,
  },
  {
    slug: "gaming",
    name: { en: "Rig & Rank", ar: "جهّز وارتقِ" },
    tagline: {
      en: "Gear up. Rank up. Drop in.",
      ar: "جهّز نفسك. ارتقِ في الترتيب. انزل إلى الميدان.",
    },
    isActive: true,
  },
  {
    slug: "anime",
    name: { en: "Cel-Shaded Dusk", ar: "الغسق السينمائي" },
    tagline: {
      en: "Where every drop is an opening sequence.",
      ar: "حيث كل إطلاق هو مشهد من مشاهد الافتتاحية.",
    },
    isActive: true,
  },
  {
    slug: "poetry",
    name: { en: "The Living Diwan", ar: "الديوان الحي" },
    tagline: {
      en: "Ink that outlives empires.",
      ar: "حبرٌ يعيش أطول من الإمبراطوريات.",
    },
    isActive: true,
  },
  {
    slug: "football",
    name: { en: "Matchday", ar: "يوم المباراة" },
    tagline: {
      en: "Every drop lands at the whistle.",
      ar: "كل إطلاق يصدر مع صافرة البداية.",
    },
    isActive: true,
  },
  {
    slug: "chess",
    name: { en: "The Board Room", ar: "قاعة الرقعة" },
    tagline: {
      en: "Every piece has a purpose.",
      ar: "لكل قطعة هدف.",
    },
    isActive: true,
  },
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "the-one-hoodie",
    baseTitle: "The One Hoodie",
    basePriceCents: 8900,
    currency: "USD",
    worlds: [
      { worldSlug: "tech", title: "Mono Hoodie", subtitle: "240gsm graphite fleece · ESD-safe lining", primaryValue: "4.9k", secondaryValue: "2d ago", badge: "New Build" },
      { worldSlug: "gaming", title: "Legendary Hoodie", subtitle: "Rare drop · silent-camper fleece", primaryValue: "Legendary", secondaryValue: "12 left", badge: "Drop", accentColor: "#FFB800" },
      { worldSlug: "anime", title: "The One Hoodie", subtitle: "S-Rank · limited run", primaryValue: "S-Rank", secondaryValue: "Apparel", badge: "S" },
      { worldSlug: "poetry", title: "قميص القصيدة", subtitle: "نسخة محدودة بخط ديواني", primaryValue: "الأندلسي", secondaryValue: "الوافر", badge: "معلقة" },
      { worldSlug: "football", title: "The One Kit", subtitle: "Home kit · number 9", primaryValue: "92", secondaryValue: "ST", badge: "9" },
      { worldSlug: "chess", title: "The One Hoodie", subtitle: "Tournament-casual weave", primaryValue: "Tournament", secondaryValue: "Fleece", badge: "New" },
    ],
  },
  {
    slug: "universe-cap",
    baseTitle: "Universe Cap",
    basePriceCents: 2900,
    currency: "USD",
    worlds: [
      { worldSlug: "tech", title: "Universe Cap", subtitle: "Low-profile · brushed twill", primaryValue: "3.1k", secondaryValue: "5d ago", badge: "Restock" },
      { worldSlug: "gaming", title: "Universe Cap", subtitle: "Common drop", primaryValue: "Common", secondaryValue: "In stock", accentColor: "#8A8F98" },
      { worldSlug: "anime", title: "Universe Cap", subtitle: "B-Rank accessory", primaryValue: "B-Rank", secondaryValue: "Accessory" },
      { worldSlug: "poetry", title: "قبعة الديوان", subtitle: "تطريز ذهبي", primaryValue: "العباسي", secondaryValue: "البسيط" },
      { worldSlug: "football", title: "Universe Cap", subtitle: "Terrace cap", primaryValue: "85", secondaryValue: "GK", badge: "1" },
      { worldSlug: "chess", title: "Universe Cap", subtitle: "Club-lounge cotton", primaryValue: "Classic", secondaryValue: "Cotton" },
    ],
  },
  {
    slug: "worlds-poster",
    baseTitle: "Worlds Poster",
    basePriceCents: 2400,
    currency: "USD",
    worlds: [
      { worldSlug: "tech", title: "Blueprints Poster", subtitle: "Isometric blueprint print", primaryValue: "1.8k", secondaryValue: "1w ago", badge: "New" },
      { worldSlug: "gaming", title: "Worlds Poster", subtitle: "Rare wall art", primaryValue: "Rare", secondaryValue: "38 left", accentColor: "#4FA8FF" },
      { worldSlug: "anime", title: "Worlds Poster", subtitle: "A-Rank wall art", primaryValue: "A-Rank", secondaryValue: "Wall Art", badge: "A" },
      { worldSlug: "poetry", title: "ملصق القصيدة", subtitle: "خط وورق مذهّب", primaryValue: "الحديث", secondaryValue: "الكامل", badge: "معلقة" },
      { worldSlug: "football", title: "Worlds Poster", subtitle: "Fixture wall print", primaryValue: "88", secondaryValue: "CAM", badge: "10" },
      { worldSlug: "chess", title: "Worlds Poster", subtitle: "Opening diagram print", primaryValue: "Classic", secondaryValue: "Paper" },
    ],
  },
  {
    slug: "hyperion-runtime",
    baseTitle: "Hyperion Runtime",
    basePriceCents: 9900,
    currency: "USD",
    worlds: [
      { worldSlug: "tech", title: "Hyperion Runtime", subtitle: "v2.4.1 · WASM-native scheduler", primaryValue: "12.4k", secondaryValue: "3h ago", badge: "Stable" },
    ],
  },
  {
    slug: "sundial-db",
    baseTitle: "Sundial DB",
    basePriceCents: 14900,
    currency: "USD",
    worlds: [
      { worldSlug: "tech", title: "Sundial DB", subtitle: "Event-sourced PostgreSQL core", primaryValue: "8.1k", secondaryValue: "1d ago", badge: "Beta" },
    ],
  },
  {
    slug: "marrow-cli",
    baseTitle: "Marrow CLI",
    basePriceCents: 4900,
    currency: "USD",
    worlds: [
      { worldSlug: "tech", title: "Marrow CLI", subtitle: "Config that ships itself", primaryValue: "3.7k", secondaryValue: "2d ago", badge: "New" },
    ],
  },
  {
    slug: "obsidian-panel",
    baseTitle: "Obsidian Panel",
    basePriceCents: 19900,
    currency: "USD",
    worlds: [
      { worldSlug: "tech", title: "Obsidian Panel", subtitle: "Air-gapped telemetry UI", primaryValue: "5.2k", secondaryValue: "1w ago", badge: "Enterprise", available: false },
    ],
  },
  {
    slug: "neon-katana",
    baseTitle: "Neon Katana",
    basePriceCents: 7900,
    currency: "USD",
    worlds: [
      { worldSlug: "gaming", title: "Neon Katana", subtitle: "Energy blade · emits light in the dark", primaryValue: "Epic", secondaryValue: "5 left", badge: "Drop", accentColor: "#B24FFF" },
    ],
  },
  {
    slug: "void-runner-pack",
    baseTitle: "Void Runner Pack",
    basePriceCents: 4500,
    currency: "USD",
    worlds: [
      { worldSlug: "gaming", title: "Void Runner Pack", subtitle: "Phantom mobility gear bundle", primaryValue: "Rare", secondaryValue: "38 left", accentColor: "#4FA8FF" },
    ],
  },
  {
    slug: "chroma-headset",
    baseTitle: "Chroma Headset",
    basePriceCents: 32000,
    currency: "USD",
    worlds: [
      { worldSlug: "gaming", title: "Chroma Headset", subtitle: "Spatial audio · squad sync", primaryValue: "Legendary", secondaryValue: "1 left", accentColor: "#FFB800" },
    ],
  },
  {
    slug: "starter-crate",
    baseTitle: "Starter Crate",
    basePriceCents: 2000,
    currency: "USD",
    worlds: [
      { worldSlug: "gaming", title: "Starter Crate", subtitle: "Guaranteed common or better", primaryValue: "Common", secondaryValue: "In stock", accentColor: "#8A8F98" },
    ],
  },
  {
    slug: "yuki-last-ember",
    baseTitle: "Yuki, the Last Ember",
    basePriceCents: 12000,
    currency: "USD",
    worlds: [
      { worldSlug: "anime", title: "Yuki, the Last Ember", subtitle: "Fire Caster · S-Rank", primaryValue: "S-Rank", secondaryValue: "Caster", badge: "S" },
    ],
  },
  {
    slug: "rin-foxblade",
    baseTitle: "Rin Foxblade",
    basePriceCents: 9500,
    currency: "USD",
    worlds: [
      { worldSlug: "anime", title: "Rin Foxblade", subtitle: "Scarlet Phantom", primaryValue: "A-Rank", secondaryValue: "Rogue", badge: "A" },
    ],
  },
  {
    slug: "momo-caramel",
    baseTitle: "Momo Caramel",
    basePriceCents: 6500,
    currency: "USD",
    worlds: [
      { worldSlug: "anime", title: "Momo Caramel", subtitle: "Cosmic Barista", primaryValue: "B-Rank", secondaryValue: "Support", badge: "B" },
    ],
  },
  {
    slug: "verse-laila",
    baseTitle: "Verse of Laila",
    basePriceCents: 3000,
    currency: "USD",
    worlds: [
      { worldSlug: "poetry", title: "سَلَامٌ على الديارِ وإنْ بدتْ لنا", subtitle: "مطلع قصيدة من العصر الأندلسي", primaryValue: "الأندلسي", secondaryValue: "الوافر", badge: "معلقة" },
    ],
  },
  {
    slug: "verse-imru",
    baseTitle: "Verse of Imru",
    basePriceCents: 4500,
    currency: "USD",
    worlds: [
      { worldSlug: "poetry", title: "قِفا نَبكِ من ذِكرى حبيبٍ ومَنزِلِ", subtitle: "من المعلقات السبع", primaryValue: "الجاهلي", secondaryValue: "الطويل", badge: "معلقة" },
    ],
  },
  {
    slug: "verse-abbasid",
    baseTitle: "Abbasid Verse",
    basePriceCents: 3500,
    currency: "USD",
    worlds: [
      { worldSlug: "poetry", title: "سهرُ العيونِ وشوقُهنَّ شقاءُ", subtitle: "من الشعر العباسي", primaryValue: "العباسي", secondaryValue: "البسيط" },
    ],
  },
  {
    slug: "verse-modern",
    baseTitle: "Modern Verse",
    basePriceCents: 2800,
    currency: "USD",
    worlds: [
      { worldSlug: "poetry", title: "يا ليتَ قومي يعلمونَ بأنَّني", subtitle: "قصيدة عصر النهضة", primaryValue: "الحديث", secondaryValue: "الكامل", available: false },
    ],
  },
  {
    slug: "karim-elmasry",
    baseTitle: "Karim Elmasry",
    basePriceCents: 8900,
    currency: "USD",
    worlds: [
      { worldSlug: "football", title: "Karim Elmasry", subtitle: "Number 9 · Striker", primaryValue: "92", secondaryValue: "ST", badge: "9" },
    ],
  },
  {
    slug: "layla-rashidi",
    baseTitle: "Layla Rashidi",
    basePriceCents: 7400,
    currency: "USD",
    worlds: [
      { worldSlug: "football", title: "Layla Rashidi", subtitle: "Playmaker", primaryValue: "88", secondaryValue: "CAM", badge: "10" },
    ],
  },
  {
    slug: "sami-boutaleb",
    baseTitle: "Sami Boutaleb",
    basePriceCents: 5900,
    currency: "USD",
    worlds: [
      { worldSlug: "football", title: "Sami Boutaleb", subtitle: "Sweeper Keeper", primaryValue: "85", secondaryValue: "GK", badge: "1" },
    ],
  },
  {
    slug: "zinedine-farouk",
    baseTitle: "Zinedine Farouk",
    basePriceCents: 6900,
    currency: "USD",
    worlds: [
      { worldSlug: "football", title: "Zinedine Farouk", subtitle: "Backline General", primaryValue: "90", secondaryValue: "CB", badge: "5", available: false },
    ],
  },
  {
    slug: "ebony-king",
    baseTitle: "Ebony King",
    basePriceCents: 24000,
    currency: "USD",
    worlds: [
      { worldSlug: "chess", title: "Ebony King", subtitle: "Hand-carved rosewood", primaryValue: "Grandmaster", secondaryValue: "Rosewood", badge: "Limited" },
    ],
  },
  {
    slug: "ivory-queen",
    baseTitle: "Ivory Queen",
    basePriceCents: 18000,
    currency: "USD",
    worlds: [
      { worldSlug: "chess", title: "Ivory Queen", subtitle: "Bone finish", primaryValue: "Classic", secondaryValue: "Bone" },
    ],
  },
  {
    slug: "brass-rook",
    baseTitle: "Brass Rook",
    basePriceCents: 9500,
    currency: "USD",
    worlds: [
      { worldSlug: "chess", title: "Brass Rook", subtitle: "Solid brass", primaryValue: "Tournament", secondaryValue: "Brass", badge: "New" },
    ],
  },
  {
    slug: "obsidian-knight",
    baseTitle: "Obsidian Knight",
    basePriceCents: 31000,
    currency: "USD",
    worlds: [
      { worldSlug: "chess", title: "Obsidian Knight", subtitle: "Polished volcanic glass", primaryValue: "Collector", secondaryValue: "Obsidian", available: false },
    ],
  },
];
