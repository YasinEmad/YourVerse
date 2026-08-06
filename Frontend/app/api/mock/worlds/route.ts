import { NextResponse } from "next/server";
import { getActiveWorldConfigs } from "@/config/worlds";
import type { WorldSummaryDto } from "@/lib/api/types";

export function GET(): NextResponse<WorldSummaryDto[]> {
  const worlds: WorldSummaryDto[] = getActiveWorldConfigs().map((config) => ({
    slug: config.slug,
    name: config.name,
    tagline: config.tagline,
    isActive: config.isActive,
  }));

  return NextResponse.json(worlds);
}
