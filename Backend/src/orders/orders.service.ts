import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { CartService } from "../cart/cart.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { AddressDto } from "./dto/create-order-request.dto";
import { OrderDto } from "./dto/order.dto";
import { toOrderDto } from "./orders.mapper";
import { computeOrderTotals } from "./order-totals.service";

// Sentinel for OrderItem.worldSlug. The cart carries no world context this
// phase (AddCartItemRequestDto has only productSlug), so order creation records
// this rather than inventing a world — see schema.prisma OrderItem. When the
// cart gains world context this column starts recording it without a schema
// change.
export const NO_WORLD_SLUG = "__none__";

// Order creation (backend-architecture.md §4 rules):
//   1. totals are recomputed HERE from the cart's current server-side state —
//      a client-submitted total is never read, let alone trusted;
//   2. OrderItem.unitPrice snapshots the price at purchase time;
//   3. every order is created status PENDING with no charge step (COD is
//      implicit — there is no payment method concept in this phase);
//   4. order + order items are written and the cart cleared in ONE Prisma
//      transaction, so a failure mid-way leaves neither an order nor a cleared
//      cart behind.
@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  // POST /orders — creates an order for the resolved session. `sessionId` is
  // the guest session id for guests, or the User.id for authenticated users
  // (Order.sessionId holds whichever, matching Cart.sessionId). `userId` is
  // written for authenticated orders to wire the User relation (Phase 4A); it
  // is never a lookup key — ownership lookups use sessionId.
  async createOrder(
    sessionId: string,
    shippingAddress: AddressDto,
    options: { userId?: string } = {},
  ): Promise<OrderDto> {
    const order = await this.prisma.$transaction(async (tx) => {
      const cart = await this.cartService.getCartForOrder(sessionId, tx);
      if (cart.items.length === 0) {
        throw new BadRequestException("Cart is empty");
      }

      const totals = computeOrderTotals(cart.items);

      const created = await tx.order.create({
        data: {
          sessionId,
          ...(options.userId ? { userId: options.userId } : {}),
          status: "PENDING",
          shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          currency: cart.currency,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              worldSlug: NO_WORLD_SLUG,
              quantity: item.quantity,
              unitPrice: item.unitPriceCents,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      await this.cartService.clearCart(sessionId, tx);

      return created;
    });

    return toOrderDto(order);
  }

  // GET /orders — newest first, matching the mock's getOrdersForSession sort.
  async listOrders(sessionId: string): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true }, orderBy: { id: "asc" } } },
    });
    return orders.map(toOrderDto);
  }

  // GET /orders/:id — scoped to the resolved session: an order that exists but
  // belongs to a different session is indistinguishable from an unknown one
  // (404, no existence leak). Phase 4 extends the where clause to userId.
  async getOrderForSession(sessionId: string, orderId: string): Promise<OrderDto> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, sessionId },
      include: { items: { include: { product: true }, orderBy: { id: "asc" } } },
    });
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return toOrderDto(order);
  }
}
