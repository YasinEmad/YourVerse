import { GuestSessionService } from "./guest-session.service";
import { AppConfigService } from "../common/config/app-config.service";

const SECRET = "unit-test-secret";
const SESSION_ID = "3f4f1a9b-2c5d-4e6f-8a7b-0c1d2e3f4a5b";

function makeService(): GuestSessionService {
  const config = {
    sessionSigningSecret: SECRET,
    sessionTtlDays: 30,
    nodeEnv: "development",
  } as AppConfigService;
  return new GuestSessionService(config);
}

function requestWith(headers: Record<string, string | undefined>): any {
  return {
    headers: {
      cookie: "other=1",
      ...headers,
    },
  };
}

function signedValueOf(sessionId: string, secret: string): string {
  const { createHmac } = require("crypto") as typeof import("crypto");
  const signature = createHmac("sha256", secret).update(sessionId).digest("base64url");
  return `v1.${sessionId}.${signature}`;
}

function authSessionCookieOf(userId: string, secret: string): string {
  const { createHmac } = require("crypto") as typeof import("crypto");
  const signature = createHmac("sha256", secret).update(userId).digest("base64url");
  return `yourverse-auth=a1.${userId}.${signature}`;
}

describe("GuestSessionService", () => {
  it("resolves a valid signed x-session-id header without needing a resign", async () => {
    const service = makeService();
    const resolution = await service.resolveSessionOrUser(
      requestWith({ "x-session-id": signedValueOf(SESSION_ID, SECRET) }),
    );
    expect(resolution).toEqual({ kind: "guest", sessionId: SESSION_ID, needsResign: false });
  });

  it("resolves the authenticated user BEFORE any guest id (auth-first precedence)", async () => {
    const service = makeService();
    const resolution = await service.resolveSessionOrUser(
      requestWith({
        cookie: `${authSessionCookieOf("user-1a2b3c4d", SECRET)}; yourverse-session=${signedValueOf(SESSION_ID, SECRET)}`,
        "x-session-id": signedValueOf(SESSION_ID, SECRET),
      }),
    );
    expect(resolution).toEqual({ kind: "user", userId: "user-1a2b3c4d" });
  });

  it("reads the guest session id even when the request is authenticated (merge path)", () => {
    const service = makeService();
    const guestId = service.readGuestSessionId(
      requestWith({
        cookie: authSessionCookieOf("user-1a2b3c4d", SECRET),
        "x-session-id": signedValueOf(SESSION_ID, SECRET),
      }),
    );
    expect(guestId).toBe(SESSION_ID);
  });

  it("readGuestSessionId returns null without a well-formed guest id", () => {
    const service = makeService();
    expect(service.readGuestSessionId(requestWith({}))).toBeNull();
    expect(service.readGuestSessionId(requestWith({ "x-session-id": "not-a-uuid" }))).toBeNull();
  });

  it("accepts an unsigned client-minted UUID but flags it for re-signing (cutover)", async () => {
    const service = makeService();
    const resolution = await service.resolveSessionOrUser(
      requestWith({ "x-session-id": SESSION_ID }),
    );
    expect(resolution).toEqual({ kind: "guest", sessionId: SESSION_ID, needsResign: true });
  });

  it("treats a tampered signature as no session, never a hard error", async () => {
    const service = makeService();
    const tampered = signedValueOf(SESSION_ID, SECRET).slice(0, -4) + "AAAA";
    expect(await service.resolveSessionOrUser(requestWith({ "x-session-id": tampered }))).toBeNull();
  });

  it("treats a signature produced with the wrong secret as no session", async () => {
    const service = makeService();
    const foreign = signedValueOf(SESSION_ID, "some-other-secret");
    expect(await service.resolveSessionOrUser(requestWith({ "x-session-id": foreign }))).toBeNull();
  });

  it("treats garbage (not a signed value nor a UUID) as no session", async () => {
    const service = makeService();
    expect(await service.resolveSessionOrUser(requestWith({ "x-session-id": "not-a-uuid" }))).toBeNull();
    expect(await service.resolveSessionOrUser(requestWith({ "x-session-id": "a.b.c.d" }))).toBeNull();
  });

  it("falls back to the yourverse-session cookie when no header is present", async () => {
    const service = makeService();
    const resolution = await service.resolveSessionOrUser(
      requestWith({ cookie: `yourverse-session=${signedValueOf(SESSION_ID, SECRET)}` }),
    );
    expect(resolution?.kind).toBe("guest");
    if (resolution?.kind === "guest") expect(resolution.sessionId).toBe(SESSION_ID);
  });

  it("returns null when neither header nor cookie is present", async () => {
    const service = makeService();
    expect(await service.resolveSessionOrUser(requestWith({}))).toBeNull();
  });

  it("mints a fresh random session id", () => {
    const service = makeService();
    const a = service.mintGuestSessionId();
    const b = service.mintGuestSessionId();
    expect(a).toMatch(/^[0-9a-f-]{36}$/i);
    expect(a).not.toBe(b);
  });

  it("issues a signed, non-httpOnly, 30-day SameSite=Lax cookie", () => {
    const service = makeService();
    const res = {
      cookies: [] as Array<Record<string, unknown>>,
      cookie(name: string, value: string, options: Record<string, unknown>) {
        this.cookies.push({ name, value, ...options });
      },
    };
    service.ensureSessionCookie(res as any, SESSION_ID);
    expect(res.cookies).toHaveLength(1);
    const cookie = res.cookies[0];
    expect(cookie.name).toBe("yourverse-session");
    expect(String(cookie.value)).toContain(`v1.${SESSION_ID}.`);
    expect(cookie.maxAge).toBe(30 * 24 * 60 * 60 * 1000);
    expect(cookie.sameSite).toBe("lax");
    expect(cookie.httpOnly).toBe(false);
    expect(cookie.path).toBe("/");
  });
});
