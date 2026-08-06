export type Locale = "en" | "ar";

export interface LocalizedText {
  en: string;
  ar: string;
}

export type ProductCardVariant = "repo" | "character" | "verse" | "player" | "loot" | "square";

export type RadiusScale = "sharp" | "soft" | "round";

export type MotionProfile =
  | "terminal"
  | "neon-glitch"
  | "ink"
  | "stadium"
  | "rgb-pixel"
  | "marble";

export interface WorldColorSet {
  bg: string;
  bgAlt: string;
  surface: string;
  primary: string;
  accent: string;
  border: string;
}

export interface WorldFontSet {
  heading: string;
  body: string;
  mono?: string;
  arabic?: string;
}

export interface WorldTheme {
  colors: WorldColorSet;
  textColor: string;
  textMutedColor: string;
  fonts: WorldFontSet;
  radius: RadiusScale;
  motionProfile: MotionProfile;
}

export interface WorldCardFieldLabels {
  title: LocalizedText;
  primaryMeta: LocalizedText;
  secondaryMeta?: LocalizedText;
  ctaLabel: LocalizedText;
}

export interface WorldProductCard {
  variant: ProductCardVariant;
  fieldLabels: WorldCardFieldLabels;
}

export interface WorldLanding {
  heroAnimation: MotionProfile;
  sectionOrder: string[];
}

export interface WorldCopy {
  addToCart: LocalizedText;
  emptyCart: LocalizedText;
  viewDetails: LocalizedText;
}

export interface WorldNavLink {
  label: LocalizedText;
  href: string;
}

export interface WorldConfig {
  slug: string;
  isActive: boolean;
  name: LocalizedText;
  tagline: LocalizedText;
  theme: WorldTheme;
  productCard: WorldProductCard;
  landing: WorldLanding;
  copy: WorldCopy;
  nav: WorldNavLink[];
}
