import type { WorldConfig } from "@/types/world-config";

export const animeWorldConfig: WorldConfig = {
  slug: "anime",
  isActive: true,
  name: { en: "Cel-Shaded Dusk", ar: "الغسق السينمائي" },
  tagline: {
    en: "Where every drop is an opening sequence.",
    ar: "حيث كل إطلاق هو مشهد من مشاهد الافتتاحية.",
  },
  theme: {
    colors: {
      bg: "#12101C",
      bgAlt: "#1D1830",
      surface: "#1D1830",
      primary: "#FF4E6E",
      accent: "#FFD84A",
      border: "#2C2650",
    },
    textColor: "#FFFFFF",
    textMutedColor: "#B9AEDC",
    fonts: {
      heading: "Anton",
      body: "Manrope",
    },
    radius: "round",
    motionProfile: "neon-glitch",
  },
  productCard: {
    variant: "character",
    fieldLabels: {
      title: { en: "Character", ar: "الشخصية" },
      primaryMeta: { en: "Rank", ar: "الترتيب" },
      secondaryMeta: { en: "Archetype", ar: "النمط" },
      ctaLabel: { en: "Add to Squad", ar: "أضف إلى التشكيلة" },
    },
  },
  landing: {
    heroAnimation: "neon-glitch",
    sectionOrder: ["hero", "featuredCharacters", "newDrops", "mangaPanels"],
  },
  copy: {
    addToCart: { en: "Add to Cart", ar: "أضف إلى السلة" },
    emptyCart: { en: "Your squad is empty.", ar: "تشكيلتك فارغة." },
    viewDetails: { en: "View Profile", ar: "عرض الملف" },
  },
  nav: [
    { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
    { label: { en: "Catalog", ar: "الكتالوج" }, href: "/anime" },
    { label: { en: "Seasonal Drops", ar: "إطلاقات الموسم" }, href: "/anime" },
  ],
};
