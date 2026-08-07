import { describe, expect, it } from "vitest";
import { getDictionaries } from "./getDictionary";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return [];
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => [
      `${prefix}${key}`,
      ...keyPaths(child, `${prefix}${key}.`),
    ]);
  }
  return [];
}

function flatten(value: unknown, prefix = ""): Record<string, string> {
  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>(
      (acc, [key, child]) => ({ ...acc, ...flatten(child, `${prefix}${key}.`) }),
      {},
    );
  }
  return { [prefix.slice(0, -1)]: String(value) };
}

describe("locale dictionaries", () => {
  it("every dictionary exposes the exact same key structure", () => {
    const dictionaries = getDictionaries();
    const reference = keyPaths(dictionaries.en).sort();

    for (const [locale, dict] of Object.entries(dictionaries)) {
      expect(keyPaths(dict).sort(), `${locale} keys`).toEqual(reference);
    }
  });

  it("every string value is real copy with no empty placeholders", () => {
    for (const [locale, dict] of Object.entries(getDictionaries())) {
      for (const [path, value] of Object.entries(flatten(dict))) {
        expect(value.length, `${locale} ${path}`).toBeGreaterThan(0);
        expect(value, `${locale} ${path}`).not.toMatch(/^\s*$/);
      }
    }
  });
});
