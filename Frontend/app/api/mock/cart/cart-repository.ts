import { getMockProduct } from "@/lib/catalog/mock-catalog";
import type { CartDto, CartItemDto } from "@/lib/api/types";
import { computeOrderTotals } from "@/lib/orders/order-totals";

export interface MockCartLine {
  id: string;
  productSlug: string;
  title: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export interface MockCart {
  id: string;
  sessionId: string;
  lines: MockCartLine[];
}

interface MockCartState {
  carts: Map<string, MockCart>;
}

const globalState = globalThis as typeof globalThis & {
  __yourverseMockCartState?: MockCartState;
};

const state: MockCartState = (globalState.__yourverseMockCartState ??= {
  carts: new Map<string, MockCart>(),
});

function toLineId(): string {
  return `line-${crypto.randomUUID()}`;
}

function toCartDto(cart: MockCart): CartDto {
  const totals = computeOrderTotals(cart.lines);
  const items: CartItemDto[] = cart.lines.map((line) => ({
    id: line.id,
    productSlug: line.productSlug,
    title: line.title,
    unitPrice: line.unitPrice,
    currency: line.currency,
    quantity: line.quantity,
  }));
  return {
    id: cart.id,
    sessionId: cart.sessionId,
    items,
    subtotal: totals.subtotal,
    currency: cart.lines[0]?.currency ?? "USD",
    itemCount: cart.lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

function getOrCreateCart(sessionId: string): MockCart {
  let cart = state.carts.get(sessionId);
  if (!cart) {
    cart = { id: `cart-${sessionId}`, sessionId, lines: [] };
    state.carts.set(sessionId, cart);
  }
  return cart;
}

export function getCart(sessionId: string): CartDto {
  return toCartDto(getOrCreateCart(sessionId));
}

export function addCartItem(
  sessionId: string,
  productSlug: string,
  quantity: number,
): CartDto {
  const cart = getOrCreateCart(sessionId);

  const product = getMockProduct(productSlug);
  if (!product || !product.available) {
    throw new MockCartError("Product not found or unavailable", 404);
  }

  const existing = cart.lines.find((line) => line.productSlug === productSlug);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.lines.push({
      id: toLineId(),
      productSlug: product.slug,
      title: product.title,
      unitPrice: product.price,
      currency: product.currency,
      quantity,
    });
  }

  return toCartDto(cart);
}

export function updateCartItem(sessionId: string, lineId: string, quantity: number): CartDto {
  const cart = state.carts.get(sessionId);
  if (!cart) {
    return getCart(sessionId);
  }
  const line = cart.lines.find((candidate) => candidate.id === lineId);
  if (!line) {
    throw new MockCartError("Cart item not found", 404);
  }
  if (quantity <= 0) {
    cart.lines = cart.lines.filter((candidate) => candidate.id !== lineId);
  } else {
    line.quantity = quantity;
  }
  return toCartDto(cart);
}

export function removeCartItem(sessionId: string, lineId: string): CartDto {
  const cart = state.carts.get(sessionId);
  if (!cart) {
    return getCart(sessionId);
  }
  cart.lines = cart.lines.filter((candidate) => candidate.id !== lineId);
  return toCartDto(cart);
}

export function clearCart(sessionId: string): CartDto {
  const cart = state.carts.get(sessionId);
  if (!cart) {
    return getCart(sessionId);
  }
  cart.lines = [];
  return toCartDto(cart);
}

export class MockCartError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "MockCartError";
  }
}
