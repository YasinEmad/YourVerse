import type { WorldConfig } from "@/types/world-config";

export const chessWorldConfig: WorldConfig = {
  slug: "chess",
  isActive: true,
  name: { en: "The Board Room", ar: "قاعة الرقعة" },
  tagline: {
    en: "Every piece has a purpose.",
    ar: "لكل قطعة هدف.",
  },
  theme: {
    colors: {
      bg: "#F7F5F0",
      bgAlt: "#EFEAE0",
      surface: "#FFFFFF",
      primary: "#1C1A17",
      accent: "#7A1E2C",
      border: "#E4DED2",
    },
    textColor: "#1C1A17",
    textMutedColor: "#6B655C",
    fonts: {
      heading: "Canela",
      body: "Inter",
      mono: "JetBrains Mono",
    },
    radius: "soft",
    motionProfile: "marble",
  },
  productCard: {
    variant: "square",
    fieldLabels: {
      title: { en: "Piece", ar: "القطعة" },
      primaryMeta: { en: "Edition", ar: "الطبعة" },
      secondaryMeta: { en: "Material", ar: "الخامة" },
      ctaLabel: { en: "Add to My Collection", ar: "أضف إلى مجموعتي" },
    },
  },
  landing: {
    heroAnimation: "marble",
    sectionOrder: ["hero", "openingOfTheDay", "featuredSets", "library"],
  },
  copy: {
    addToCart: { en: "Add to Cart", ar: "أضف إلى السلة" },
    emptyCart: { en: "Your collection board is empty.", ar: "لوحة مجموعتك فارغة." },
    viewDetails: { en: "Study This Piece", ar: "تأمل هذه القطعة" },
  },
  nav: [
    { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
    { label: { en: "Library", ar: "المكتبة" }, href: "/chess" },
    { label: { en: "Openings", ar: "الافتتاحيات" }, href: "/chess" },
  ],
};
