import { createHmac, timingSafeEqual } from "crypto";
import type { Request } from "express";

// Authenticated backend session cookie. Unlike the guest `yourverse-session`
// cookie (which must stay browser-readable so the frontend can echo it as the
// x-session-id header), THIS cookie is httpOnly — the browser stores it
// silently and never needs to read or send the credential itself.
//
// Wire format: a1.<userId>.<hmac-sha256-base64url>. Signed with the same
// centralized SESSION_SIGNING_SECRET that signs guest session ids (AppConfigService),
// so there is exactly one cookie-signing secret in the application.
export const AUTH_SESSION_COOKIE_NAME = "yourverse-auth";
const AUTH_SESSION_VERSION = "a1";

export interface AuthSessionCookieOptions {
  secret: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAgeMs?: number;
  path?: string;
}

// Reads and verifies the auth session cookie from a request, returning the
// authenticated user's id, or null when absent/invalid. Pure so that both the
// AuthSessionService (DI) and GuestSessionService (identity resolver) use the
// exact same verification — there is exactly one code path that says "who is
// authenticated on this request".
export function readAuthSessionId(req: Request, secret: string): string | null {
  const raw = readCookie(req, AUTH_SESSION_COOKIE_NAME);
  if (!raw) {
    return null;
  }
  return verifyAuthSession(raw, secret);
}

export function signAuthSession(userId: string, secret: string): string {
  const signature = createHmac("sha256", secret).update(userId).digest("base64url");
  return `${AUTH_SESSION_VERSION}.${userId}.${signature}`;
}

export function verifyAuthSession(value: string, secret: string): string | null {
  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== AUTH_SESSION_VERSION) {
    return null;
  }
  const [, userId, signature] = parts;
  if (!userId) {
    return null;
  }
  const expected = signAuthSession(userId, secret);
  const actual = `${AUTH_SESSION_VERSION}.${userId}.${signature}`;
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(actual);
  if (expectedBuf.length !== actualBuf.length) {
    return null;
  }
  return timingSafeEqual(expectedBuf, actualBuf) ? userId : null;
}

// Minimal cookie reader (no cookie-parser dependency), mirroring the one in
// GuestSessionService. Only reads, never writes.
function readCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) {
      try {
        return decodeURIComponent(part.slice(eq + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}
