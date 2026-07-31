import type { WorldConfig } from "@/types/world-config";

export const techWorldConfig: WorldConfig = {
  slug: "tech",
  isActive: true,
  name: { en: "The Instrument Panel", ar: "لوحة العدّادات" },
  tagline: {
    en: "Precision hardware for people who read the spec sheet.",
    ar: "أجهزة دقيقة لمن يقرؤون ورقة المواصفات قبل كل شيء.",
  },
  theme: {
    colors: {
      bg: "#101216",
      bgAlt: "#0B0D10",
      surface: "#181B20",
      primary: "#7CFF9E",
      accent: "#FF9F4A",
      border: "#2A2E35",
    },
    textColor: "#F2F3F5",
    textMutedColor: "#8A8F98",
    fonts: {
      heading: "JetBrains Mono",
      body: "Inter",
      mono: "JetBrains Mono",
    },
    radius: "sharp",
    motionProfile: "terminal",
  },
  productCard: {
    variant: "repo",
    fieldLabels: {
      title: { en: "Repository", ar: "المستودع" },
      primaryMeta: { en: "Stars", ar: "النجوم" },
      secondaryMeta: { en: "Last Commit", ar: "آخر تحديث" },
      ctaLabel: { en: "Deploy to Closet", ar: "انشر في المستودع" },
    },
  },
  landing: {
    heroAnimation: "terminal",
    sectionOrder: ["hero", "featuredRepositories", "terminalPlayground", "testimonials"],
  },
  copy: {
    addToCart: { en: "Add to Cart", ar: "أضف إلى السلة" },
    emptyCart: { en: "Your build bench is empty.", ar: "طاولة البناء فارغة." },
    viewDetails: { en: "View Specs", ar: "عرض المواصفات" },
  },
  nav: [
    { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
    { label: { en: "Catalog", ar: "الكتالوج" }, href: "/tech" },
    { label: { en: "Docs", ar: "التوثيق" }, href: "/tech" },
  ],
};
