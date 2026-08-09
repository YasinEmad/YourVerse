import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  apiRequest,
  SESSION_HEADER_NAME,
  setBaseUrlResolver,
  setSessionIdResolver,
} from "./client";

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("api client", () => {
  beforeEach(() => {
    setBaseUrlResolver(() => "http://backend.test");
    setSessionIdResolver(() => null);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setSessionIdResolver(() => null);
  });

  it("sends the guest session id and no auth/token headers — guest cart works before login", async () => {
    setSessionIdResolver(() => "guest-session-1");
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));

    await apiRequest("/cart");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers[SESSION_HEADER_NAME]).toBe("guest-session-1");
    const headerKeys = Object.keys(init.headers as Record<string, string>);
    expect(headerKeys).not.toContain("authorization");
    expect(headerKeys).not.toContain("x-firebase-token");
    expect(headerKeys).not.toContain("token");
    expect(init.credentials).toBe("include");
  });

  it("works with no session id — no auth header is required for public routes", async () => {
    setSessionIdResolver(() => null);
    fetchMock.mockResolvedValue(jsonResponse([]));

    await apiRequest("/worlds");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers[SESSION_HEADER_NAME]).toBeUndefined();
    expect(init.headers.authorization).toBeUndefined();
  });

  it("throws ApiError with status and message on non-2xx responses", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: "not found" }, 404));

    const error = await apiRequest("/products/missing").catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404 });
  });

  it("resolves undefined for 204 No Content responses", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      apiRequest<unknown>("/users/logout", { method: "POST" }),
    ).resolves.toBeUndefined();
  });
});
