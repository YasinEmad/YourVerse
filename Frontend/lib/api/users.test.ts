import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setBaseUrlResolver } from "./client";
import { createSession, getCurrentUser, logout } from "./users";

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const user = { id: "u1", email: "a@example.com", loyaltyPoints: 0 };

describe("users API", () => {
  beforeEach(() => {
    setBaseUrlResolver(() => "http://backend.test");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getCurrentUser resolves to null on 401", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: "Unauthenticated" }, 401));

    await expect(getCurrentUser()).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://backend.test/users/me",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("getCurrentUser returns the authenticated user on 200", async () => {
    fetchMock.mockResolvedValue(jsonResponse(user));

    await expect(getCurrentUser()).resolves.toEqual(user);
  });

  it("createSession posts the Firebase ID token to /users/session and never returns credentials", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ user }));

    await expect(createSession("firebase-id-token")).resolves.toEqual({ user });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://backend.test/users/session");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ idToken: "firebase-id-token" });
    expect(init.body as string).not.toContain("accessToken");
    expect(init.body as string).not.toContain("refreshToken");
    expect(init.body as string).not.toContain("password");
  });

  it("logout POSTs to /users/logout and resolves on 204", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(logout()).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://backend.test/users/logout");
    expect(init.method).toBe("POST");
  });
});
