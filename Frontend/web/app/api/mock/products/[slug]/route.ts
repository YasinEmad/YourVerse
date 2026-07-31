import { NextRequest, NextResponse } from "next/server";
import { getMockProduct } from "@/lib/catalog/mock-catalog";
import type { ProductDetailDto } from "@/lib/api/types";

export function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
): NextResponse<ProductDetailDto | { error: string }> {
  const worldSlug = request.nextUrl.searchParams.get("world") ?? undefined;
  const product = getMockProduct(params.slug, worldSlug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
