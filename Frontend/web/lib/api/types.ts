import type { ProductViewModel } from "@/types/product";

export interface LocalizedTextDto {
  en: string;
  ar: string;
}

export interface WorldSummaryDto {
  slug: string;
  name: LocalizedTextDto;
  tagline: LocalizedTextDto;
  isActive: boolean;
}

export interface WorldDetailDto {
  world: WorldSummaryDto;
  products: ProductViewModel[];
}

export interface ProductListItemDto extends ProductViewModel {}

export interface ProductDetailDto extends ProductViewModel {}

export interface ProductListResponseDto {
  items: ProductListItemDto[];
  nextCursor: string | null;
}
