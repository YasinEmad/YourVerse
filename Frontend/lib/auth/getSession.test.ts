import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/lib/api/server", () => ({}));

vi.mock("@/lib/api/users", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

import { getSession, requireSession } from "./getSession";

const user = { id: "u1", email: "a@example.com", loyaltyPoints: 0 };

describe("getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when the backend responds 401 (getCurrentUser → null)", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    await expect(getSession()).resolves.toBeNull();
  });

  it("returns the authenticated user when the backend responds 200", async () => {
    mocks.getCurrentUser.mockResolvedValue(user);

    await expect(getSession()).resolves.toEqual({ user });
  });

  it("requireSession redirects to /login when there is no session", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);
    mocks.redirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });

  it("requireSession returns the user when authenticated", async () => {
    mocks.getCurrentUser.mockResolvedValue(user);

    await expect(requireSession()).resolves.toEqual({ user });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
