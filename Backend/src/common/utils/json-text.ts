import { Prisma } from "@prisma/client";

export interface LocalizedTextShape {
  en: string;
  ar: string;
}

// Prisma returns Json columns as JsonValue; narrows to the LocalizedTextDto shape.
export function toLocalizedText(value: Prisma.JsonValue): LocalizedTextShape {
  const raw = (value ?? {}) as Record<string, unknown>;
  return {
    en: typeof raw.en === "string" ? raw.en : "",
    ar: typeof raw.ar === "string" ? raw.ar : "",
  };
}
