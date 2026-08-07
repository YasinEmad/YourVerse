export type Locale = "en" | "ar" | "fr";

export const defaultLocale: Locale = "en";

export const locales: Locale[] = ["en", "ar", "fr"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

export const localeDirs: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
  fr: "ltr",
};

export const LOCALE_COOKIE = "locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function dirForLocale(locale: string): "ltr" | "rtl" {
  return localeDirs[locale as Locale] ?? "ltr";
}
