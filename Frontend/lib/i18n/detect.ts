export interface AcceptLanguageEntry {
  code: string;
  quality: number;
}

export function parseAcceptLanguage(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((part): AcceptLanguageEntry => {
      const [raw, ...params] = part.trim().split(";");
      let quality = 1;
      for (const param of params) {
        const match = param.trim().match(/^q=([0-9.]+)$/i);
        if (match) {
          quality = Number(match[1]);
        }
      }
      return { code: raw.trim().toLowerCase(), quality };
    })
    .filter((entry) => entry.code.length > 0)
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.code);
}

export function resolveLocale(options: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  locales: readonly string[];
  defaultLocale: string;
}): string {
  const { cookie, acceptLanguage, locales, defaultLocale } = options;

  const cookieLocale = cookie?.trim().toLowerCase();
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const preferred = parseAcceptLanguage(acceptLanguage);
  const exact = preferred.find((code) => locales.includes(code));
  if (exact) {
    return exact;
  }

  const base = preferred.find((code) => locales.includes(code.slice(0, 2)));
  if (base) {
    return base.slice(0, 2);
  }

  return defaultLocale;
}
