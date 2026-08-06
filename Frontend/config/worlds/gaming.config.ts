import type { WorldConfig } from "@/types/world-config";

export const gamingWorldConfig: WorldConfig = {
  slug: "gaming",
  isActive: true,
  name: { en: "Rig & Rank", ar: "جهّز وارتقِ" },
  tagline: {
    en: "Gear up. Rank up. Drop in.",
    ar: "جهّز نفسك. ارتقِ في الترتيب. انزل إلى الميدان.",
  },
  theme: {
    colors: {
      bg: "#08090C",
      bgAlt: "#0D0F14",
      surface: "#12141B",
      primary: "#7B5CFF",
      accent: "#FFB800",
      border: "#1A1E29",
    },
    textColor: "#F5F5F7",
    textMutedColor: "#8A8F98",
    fonts: {
      heading: "Rajdhani",
      body: "Inter",
      mono: "JetBrains Mono",
    },
    radius: "soft",
    motionProfile: "rgb-pixel",
  },
  productCard: {
    variant: "loot",
    fieldLabels: {
      title: { en: "Item", ar: "العنصر" },
      primaryMeta: { en: "Rarity", ar: "الندرة" },
      secondaryMeta: { en: "Stock", ar: "المخزون" },
      ctaLabel: { en: "Add to Loadout", ar: "أضف إلى الطقم" },
    },
  },
  landing: {
    heroAnimation: "rgb-pixel",
    sectionOrder: ["hero", "liveDrops", "featuredLoot", "leaderboard"],
  },
  copy: {
    addToCart: { en: "Add to Cart", ar: "أضف إلى السلة" },
    emptyCart: { en: "Your loadout is empty.", ar: "طقمك فارغ." },
    viewDetails: { en: "Inspect Item", ar: "افحص العنصر" },
  },
  nav: [
    { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
    { label: { en: "Drops", ar: "الإطلاق" }, href: "/gaming" },
    { label: { en: "Leaderboard", ar: "المتصدرون" }, href: "/gaming" },
  ],
};
