import type { WorldConfig } from "@/types/world-config";

export const footballWorldConfig: WorldConfig = {
  slug: "football",
  isActive: true,
  name: { en: "Matchday", ar: "يوم المباراة" },
  tagline: {
    en: "Every drop lands at the whistle.",
    ar: "كل إطلاق يصدر مع صافرة البداية.",
  },
  theme: {
    colors: {
      bg: "#0A0C10",
      bgAlt: "#101820",
      surface: "#131A22",
      primary: "#F2C94C",
      accent: "#FF3B30",
      border: "#1F2A33",
    },
    textColor: "#FFFFFF",
    textMutedColor: "#8C97A3",
    fonts: {
      heading: "Integral CF",
      body: "Inter Tight",
      mono: "JetBrains Mono",
    },
    radius: "sharp",
    motionProfile: "stadium",
  },
  productCard: {
    variant: "player",
    fieldLabels: {
      title: { en: "Player", ar: "اللاعب" },
      primaryMeta: { en: "Rating", ar: "التقييم" },
      secondaryMeta: { en: "Position", ar: "المركز" },
      ctaLabel: { en: "Add to Squad", ar: "أضف إلى التشكيلة" },
    },
  },
  landing: {
    heroAnimation: "stadium",
    sectionOrder: ["hero", "matchdayCountdown", "featuredPlayers", "kits"],
  },
  copy: {
    addToCart: { en: "Add to Cart", ar: "أضف إلى السلة" },
    emptyCart: { en: "Your matchday bag is empty.", ar: "حقيبة المباراة فارغة." },
    viewDetails: { en: "View Profile", ar: "عرض الملف" },
  },
  nav: [
    { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
    { label: { en: "Fixtures", ar: "المباريات" }, href: "/football" },
    { label: { en: "Squad", ar: "التشكيلة" }, href: "/football" },
  ],
};
