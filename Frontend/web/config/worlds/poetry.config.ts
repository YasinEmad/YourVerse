import type { WorldConfig } from "@/types/world-config";

export const poetryWorldConfig: WorldConfig = {
  slug: "poetry",
  isActive: true,
  name: { en: "The Living Diwan", ar: "الديوان الحي" },
  tagline: {
    en: "Ink that outlives empires.",
    ar: "حبرٌ يعيش أطول من الإمبراطوريات.",
  },
  theme: {
    colors: {
      bg: "#12100D",
      bgAlt: "#171310",
      surface: "#1B1713",
      primary: "#C9A24B",
      accent: "#8C6A3F",
      border: "#3A2E1E",
    },
    textColor: "#F4EBD8",
    textMutedColor: "#A89A7F",
    fonts: {
      heading: "Aref Ruqaa",
      body: "Amiri",
      arabic: "Amiri",
    },
    radius: "sharp",
    motionProfile: "ink",
  },
  productCard: {
    variant: "verse",
    fieldLabels: {
      title: { en: "Verse", ar: "البيت" },
      primaryMeta: { en: "Era", ar: "العصر" },
      secondaryMeta: { en: "Meter", ar: "البحر" },
      ctaLabel: { en: "Keep in the Diwan", ar: "أبقِه في الديوان" },
    },
  },
  landing: {
    heroAnimation: "ink",
    sectionOrder: ["hero", "featuredVerses", "eras", "manuscripts"],
  },
  copy: {
    addToCart: { en: "Add to Cart", ar: "أضف إلى السلة" },
    emptyCart: { en: "Your diwan awaits its first verse.", ar: "ديوانك ينتظر أول بيت." },
    viewDetails: { en: "Read the Verse", ar: "اقرأ البيت" },
  },
  nav: [
    { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
    { label: { en: "Diwan", ar: "الديوان" }, href: "/poetry" },
    { label: { en: "Eras", ar: "العصور" }, href: "/poetry" },
  ],
};
