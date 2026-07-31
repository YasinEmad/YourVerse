import { NextRequest, NextResponse } from "next/server";
import { getAllMockProducts, getMockProducts } from "@/lib/catalog/mock-catalog";
import type { ProductListResponseDto } from "@/lib/api/types";

export function GET(request: NextRequest): NextResponse<ProductListResponseDto> {
  const { searchParams } = request.nextUrl;
  const worldSlug = searchParams.get("worldSlug");
  const cursor = searchParams.get("cursor");
  const parsedLimit = Number(searchParams.get("limit"));
  const limit = Math.min(Math.max(Number.isFinite(parsedLimit) ? parsedLimit : 50, 1), 100);

  const all = worldSlug ? getMockProducts(worldSlug) : getAllMockProducts();
  const startIndex = cursor
    ? all.findIndex((item) => item.slug === cursor) + 1
    : 0;
  const slice = all.slice(startIndex, startIndex + limit);
  const nextCursor = startIndex + limit < all.length ? slice[slice.length - 1]?.slug ?? null : null;

  return NextResponse.json({ items: slice, nextCursor });
}
