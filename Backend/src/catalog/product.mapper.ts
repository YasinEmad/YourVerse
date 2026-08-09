import { Prisma } from "@prisma/client";
import { toLocalizedText } from "../common/utils/json-text";
import { ProductDetailDto } from "./dto/product-detail.dto";
import { ProductListItemDto } from "./dto/product-list-item.dto";

// Product.basePrice is stored in minor units (cents) per backend-architecture.md
// §4; the frontend DTOs (which already render price directly) use major units.
export const PRICE_SCALE = 100;

export interface PresentationRow {
  title: Prisma.JsonValue;
  subtitle: string | null;
  primaryValue: string;
  secondaryValue: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  badge: string | null;
  isAvailable: boolean;
  product: {
    slug: string;
    basePrice: number;
    currency: string;
  };
}

export interface ProductRow {
  slug: string;
  baseTitle: string;
  basePrice: number;
  currency: string;
}

// PWP title is stored as a LocalizedTextDto but the frontend contract wants a
// single string. The frontend never sends a locale header today (defaults to
// "en"); seed data populates both locales with the same display title so the
// output is identical to the mock regardless.
export function resolveTitle(value: Prisma.JsonValue, locale?: string): string {
  const title = toLocalizedText(value);
  if (locale === "ar" && title.ar) return title.ar;
  return title.en ?? "";
}

export function toProductListItemDto(
  row: PresentationRow,
  locale?: string,
): ProductListItemDto {
  return {
    slug: row.product.slug,
    title: resolveTitle(row.title, locale),
    subtitle: row.subtitle ?? undefined,
    primaryMeta: row.primaryValue ?? undefined,
    secondaryMeta: row.secondaryValue ?? undefined,
    price: row.product.basePrice / PRICE_SCALE,
    currency: row.product.currency,
    badge: row.badge ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    accentColor: row.accentColor ?? undefined,
    available: row.isAvailable,
  };
}

export function toBaseProductDetailDto(product: ProductRow): ProductDetailDto {
  return {
    slug: product.slug,
    title: product.baseTitle,
    price: product.basePrice / PRICE_SCALE,
    currency: product.currency,
    available: true,
  };
}
