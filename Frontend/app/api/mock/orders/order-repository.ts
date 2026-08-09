import type { AddressDto, OrderDto, OrderItemDto, OrderStatus } from "@/lib/api/types";
import { computeOrderTotals } from "@/lib/orders/order-totals";
import { getCart } from "../cart/cart-repository";
import { clearCart } from "../cart/cart-repository";

export interface CreateOrderInput {
  sessionId: string;
  cartId: string;
  shippingAddress: AddressDto;
}

interface StoredOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  sessionId: string;
  items: OrderItemDto[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: AddressDto;
  createdAt: string;
}

interface MockOrderState {
  orders: Map<string, StoredOrder>;
}

const globalState = globalThis as typeof globalThis & {
  __yourverseMockOrderState?: MockOrderState;
};

const state: MockOrderState = (globalState.__yourverseMockOrderState ??= {
  orders: new Map<string, StoredOrder>(),
});

export function createOrder(input: CreateOrderInput): OrderDto {
  const cart = getCart(input.sessionId);
  if (cart.items.length === 0) {
    throw new MockOrderError("Cart is empty", 400);
  }

  const items: OrderItemDto[] = cart.items.map((item) => ({
    id: item.id,
    productSlug: item.productSlug,
    title: item.title,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    lineTotal: item.unitPrice * item.quantity,
  }));

  const totals = computeOrderTotals(items);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const order: StoredOrder = {
    id,
    orderNumber: `MV-${id.slice(0, 8).toUpperCase()}`,
    status: "PENDING",
    sessionId: input.sessionId,
    items,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    tax: totals.tax,
    total: totals.total,
    currency: cart.currency,
    shippingAddress: input.shippingAddress,
    createdAt,
  };

  state.orders.set(id, order);
  clearCart(input.sessionId);

  return order;
}

export function getOrder(orderId: string): OrderDto | null {
  return state.orders.get(orderId) ?? null;
}

export function getOrdersForSession(sessionId: string): OrderDto[] {
  return [...state.orders.values()]
    .filter((order) => order.sessionId === sessionId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export class MockOrderError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "MockOrderError";
  }
}
