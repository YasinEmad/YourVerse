import "./server";
import { ApiError, apiRequest } from "./client";
import type {
  ProductDetailDto,
  ProductListResponseDto,
  ProductListItemDto,
  WorldDetailDto,
  WorldSummaryDto,
} from "./types";

export function getWorlds(): Promise<WorldSummaryDto[]> {
  return apiRequest<WorldSummaryDto[]>("/worlds");
}

export function getWorld(worldSlug: string): Promise<WorldDetailDto | null> {
  return apiRequest<WorldDetailDto>(`/worlds/${encodeURIComponent(worldSlug)}`).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  });
}

export function getWorldProducts(worldSlug: string): Promise<ProductListItemDto[]> {
  return apiRequest<ProductListResponseDto>(
    `/products?worldSlug=${encodeURIComponent(worldSlug)}&limit=100`,
  ).then((response) => response.items);
}

export function getProduct(
  productSlug: string,
  worldSlug?: string,
): Promise<ProductDetailDto | null> {
  const query = worldSlug ? `?world=${encodeURIComponent(worldSlug)}` : "";
  return apiRequest<ProductDetailDto>(
    `/products/${encodeURIComponent(productSlug)}${query}`,
  ).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  });
}
