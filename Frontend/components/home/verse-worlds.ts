import type { VerseShowcaseProps } from "@/components/home/VerseShowcase";

/* ── WORLD LIST — to add a new world, append an entry below. Nothing else. ──
   `id`       unique handle for the slide
   `label`    name shown to screen readers / controls
   `lottieSrc` remote .lottie animation, or `imageSrc` for a static image
              from /public (image wins when both are set)
   the rest feeds <VerseShowcase /> directly */
export type VerseWorld = Omit<VerseShowcaseProps, "id"> & {
  id: string;
  label: string;
};

export const VERSE_WORLDS: VerseWorld[] = [
  {
    id: "anime",
    label: "Anime",
    imageSrc: "/assets/anime.jpg",
    eyebrow: "Episode 001",
    title: "Choose your verse",
    description:
      "Hand-picked stories that hit different. Your next obsession is one click away.",
    ctaHref: "/anime",
    ctaLabel: "Explore anime",
    accentDotClassName: "bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.4)]",
    glowColor: "#b9a8f7",
  },
  {
    id: "chess",
    label: "Chess",
    lottieSrc:
      "https://lottie.host/1306b39e-7fcf-4b70-bd89-4a55739bc0a6/IYmzaruKUQ.lottie",
    eyebrow: "game 002",
    title: "Make your move",
    description:
      "Legendary openings, quiet endgames and traps worth falling for. Take your seat at the board.",
    ctaHref: "/chess",
    ctaLabel: "Explore chess",
    accentDotClassName: "bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.4)]",
    glowColor: "#e8c98a",
  },
  {
    id: "arabic",
    label: "Arabic",
    lottieSrc:
      "https://lottie.host/cf84b1f8-d726-4c8b-98f9-dd53cdd96bd4/lmWC4UyEms.lottie",
    eyebrow: "بيت ٠٠١",
    title: "حبرٌ يعيش أطول من الإمبراطوريات",
    description:
      "أبياتٌ من الديوان الحي — البحرُ والعصرُ والمخطوط، لغةٌ تحملها ذاكرةٌ أقدم من الحدود.",
    ctaHref: "/poetry",
    ctaLabel: "اكتشف الديوان",
    accentDotClassName: "bg-[#C9A24B]/80 shadow-[0_0_8px_rgba(201,162,75,0.4)]",
    glowColor: "#c9a24b",
    rtl: true,
    headingFontClassName: "font-[var(--font-arabic-heading)]",
    bodyFontClassName: "font-[var(--font-arabic-body)]",
  },
];
