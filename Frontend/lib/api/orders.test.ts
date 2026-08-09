import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setBaseUrlResolver } from "./client";
import { createOrder } from "./orders";

const fetchMock = vi.fn();

const address = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  line1: "1 Analytical Engine Way",
  city: "Cairo",
  country: "EG",
};

const order = {
  id: "ord-1",
  orderNumber: "MS-0001",
  status: "PENDING",
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  currency: "USD",
  shippingAddress: address,
  createdAt: "2026-08-09T00:00:00.000Z",
};

describe("checkout API (guest-compatible)", () => {
  beforeEach(() => {
    setBaseUrlResolver(() => "http://backend.test");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates a guest order with cartId + shippingAddress and no credentials", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(order), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );

    const created = await createOrder({ cartId: "cart-1", shippingAddress: address });

    expect(created).toEqual(order);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://backend.test/orders");
    const body = JSON.parse(init.body as string);
    expect(body).toEqual({ cartId: "cart-1", shippingAddress: address });
    expect(body).not.toHaveProperty("idToken");
    expect(body).not.toHaveProperty("accessToken");
    expect(body).not.toHaveProperty("refreshToken");
    expect(body).not.toHaveProperty("userId");
    expect(body).not.toHaveProperty("session");
  });
});
