import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AppConfigService } from "../common/config/app-config.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { RedisService } from "../common/redis/redis.service";
import { ProductDetailDto } from "./dto/product-detail.dto";
import { ProductListResponseDto } from "./dto/product-list-response.dto";
import { clampLimit } from "./pagination";
import { toBaseProductDetailDto, toProductListItemDto } from "./product.mapper";
import { ListProductsQueryDto } from "./dto/list-products.query.dto";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: AppConfigService,
  ) {
    // Any ProductWorldPresentation write (through any code path) invalidates the
    // cached list for the affected world(s); null means "world unknown -> purge
    // all list cache keys".
    this.prisma.onProductWorldPresentationWrite((worldIds) => {
      return this.invalidateListCache(worldIds);
    });
  }

  async list(query: ListProductsQueryDto, locale?: string): Promise<ProductListResponseDto> {
    const limit = clampLimit(query.limit);
    const cacheKey = this.listCacheKey(query.worldSlug, query.cursor, limit);

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as ProductListResponseDto;
    }

    const result = query.worldSlug
      ? await this.listByWorld(query.worldSlug, query.cursor, limit, locale)
      : await this.listAll(query.cursor, limit);

    await this.redis.set(cacheKey, JSON.stringify(result), this.config.cacheTtlSeconds);
    return result;
  }

  async detail(slug: string, worldSlug?: string, locale?: string): Promise<ProductDetailDto> {
    if (!worldSlug) {
      const product = await this.prisma.product.findUnique({ where: { slug } });
      if (!product) {
        throw new NotFoundException("Product not found");
      }
      return toBaseProductDetailDto(product);
    }

    const row = await this.prisma.productWorldPresentation.findFirst({
      where: { product: { slug }, world: { slug: worldSlug } },
      include: { product: true },
    });
    if (!row) {
      throw new NotFoundException("Product not found");
    }
    return toProductListItemDto(row, locale);
  }

  async invalidateListCache(worldIds: string[] | null): Promise<void> {
    try {
      if (worldIds === null) {
        await this.redis.delByPattern("catalog:list:*");
        return;
      }
      const worlds = await this.prisma.world.findMany({
        where: { id: { in: worldIds } },
        select: { slug: true },
      });
      for (const world of worlds) {
        await this.redis.delByPattern(`catalog:list:${world.slug}:*`);
      }
    } catch (error) {
      this.logger.warn(
        `Catalog list cache invalidation failed: ${(error as Error).message}`,
      );
    }
  }

  private listCacheKey(
    worldSlug: string | undefined,
    cursor: string | undefined,
    limit: number,
  ): string {
    return `catalog:list:${worldSlug ?? "all"}:${cursor ?? ""}:${limit}`;
  }

  private async listByWorld(
    worldSlug: string,
    cursor: string | undefined,
    limit: number,
    locale?: string,
  ): Promise<ProductListResponseDto> {
    const world = await this.prisma.world.findUnique({ where: { slug: worldSlug } });
    if (!world) {
      return { items: [], nextCursor: null };
    }

    const cursorRow = cursor
      ? await this.prisma.productWorldPresentation.findFirst({
          where: { worldId: world.id, product: { slug: cursor } },
          select: { sortWeight: true, product: { select: { slug: true } } },
        })
      : null;

    const rows = await this.prisma.productWorldPresentation.findMany({
      where: {
        worldId: world.id,
        ...(cursorRow
          ? {
              OR: [
                { sortWeight: { gt: cursorRow.sortWeight } },
                {
                  sortWeight: cursorRow.sortWeight,
                  product: { slug: { gt: cursorRow.product.slug } },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ sortWeight: "asc" }, { product: { slug: "asc" } }],
      take: limit + 1,
      include: { product: true },
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const items = page.map((row) => toProductListItemDto(row, locale));
    const nextCursor = hasMore ? page[page.length - 1].product.slug : null;
    return { items, nextCursor };
  }

  private async listAll(
    cursor: string | undefined,
    limit: number,
  ): Promise<ProductListResponseDto> {
    const rows = await this.prisma.product.findMany({
      where: cursor ? { slug: { gt: cursor } } : {},
      orderBy: { slug: "asc" },
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const items = page.map(toBaseProductDetailDto);
    const nextCursor = hasMore ? page[page.length - 1].slug : null;
    return { items, nextCursor };
  }
}
