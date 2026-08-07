import type { Dictionary } from "./getDictionary";

export type Translate = (path: string, params?: Record<string, string | number>) => string;

export function lookup(dict: Dictionary, path: string): string {
  const value = path.split(".").reduce<unknown>((node, key) => {
    if (node && typeof node === "object" && key in node) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
  return typeof value === "string" ? value : path;
}

export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const replacement = params[key];
    return replacement === undefined ? match : String(replacement);
  });
}

export function translate(
  dict: Dictionary,
  path: string,
  params?: Record<string, string | number>,
): string {
  return interpolate(lookup(dict, path), params);
}

export function createTranslator(dict: Dictionary): Translate {
  return (path, params) => translate(dict, path, params);
}
