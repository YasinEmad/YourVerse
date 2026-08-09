import { CartItemDto } from "./dto/cart-item.dto";
import { CartDto } from "./dto/cart.dto";

// Row shapes read from Prisma (Cart + items with their Product).
// Exported so the contract test can build a representative sample.
export interface CartItemRow {
  id: string;
  quantity: number;
  product: {
    slug: string;
    baseTitle: string;
    basePrice: number; // minor units (cents)
    currency: string;
  };
}

export interface CartRow {
  id: string;
  sessionId: string;
  items: CartItemRow[];
}

// Serializes a Cart row to the frontend contract shape. unitPrice is the
// product's basePrice in MAJOR units (the frontend renders the number directly,
// like the Phase 0 catalog mapper). No imageUrl: the base product has no image
// and the cart request carries no world context to pick a presentation image.
export function toCartDto(cart: CartRow): CartDto {
  const items: CartItemDto[] = cart.items.map((item) => ({
    id: item.id,
    productSlug: item.product.slug,
    title: item.product.baseTitle,
    unitPrice: item.product.basePrice / 100,
    currency: item.product.currency,
    quantity: item.quantity,
  }));

  const subtotal = roundToCents(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    sessionId: cart.sessionId,
    items,
    subtotal,
    currency: items[0]?.currency ?? "USD",
    itemCount,
  };
}

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}
