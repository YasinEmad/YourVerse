import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CartDto } from "@/lib/api/types";

const mocks = vi.hoisted(() => ({
  addCartItem: vi.fn(),
  getCart: vi.fn(),
  removeCartItem: vi.fn(),
  updateCartItem: vi.fn(),
}));

vi.mock("@/lib/api/cart", () => mocks);

import { cartStore } from "./cart-store";

function cartWith(items: CartDto["items"]): CartDto {
  return {
    id: "cart-1",
    sessionId: "sess-1",
    items,
    subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    currency: "USD",
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

const hoodie = {
  id: "line-1",
  productSlug: "the-one-hoodie",
  title: "The One Hoodie",
  unitPrice: 89,
  currency: "USD",
  quantity: 1,
};

describe("cartStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cartStore.reset();
  });

  it("starts empty and exposes a stable server snapshot", () => {
    expect(cartStore.get()).toEqual({
      id: "",
      sessionId: "",
      items: [],
      subtotal: 0,
      currency: "USD",
      itemCount: 0,
    });
    expect(cartStore.getServerSnapshot()).toBe(cartStore.getServerSnapshot());
  });

  it("refreshes from the server and notifies subscribers", async () => {
    const serverCart = cartWith([hoodie]);
    mocks.getCart.mockResolvedValue(serverCart);

    const listener = vi.fn();
    const unsubscribe = cartStore.subscribe(listener);

    await cartStore.refresh();

    expect(mocks.getCart).toHaveBeenCalledTimes(1);
    expect(cartStore.get()).toBe(serverCart);
    expect(cartStore.getStatus()).toBe("ready");
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it("hydrates once and is safe to call concurrently", async () => {
    mocks.getCart.mockResolvedValue(cartWith([]));

    await Promise.all([cartStore.hydrate(), cartStore.hydrate(), cartStore.hydrate()]);

    expect(mocks.getCart).toHaveBeenCalledTimes(1);
    expect(cartStore.getStatus()).toBe("ready");
  });

  it("addItem round-trips through the API layer", async () => {
    const serverCart = cartWith([hoodie]);
    mocks.addCartItem.mockResolvedValue(serverCart);

    await cartStore.addItem({ productSlug: "the-one-hoodie", quantity: 1 });

    expect(mocks.addCartItem).toHaveBeenCalledWith({
      productSlug: "the-one-hoodie",
      quantity: 1,
    });
    expect(cartStore.get()).toBe(serverCart);
  });

  it("updateItem applies the server response over the optimistic snapshot", async () => {
    const current = cartWith([hoodie]);
    mocks.getCart.mockResolvedValue(current);
    await cartStore.refresh();

    const reconciled = cartWith([{ ...hoodie, quantity: 3 }]);
    mocks.updateCartItem.mockResolvedValue(reconciled);

    await cartStore.updateItem("line-1", 3);

    expect(mocks.updateCartItem).toHaveBeenCalledWith("line-1", 3);
    expect(cartStore.get()).toBe(reconciled);
  });

  it("updateItem rolls back to the last confirmed snapshot on failure", async () => {
    const current = cartWith([hoodie]);
    mocks.getCart.mockResolvedValue(current);
    await cartStore.refresh();

    mocks.updateCartItem.mockRejectedValue(new Error("offline"));

    await expect(cartStore.updateItem("line-1", 3)).rejects.toThrow("offline");
    expect(cartStore.get()).toBe(current);
    expect(cartStore.getStatus()).toBe("error");
  });

  it("removeItem reconciles with the server response", async () => {
    const current = cartWith([hoodie]);
    mocks.getCart.mockResolvedValue(current);
    await cartStore.refresh();

    const empty = cartWith([]);
    mocks.removeCartItem.mockResolvedValue(empty);

    await cartStore.removeItem("line-1");

    expect(mocks.removeCartItem).toHaveBeenCalledWith("line-1");
    expect(cartStore.get()).toBe(empty);
  });
});
