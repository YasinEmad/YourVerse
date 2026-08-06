import { z } from "zod";

export const MIN_CONTRAST_RATIO = 4.5;

export const PRODUCT_CARD_VARIANTS = ["repo", "character", "verse", "player", "loot", "square"] as const;
export const MOTION_PROFILES = ["terminal", "neon-glitch", "ink", "stadium", "rgb-pixel", "marble"] as const;
export const RADIUS_SCALES = ["sharp", "soft", "round"] as const;
export const TEXT_COLOR_KEYS = ["textColor", "textMutedColor"] as const;
export const BACKGROUND_KEYS = ["bg", "bgAlt", "surface"] as const;

function toLinearChannel(value: number): number {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return 0;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return 0.2126 * toLinearChannel(r) + 0.7152 * toLinearChannel(g) + 0.0722 * toLinearChannel(b);
}

export function contrastRatio(a: string, b: string): number {
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{6})$/, "expected a 6-digit hex color, e.g. #101216");

const localizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

const colorSetSchema = z.object({
  bg: hexColorSchema,
  bgAlt: hexColorSchema,
  surface: hexColorSchema,
  primary: hexColorSchema,
  accent: hexColorSchema,
  border: hexColorSchema,
});

const fontSetSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  mono: z.string().optional(),
  arabic: z.string().optional(),
});

const themeSchema = z.object({
  colors: colorSetSchema,
  textColor: hexColorSchema,
  textMutedColor: hexColorSchema,
  fonts: fontSetSchema,
  radius: z.enum(RADIUS_SCALES),
  motionProfile: z.enum(MOTION_PROFILES),
});

const fieldLabelsSchema = z.object({
  title: localizedStringSchema,
  primaryMeta: localizedStringSchema,
  secondaryMeta: localizedStringSchema.optional(),
  ctaLabel: localizedStringSchema,
});

const productCardSchema = z.object({
  variant: z.enum(PRODUCT_CARD_VARIANTS),
  fieldLabels: fieldLabelsSchema,
});

const landingSchema = z.object({
  heroAnimation: z.enum(MOTION_PROFILES),
  sectionOrder: z.array(z.string().min(1)).min(1),
});

const copySchema = z.object({
  addToCart: localizedStringSchema,
  emptyCart: localizedStringSchema,
  viewDetails: localizedStringSchema,
});

const navLinkSchema = z.object({
  label: localizedStringSchema,
  href: z.string().min(1),
});

export const worldConfigSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "slug must be lowercase alphanumeric characters and hyphens"),
    isActive: z.boolean(),
    name: localizedStringSchema,
    tagline: localizedStringSchema,
    theme: themeSchema,
    productCard: productCardSchema,
    landing: landingSchema,
    copy: copySchema,
    nav: z.array(navLinkSchema).min(1),
  })
  .superRefine((world, ctx) => {
    for (const textColorKey of TEXT_COLOR_KEYS) {
      const textColor = world.theme[textColorKey];
      for (const bgColorKey of BACKGROUND_KEYS) {
        const bgColor = world.theme.colors[bgColorKey];
        const ratio = contrastRatio(textColor, bgColor);
        if (ratio < MIN_CONTRAST_RATIO) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["theme", textColorKey],
            message:
              `${textColorKey} has contrast ratio ${ratio.toFixed(2)}:1 against ` +
              `${bgColorKey}. Minimum required is ${MIN_CONTRAST_RATIO}:1 ` +
              "(WCAG 2.1 AA) for normal text.",
          });
        }
      }
    }
  });

export type WorldConfigSchema = z.infer<typeof worldConfigSchema>;
