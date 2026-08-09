import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkoutSteps, getCheckoutStep } from "./checkout-steps";

const shopDir = fileURLToPath(new URL(".", import.meta.url));

describe("checkout steps (COD-only)", () => {
  it("has exactly shipping and review — no payment selection step", () => {
    expect(checkoutSteps.map((step) => step.id)).toEqual(["shipping", "review"]);
  });

  it("has no payment/card/wallet step", () => {
    expect(getCheckoutStep("payment")).toBeUndefined();
    expect(checkoutSteps.some((step) => /payment|card|wallet/.test(step.id))).toBe(false);
  });

  it("review is the final step that places the COD order", () => {
    const review = getCheckoutStep("review");
    expect(review).toBeDefined();
    expect(review?.labelKey).toBe("checkout.steps.review");
  });

  it("contains no payment-gateway or fake card/wallet UI code", () => {
    const sources = [
      "checkout-steps.tsx",
      "CheckoutSteps.tsx",
      join("steps", "ShippingStep.tsx"),
      join("steps", "ReviewStep.tsx"),
    ];
    for (const file of sources) {
      const source = readFileSync(join(shopDir, file), "utf8");
      expect(source, file).not.toMatch(/stripe|paymob/i);
      expect(source, file).not.toMatch(/PaymentMethodSelect|payment-methods|CardForm|WalletForm/);
      expect(source, file).not.toMatch(/card\.number|card\.expiry|card\.cvc|wallet\.email/);
    }
  });
});
