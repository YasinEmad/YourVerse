import { Injectable, NotFoundException } from "@nestjs/common";
import { AppConfigService } from "../common/config/app-config.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { RedisService } from "../common/redis/redis.service";
import { toCartDto } from "./cart.mapper";
import { CartDto } from "./dto/cart.dto";

// Cart reads/writes for the anonymous guest flow (Phase 4 adds the userId side).
//
// Source-of-truth rule (backend-architecture.md §6): every mutation writes the
// Cart/CartItem rows in Postgres FIRST and only then invalidates the
// cart:{sessionId} cache key — a cache write is never treated as success
// without the underlying DB write succeeding, and a stale cache can never be
// observed after a write completes (the key is deleted, not just expired).
@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: AppConfigService,
  ) {}

  // GET /cart — returns the cart for the session, creating an empty one when
  // none exists (mock getOrCreateCart parity).
  async getCart(sessionId: string): Promise<CartDto> {
    const cacheKey = this.cacheKey(sessionId);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as CartDto;
    }
    const dto = await this.readCart(sessionId);
    await this.redis.set(cacheKey, JSON.stringify(dto), this.config.cartCacheTtlSeconds);
    return dto;
  }

  // POST /cart/items — merges into an existing line (increment) when the
  // product is already present, via one atomic upsert on (cartId, productId).
  async addItem(sessionId: string, productSlug: string, quantity: number): Promise<CartDto> {
    const qty = Math.max(1, Math.floor(Number.isFinite(quantity) ? quantity : 1));

    const product = await this.prisma.product.findUnique({ where: { slug: productSlug } });
    if (!product) {
      // Mock message: "Product not found or unavailable". No world context is
      // carried by AddCartItemRequestDto, so availability filtering is not
      // applicable in this phase (the no-world mock product is always
      // available) — unknown slug is the only 404.
      throw new NotFoundException("Product not found or unavailable");
    }

    const cart = await this.getOrCreateCartRow(sessionId);
    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
      create: { cartId: cart.id, productId: product.id, quantity: qty },
      update: { quantity: { increment: qty } },
    });

    return this.afterMutation(sessionId);
  }

  // PATCH /cart/items/:lineId — quantity <= 0 removes the line (mock parity);
  // a missing line for a positive quantity is a 404 ("Cart item not found").
  async updateItem(sessionId: string, lineId: string, quantity: number): Promise<CartDto> {
    const qty = Math.floor(Number.isFinite(quantity) ? quantity : 0);
    const cart = await this.prisma.cart.findUnique({ where: { sessionId } });
    if (!cart) {
      // Mock: PATCH with no cart returns the (created) empty cart.
      return this.readCart(sessionId);
    }

    if (qty <= 0) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id, id: lineId } });
    } else {
      const result = await this.prisma.cartItem.updateMany({
        where: { cartId: cart.id, id: lineId },
        data: { quantity: qty },
      });
      if (result.count === 0) {
        throw new NotFoundException("Cart item not found");
      }
    }

    return this.afterMutation(sessionId);
  }

  // DELETE /cart/items/:lineId — silently removes the line if present (the mock
  // filters without a 404, so double-removes never surface an error to the
  // frontend's optimistic updates).
  async removeItem(sessionId: string, lineId: string): Promise<CartDto> {
    const cart = await this.prisma.cart.findUnique({ where: { sessionId } });
    if (!cart) {
      return this.readCart(sessionId);
    }
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id, id: lineId } });
    return this.afterMutation(sessionId);
  }

  // --- internals -----------------------------------------------------------

  private cacheKey(sessionId: string): string {
    return `cart:${sessionId}`;
  }

  private getOrCreateCartRow(sessionId: string) {
    return this.prisma.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });
  }

  // Fresh read from Postgres (the source of truth) and never from cache.
  private async readCart(sessionId: string): Promise<CartDto> {
    const cart = await this.prisma.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
      include: {
        items: {
          include: { product: true },
          orderBy: { id: "asc" },
        },
      },
    });
    return toCartDto(cart);
  }

  // DB write has already succeeded; drop the cache so the next read is fresh.
  private async afterMutation(sessionId: string): Promise<CartDto> {
    await this.invalidateCache(sessionId);
    return this.readCart(sessionId);
  }

  private async invalidateCache(sessionId: string): Promise<void> {
    await this.redis.del([this.cacheKey(sessionId)]);
  }
}
