import { AuthSessionService } from "./auth-session.service";
import { AppConfigService } from "../config/app-config.service";
import { AUTH_SESSION_COOKIE_NAME, signAuthSession } from "./session-cookie";

const SECRET = "unit-test-secret";
const USER_ID = "user-1a2b3c4d";

function makeService(nodeEnv = "development"): AuthSessionService {
  const config = {
    sessionSigningSecret: SECRET,
    sessionTtlDays: 30,
    nodeEnv,
  } as AppConfigService;
  return new AuthSessionService(config);
}

function responseMock() {
  const calls: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
  return {
    calls,
    cookie(name: string, value: string, options: Record<string, unknown>) {
      this.calls.push({ name, value, options });
    },
    clearCookie(name: string, options: Record<string, unknown>) {
      this.calls.push({ name, value: "", options: { ...options, cleared: true } });
    },
  };
}

function requestWith(cookie?: string): any {
  return { headers: cookie ? { cookie } : {} };
}

describe("AuthSessionService", () => {
  it("issues an httpOnly, SameSite=Lax, 30-day signed session cookie", () => {
    const service = makeService();
    const res = responseMock();
    service.create(res as any, USER_ID);

    expect(res.calls).toHaveLength(1);
    const [cookie] = res.calls;
    expect(cookie.name).toBe(AUTH_SESSION_COOKIE_NAME);
    expect(String(cookie.value)).toContain(`a1.${USER_ID}.`);
    expect(cookie.options.httpOnly).toBe(true);
    expect(cookie.options.sameSite).toBe("lax");
    expect(cookie.options.secure).toBe(false);
    expect(cookie.options.maxAge).toBe(30 * 24 * 60 * 60 * 1000);
  });

  it("sets secure: true in production", () => {
    const service = makeService("production");
    const res = responseMock();
    service.create(res as any, USER_ID);
    expect(res.calls[0].options.secure).toBe(true);
  });

  it("resolves the userId from a valid session cookie", () => {
    const service = makeService();
    const valid = signAuthSession(USER_ID, SECRET);
    expect(service.resolve(requestWith(`${AUTH_SESSION_COOKIE_NAME}=${valid}`))).toBe(USER_ID);
  });

  it("returns null with no cookie, a tampered cookie, or a foreign secret", () => {
    const service = makeService();
    const valid = signAuthSession(USER_ID, SECRET);
    const tampered = valid.slice(0, -4) + "AAAA";
    const foreign = signAuthSession(USER_ID, "some-other-secret");

    expect(service.resolve(requestWith())).toBeNull();
    expect(service.resolve(requestWith(`${AUTH_SESSION_COOKIE_NAME}=${tampered}`))).toBeNull();
    expect(service.resolve(requestWith(`${AUTH_SESSION_COOKIE_NAME}=${foreign}`))).toBeNull();
    expect(service.resolve(requestWith(`${AUTH_SESSION_COOKIE_NAME}=garbage`))).toBeNull();
  });

  it("clears the session cookie on logout", () => {
    const service = makeService();
    const res = responseMock();
    service.clear(res as any);
    expect(res.calls[0]).toMatchObject({
      name: AUTH_SESSION_COOKIE_NAME,
      options: { path: "/", cleared: true },
    });
  });
});
