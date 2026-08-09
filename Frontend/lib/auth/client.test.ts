import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  getFirebaseAuth: vi.fn(),
  createSession: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  signOut: mocks.signOut,
  updateProfile: mocks.updateProfile,
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseAuth: mocks.getFirebaseAuth,
}));

vi.mock("@/lib/api/users", () => ({
  createSession: mocks.createSession,
  logout: mocks.logout,
}));

import { ApiError } from "@/lib/api/client";
import { authErrorMessage, endSession, loginWithEmail, registerWithEmail } from "./client";

const auth = { name: "test-auth" };

function credentialWith(token: string) {
  return { user: { getIdToken: vi.fn().mockResolvedValue(token) } };
}

describe("client auth boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getFirebaseAuth.mockResolvedValue(auth);
  });

  it("login signs in with Firebase then exchanges the ID token for a session", async () => {
    mocks.signInWithEmailAndPassword.mockResolvedValue(credentialWith("tok-123"));
    mocks.createSession.mockResolvedValue({
      user: { id: "u1", email: "a@example.com", loyaltyPoints: 0 },
    });

    await loginWithEmail("a@example.com", "secret");

    expect(mocks.signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "a@example.com", "secret");
    expect(mocks.createSession).toHaveBeenCalledWith("tok-123");
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it("login propagates Firebase failures", async () => {
    const error = { code: "auth/invalid-credential", message: "bad" };
    mocks.signInWithEmailAndPassword.mockRejectedValue(error);

    await expect(loginWithEmail("a@example.com", "wrong")).rejects.toEqual(error);
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("register creates the Firebase user, records the display name, then exchanges the token", async () => {
    const user = { getIdToken: vi.fn().mockResolvedValue("tok-456") };
    mocks.createUserWithEmailAndPassword.mockResolvedValue({ user });
    mocks.updateProfile.mockResolvedValue(undefined);
    mocks.createSession.mockResolvedValue({
      user: { id: "u2", email: "ada@example.com", name: "Ada", loyaltyPoints: 0 },
    });

    await registerWithEmail("Ada", "ada@example.com", "supersecret");

    expect(mocks.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "ada@example.com",
      "supersecret",
    );
    expect(mocks.updateProfile).toHaveBeenCalledWith(user, { displayName: "Ada" });
    expect(mocks.createSession).toHaveBeenCalledWith("tok-456");
  });

  it("logout ends the backend session first, then signs out Firebase", async () => {
    const order: string[] = [];
    mocks.logout.mockImplementation(async () => {
      order.push("backend");
    });
    mocks.signOut.mockImplementation(async () => {
      order.push("firebase");
    });

    await endSession();

    expect(order).toEqual(["backend", "firebase"]);
    expect(mocks.logout).toHaveBeenCalledTimes(1);
    expect(mocks.signOut).toHaveBeenCalledWith(auth);
  });

  it("maps Firebase error codes to localized auth messages", () => {
    const t = (key: string) => key;

    expect(authErrorMessage({ code: "auth/invalid-credential" }, t)).toBe("auth.invalidCredentials");
    expect(authErrorMessage({ code: "auth/user-not-found" }, t)).toBe("auth.invalidCredentials");
    expect(authErrorMessage({ code: "auth/wrong-password" }, t)).toBe("auth.invalidCredentials");
    expect(authErrorMessage({ code: "auth/email-already-in-use" }, t)).toBe("auth.emailInUse");
    expect(authErrorMessage({ code: "auth/weak-password" }, t)).toBe("auth.weakPassword");
    expect(authErrorMessage({ code: "auth/too-many-requests" }, t)).toBe("auth.tooManyRequests");
    expect(authErrorMessage({ code: "auth/invalid-email" }, t)).toBe("auth.invalidEmail");
    expect(authErrorMessage({ code: "auth/unexpected" }, t)).toBe("auth.unexpectedError");
  });

  it("maps a failed session exchange to the sessionFailed message", () => {
    const t = (key: string) => key;

    expect(authErrorMessage(new ApiError(401, "Invalid ID token"), t)).toBe("auth.sessionFailed");
    expect(authErrorMessage(new Error("network down"), t)).toBe("auth.unexpectedError");
  });
});
