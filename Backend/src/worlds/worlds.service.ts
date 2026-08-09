import { Injectable, NotFoundException } from "@nestjs/common";
import { toProductListItemDto } from "../catalog/product.mapper";
import { PrismaService } from "../common/prisma/prisma.service";
import { WorldDetailDto } from "./dto/world-detail.dto";
import { WorldSummaryDto } from "./dto/world-summary.dto";
import { toWorldDetailDto, toWorldSummaryDto } from "./world.mapper";

@Injectable()
export class WorldsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<WorldSummaryDto[]> {
    const worlds = await this.prisma.world.findMany({
      where: { isActive: true },
      orderBy: { slug: "asc" },
    });
    return worlds.map(toWorldSummaryDto);
  }

  async detail(slug: string): Promise<WorldDetailDto> {
    const world = await this.prisma.world.findFirst({
      where: { slug, isActive: true },
    });
    if (!world) {
      throw new NotFoundException("World not found");
    }

    const presentations = await this.prisma.productWorldPresentation.findMany({
      where: { worldId: world.id },
      orderBy: [{ sortWeight: "asc" }, { product: { slug: "asc" } }],
      include: { product: true },
    });

    return toWorldDetailDto(
      world,
      presentations.map((presentation) => toProductListItemDto(presentation)),
    );
  }
}
