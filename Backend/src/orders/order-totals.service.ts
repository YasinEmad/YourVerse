// The ONLY place order totals math may live (backend-architecture.md §12,
// architecture rule 1). Shipping/tax/fees are always recomputed here from the
// cart's current server-side state at order creation — the POST /orders handler
// never accepts or trusts a client-submitted total.
//
// This is a straight port of Frontend/lib/orders/order-totals.ts (which is now
// demoted to a checkout-preview estimate) so the Phase 0 numbers — flat $5
// shipping, 10% tax, rounded to cents — don't silently change on cutover. The
// frontend computes in major units; this service computes in integer minor
// units (cents) because that is the DB convention (Product.basePrice, Order.*).
// For whole-dollar-to-the-cent prices the two are exactly equivalent; the unit
// tests assert that equivalence.

export interface OrderLineInput {
  unitPriceCents: number;
  quantity: number;
}

export interface OrderTotals {
  subtotal: number; // cents
  shipping: number; // cents
  tax: number; // cents
  total: number; // cents
}

// Phase 0 constants — the frontend's SHIPPING_FLAT_RATE ($5) and TAX_RATE
// (10%), in cents / as a fraction respectively.
export const SHIPPING_FLAT_RATE_CENTS = 500;
export const TAX_RATE = 0.1;

// COD-specific handling fee. Some COD businesses charge one; this one
// deliberately does NOT for now, so this is 0 — but the fee is already folded
// into `total` so introducing one later is a one-constant change right here
// (the single edit point per §12), not a new calculation elsewhere. When it
// becomes nonzero, decide in the same change whether OrderDto surfaces a
// `handling` line or folds it into `total` — the frontend preview calculator
// must never be the place that decides.
export const COD_HANDLING_FEE_CENTS = 0;

// Purely functional; no DB, no DI, so it is trivially unit-testable.
export function computeOrderTotals(lines: OrderLineInput[]): OrderTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = itemCount > 0 ? SHIPPING_FLAT_RATE_CENTS : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const handling = itemCount > 0 ? COD_HANDLING_FEE_CENTS : 0;
  const total = subtotal + shipping + tax + handling;
  return { subtotal, shipping, tax, total };
}
