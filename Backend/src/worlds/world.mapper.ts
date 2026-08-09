import { Prisma } from "@prisma/client";
import { toLocalizedText } from "../common/utils/json-text";
import { ProductListItemDto } from "../catalog/dto/product-list-item.dto";
import { WorldDetailDto } from "./dto/world-detail.dto";
import { WorldSummaryDto } from "./dto/world-summary.dto";

export interface WorldRow {
  slug: string;
  name: Prisma.JsonValue;
  tagline: Prisma.JsonValue;
  isActive: boolean;
}

export function toWorldSummaryDto(world: WorldRow): WorldSummaryDto {
  return {
    slug: world.slug,
    name: toLocalizedText(world.name),
    tagline: toLocalizedText(world.tagline),
    isActive: world.isActive,
  };
}

export function toWorldDetailDto(
  world: WorldRow,
  products: ProductListItemDto[],
): WorldDetailDto {
  return {
    world: toWorldSummaryDto(world),
    products,
  };
}
