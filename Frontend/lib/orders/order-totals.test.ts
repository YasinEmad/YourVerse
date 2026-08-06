import { describe, expect, it } from "vitest";
import { computeOrderTotals, TAX_RATE, SHIPPING_FLAT_RATE } from "./order-totals";

describe("computeOrderTotals", () => {
  it("computes zero totals for an empty cart", () => {
    expect(computeOrderTotals([])).toEqual({ subtotal: 0, shipping: 0, tax: 0, total: 0 });
  });

  it("applies the flat shipping rate to any non-empty cart", () => {
    const totals = computeOrderTotals([{ unitPrice: 89, quantity: 1 }]);
    expect(totals.subtotal).toBe(89);
    expect(totals.shipping).toBe(SHIPPING_FLAT_RATE);
  });

  it("derives tax from the subtotal", () => {
    const totals = computeOrderTotals([{ unitPrice: 100, quantity: 2 }]);
    expect(totals.subtotal).toBe(200);
    expect(totals.tax).toBe(round2(200 * TAX_RATE));
    expect(totals.total).toBe(round2(200 + SHIPPING_FLAT_RATE + 200 * TAX_RATE));
  });

  it("rounds to cents", () => {
    const totals = computeOrderTotals([{ unitPrice: 19.99, quantity: 3 }]);
    expect(totals.subtotal).toBe(59.97);
    expect(totals.tax).toBe(round2(59.97 * TAX_RATE));
  });
});

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
