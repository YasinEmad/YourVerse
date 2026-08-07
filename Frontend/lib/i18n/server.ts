import { headers } from "next/headers";
import { defaultLocale, isLocale } from "./config";
import type { Locale } from "./config";
import { getDictionary } from "./getDictionary";
import type { Dictionary } from "./getDictionary";

const LOCALE_HEADER = "x-locale";
const LOW_MOTION_HEADER = "x-low-motion";

export function getLocaleFromHeaders(): Locale {
  const raw = headers().get(LOCALE_HEADER) ?? defaultLocale;
  return isLocale(raw) ? raw : defaultLocale;
}

export function getLowMotionFromHeaders(): boolean {
  return headers().get(LOW_MOTION_HEADER) === "1";
}

export async function getServerDictionary(): Promise<Dictionary> {
  return getDictionary(getLocaleFromHeaders());
}
