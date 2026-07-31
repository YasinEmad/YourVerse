import { NextRequest, NextResponse } from "next/server";
import { getWorldConfig } from "@/config/worlds";
import { getMockProducts } from "@/lib/catalog/mock-catalog";
import type { WorldDetailDto } from "@/lib/api/types";

export function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } },
): NextResponse<WorldDetailDto | { error: string }> {
  const config = getWorldConfig(params.slug);

  if (!config || !config.isActive) {
    return NextResponse.json({ error: "World not found" }, { status: 404 });
  }

  const world: WorldDetailDto = {
    world: {
      slug: config.slug,
      name: config.name,
      tagline: config.tagline,
      isActive: config.isActive,
    },
    products: getMockProducts(config.slug),
  };

  return NextResponse.json(world);
}
