import { describe, expect, it } from "vitest";
import { getDictionary } from "./getDictionary";
import { createTranslator, interpolate, lookup, translate } from "./translate";

describe("getDictionary", () => {
  it("loads the dictionary for a configured locale", () => {
    const ar = getDictionary("ar");
    expect(ar.nav.home).toBe("الرئيسية");
    expect(ar.orders.title).toBe("الطلبات");
  });

  it("loads the throwaway third locale without touching component logic", () => {
    const fr = getDictionary("fr");
    expect(fr.nav.cart).toBe("Panier");
    expect(fr.auth.login).toBe("Se connecter");
  });

  it("falls back to the default locale for unknown locales", () => {
    expect(getDictionary("xx")).toBe(getDictionary("en"));
  });
});

describe("translate", () => {
  it("resolves nested keys", () => {
    const en = getDictionary("en");
    expect(lookup(en, "checkout.steps.shipping")).toBe("Shipping");
    expect(translate(en, "orders.statuses.completed")).toBe("Completed");
  });

  it("returns the path itself when a key is missing", () => {
    expect(lookup(getDictionary("en"), "missing.key")).toBe("missing.key");
  });

  it("interpolates named parameters", () => {
    const en = getDictionary("en");
    expect(translate(en, "orders.orderNumber", { number: "MV-123" })).toBe("Order MV-123");
    expect(translate(en, "a11y.cartItemCount", { count: 3 })).toBe("Cart, 3 items");
  });

  it("creates a bound translator", () => {
    const t = createTranslator(getDictionary("en"));
    expect(t("cart.empty")).toBe("Your cart is empty.");
    expect(t("loyalty.points", { points: 120 })).toBe("120 points");
  });

  it("interpolate leaves unknown placeholders untouched", () => {
    expect(interpolate("Hi {name}", { other: "x" })).toBe("Hi {name}");
  });
});
