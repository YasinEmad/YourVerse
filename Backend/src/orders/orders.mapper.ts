import { OrderItemDto, OrderDto } from "./dto/order.dto";

// Row shapes read from Prisma (Order + items with their Product). Exported so
// the contract test can build a representative sample.
export interface OrderItemRow {
  id: string;
  quantity: number;
  unitPrice: number; // cents, captured at purchase time
  product: {
    slug: string;
    baseTitle: string;
  };
}

export interface OrderRow {
  id: string;
  status: OrderDto["status"];
  subtotal: number; // cents
  shipping: number; // cents
  tax: number; // cents
  total: number; // cents
  currency: string;
  shippingAddress: unknown; // AddressDto stored as Prisma Json
  createdAt: Date;
  items: OrderItemRow[];
}

// Serializes an Order row to the frontend contract shape. Money moves from
// integer cents (DB convention) to major units at this boundary, exactly like
// the Phase 0 catalog/cart mappers and the mock's orders route.
//
// unitPrice on OrderItemDto is the SNAPSHOTTED value — never recomputed from
// the live Product row (rule 2). title/productSlug are not snapshotted (per
// backend-architecture.md §4, OrderItem stores only productId), so they are
// read through the Product join here.
export function toOrderDto(order: OrderRow): OrderDto {
  const items: OrderItemDto[] = order.items.map((item) => {
    const unitPrice = item.unitPrice / 100;
    return {
      id: item.id,
      productSlug: item.product.slug,
      title: item.product.baseTitle,
      unitPrice,
      quantity: item.quantity,
      lineTotal: roundToCents(unitPrice * item.quantity),
    };
  });

  return {
    id: order.id,
    orderNumber: `MV-${order.id.slice(0, 8).toUpperCase()}`,
    status: order.status,
    items,
    subtotal: order.subtotal / 100,
    shipping: order.shipping / 100,
    tax: order.tax / 100,
    total: order.total / 100,
    currency: order.currency,
    shippingAddress: order.shippingAddress as OrderDto["shippingAddress"],
    createdAt: order.createdAt.toISOString(),
  };
}

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}
