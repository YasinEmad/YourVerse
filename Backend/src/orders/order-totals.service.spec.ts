import {
  COD_HANDLING_FEE_CENTS,
  SHIPPING_FLAT_RATE_CENTS,
  TAX_RATE,
  computeOrderTotals,
} from "./order-totals.service";

// Unit tests for the single source of truth for totals math. Values are
// integer cents (the DB convention). For whole-dollar-to-the-cent prices these
// must equal what the frontend's lib/orders/order-totals.ts (major units)
// computes — the Phase 0 parity that prevents a silent cutover change.
describe("computeOrderTotals", () => {
  it("computes zero totals for an empty cart", () => {
    expect(computeOrderTotals([])).toEqual({ subtotal: 0, shipping: 0, tax: 0, total: 0 });
  });

  it("applies the flat shipping rate to any non-empty cart", () => {
    const totals = computeOrderTotals([{ unitPriceCents: 8900, quantity: 1 }]);
    expect(totals.subtotal).toBe(8900);
    expect(totals.shipping).toBe(SHIPPING_FLAT_RATE_CENTS);
  });

  it("derives tax from the subtotal and folds everything into total", () => {
    const totals = computeOrderTotals([{ unitPriceCents: 10000, quantity: 2 }]);
    expect(totals.subtotal).toBe(20000);
    expect(totals.shipping).toBe(500);
    expect(totals.tax).toBe(Math.round(20000 * TAX_RATE));
    expect(totals.total).toBe(20000 + 500 + Math.round(20000 * TAX_RATE));
  });

  it("rounds tax to the nearest cent, matching the frontend's cents rounding", () => {
    // Frontend major units: 19.99 * 3 = 59.97, tax = round2(59.97 * 0.1) = 6.00.
    const totals = computeOrderTotals([{ unitPriceCents: 1999, quantity: 3 }]);
    expect(totals.subtotal).toBe(5997);
    expect(totals.tax).toBe(600);
    expect(totals.total).toBe(5997 + 500 + 600);
  });

  it("is exactly equivalent to the frontend calculator for whole-dollar prices", () => {
    // The same cart, once in the frontend's major units and once in cents,
    // must produce the same dollar figures after /100.
    const major = [{ unitPrice: 89, quantity: 2 }];
    const subtotalMajor = 89 * 2;
    const shippingMajor = 5;
    const taxMajor = Math.round(subtotalMajor * 0.1 * 100) / 100;

    const cents = computeOrderTotals([{ unitPriceCents: 8900, quantity: 2 }]);
    expect(cents.subtotal / 100).toBe(subtotalMajor);
    expect(cents.shipping / 100).toBe(shippingMajor);
    expect(cents.tax / 100).toBe(taxMajor);
    expect(cents.total / 100).toBe(subtotalMajor + shippingMajor + taxMajor);
  });

  it("keeps the COD handling fee at 0 but folded into total (single edit point)", () => {
    expect(COD_HANDLING_FEE_CENTS).toBe(0);
    const totals = computeOrderTotals([{ unitPriceCents: 8900, quantity: 1 }]);
    expect(totals.total).toBe(totals.subtotal + totals.shipping + totals.tax + COD_HANDLING_FEE_CENTS);
  });
});
