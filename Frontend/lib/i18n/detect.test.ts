import { describe, expect, it } from "vitest";
import { parseAcceptLanguage, resolveLocale } from "./detect";

const LOCALES = ["en", "ar", "fr"];
const DEFAULT = "en";

describe("parseAcceptLanguage", () => {
  it("returns an empty list for empty input", () => {
    expect(parseAcceptLanguage(null)).toEqual([]);
    expect(parseAcceptLanguage("")).toEqual([]);
  });

  it("parses comma-separated codes in order", () => {
    expect(parseAcceptLanguage("en-US, en;q=0.9, fr;q=0.8")).toEqual([
      "en-us",
      "en",
      "fr",
    ]);
  });

  it("sorts by descending quality", () => {
    expect(parseAcceptLanguage("fr;q=0.7, ar;q=1.0, en;q=0.9")).toEqual([
      "ar",
      "en",
      "fr",
    ]);
  });

  it("treats entries without a q factor as quality 1", () => {
    expect(parseAcceptLanguage("en")).toEqual(["en"]);
  });
});

describe("resolveLocale", () => {
  it("prefers the locale cookie when it is configured", () => {
    expect(
      resolveLocale({ cookie: "ar", acceptLanguage: "en", locales: LOCALES, defaultLocale: DEFAULT }),
    ).toBe("ar");
  });

  it("ignores an unknown cookie value", () => {
    expect(
      resolveLocale({ cookie: "xx", acceptLanguage: "fr", locales: LOCALES, defaultLocale: DEFAULT }),
    ).toBe("fr");
  });

  it("matches Accept-Language exactly", () => {
    expect(resolveLocale({ cookie: null, acceptLanguage: "fr-FR,fr;q=0.9", locales: LOCALES, defaultLocale: DEFAULT })).toBe(
      "fr",
    );
  });

  it("matches the base language of a regional Accept-Language value", () => {
    expect(
      resolveLocale({ cookie: null, acceptLanguage: "en-GB;q=0.8", locales: LOCALES, defaultLocale: DEFAULT }),
    ).toBe("en");
  });

  it("falls back to the configured default when nothing matches", () => {
    expect(
      resolveLocale({ cookie: null, acceptLanguage: "de-DE,de;q=0.9", locales: LOCALES, defaultLocale: DEFAULT }),
    ).toBe(DEFAULT);
  });

  it("works for any configured locale list, not just en/ar", () => {
    expect(
      resolveLocale({
        cookie: null,
        acceptLanguage: "pl-PL",
        locales: ["de", "pl"],
        defaultLocale: "de",
      }),
    ).toBe("pl");
  });
});
