import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const mocks = vi.hoisted(() => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(),
  getAuth: vi.fn(),
  setPersistence: vi.fn(),
  inMemoryPersistence: Symbol("in-memory"),
}));

vi.mock("firebase/app", () => ({
  initializeApp: mocks.initializeApp,
  getApps: mocks.getApps,
}));

vi.mock("firebase/auth", () => ({
  getAuth: mocks.getAuth,
  setPersistence: mocks.setPersistence,
  inMemoryPersistence: mocks.inMemoryPersistence,
}));

type FirebaseClient = typeof import("./client");

let client: FirebaseClient;

const libDir = fileURLToPath(new URL("../", import.meta.url));

describe("firebase client", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mocks.initializeApp.mockImplementation((config: unknown) => ({ config, name: "test-app" }));
    mocks.getApps.mockReturnValue([]);
    mocks.getAuth.mockImplementation((app: unknown) => ({ app, name: "test-auth" }));
    mocks.setPersistence.mockResolvedValue(undefined);

    vi.resetModules();
    client = await import("./client");
  });

  it("initializes the Firebase app exactly once and reuses it", () => {
    const first = client.getFirebaseApp();
    const second = client.getFirebaseApp();

    expect(first).toBe(second);
    expect(mocks.initializeApp).toHaveBeenCalledTimes(1);
    expect(mocks.initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: expect.any(String),
        authDomain: expect.any(String),
        projectId: expect.any(String),
        appId: expect.any(String),
      }),
    );
  });

  it("returns a single Firebase Auth instance", async () => {
    const auth = await client.getFirebaseAuth();
    const again = await client.getFirebaseAuth();

    expect(auth).toBe(again);
    expect(mocks.getAuth).toHaveBeenCalledTimes(1);
  });

  it("pins auth persistence to in-memory so no token reaches storage", async () => {
    const auth = await client.getFirebaseAuth();

    expect(mocks.setPersistence).toHaveBeenCalledTimes(1);
    expect(mocks.setPersistence).toHaveBeenCalledWith(auth, mocks.inMemoryPersistence);
  });

  it("reads the Firebase client configuration from NEXT_PUBLIC_* env vars", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "test-api-key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "test.firebaseapp.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "test-project");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "test-app-id");

    vi.resetModules();
    const { firebaseConfig } = await import("./config");

    expect(firebaseConfig).toEqual({
      apiKey: "test-api-key",
      authDomain: "test.firebaseapp.com",
      projectId: "test-project",
      appId: "test-app-id",
    });

    vi.unstubAllEnvs();
  });

  it("never writes authentication credentials to browser storage", () => {
    const files = [
      "firebase/config.ts",
      "firebase/client.ts",
      "auth/client.ts",
      "auth/getSession.ts",
      "api/users.ts",
    ];
    for (const file of files) {
      const source = readFileSync(join(libDir, file), "utf8");
      expect(source, file).not.toMatch(/localStorage|sessionStorage/);
      expect(source, file).not.toMatch(/document\.cookie/);
    }
  });
});
