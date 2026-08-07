"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./getDictionary";
import { translate } from "./translate";
import type { Translate } from "./translate";

export interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  dir: "ltr" | "rtl";
  lowMotion: boolean;
  t: Translate;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  locale,
  dict,
  dir,
  lowMotion,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  dir: "ltr" | "rtl";
  lowMotion: boolean;
  children: ReactNode;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({ locale, dict, dir, lowMotion, t: (path, params) => translate(dict, path, params) }),
    [locale, dict, dir, lowMotion],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used within a LocaleProvider");
  }
  return value;
}
