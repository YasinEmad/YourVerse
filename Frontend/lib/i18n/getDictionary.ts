import { defaultLocale, isLocale } from "./config";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import ar from "./dictionaries/ar.json";
import fr from "./dictionaries/fr.json";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ar,
  fr,
};

export type Dictionary = typeof en;

export function getDictionary(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

export function getDictionaries(): Record<Locale, Dictionary> {
  return dictionaries;
}
