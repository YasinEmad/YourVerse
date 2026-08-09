// CHECKOUT PREVIEW ONLY (backend-architecture.md §12): this calculator renders
// running totals in the checkout UI before submission. It is NOT authoritative —
// the backend's order-totals.service.ts is the single source of truth and every
// confirmation page must render the backend's OrderDto.total, never this. This
// file mirrors the backend's Phase 0 constants (flat $5 shipping, 10% tax,
// cents rounding) so the preview doesn't silently diverge at cutover.

export interface OrderLineInput {
  unitPrice: number;
  quantity: number;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const SHIPPING_FLAT_RATE = 5;
export const TAX_RATE = 0.1;

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeOrderTotals(lines: OrderLineInput[]): OrderTotals {
  const subtotal = roundToCents(
    lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  );
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = itemCount > 0 ? SHIPPING_FLAT_RATE : 0;
  const tax = roundToCents(subtotal * TAX_RATE);
  const total = roundToCents(subtotal + shipping + tax);
  return { subtotal, shipping, tax, total };
}
