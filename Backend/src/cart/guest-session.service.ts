import { Injectable } from "@nestjs/common";
import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import { AppConfigService } from "../common/config/app-config.service";

// Name of the cookie that carries the (signed) guest session id. The frontend
// reads this exact name via document.cookie (lib/cart/session-cookie.ts) and
// echoes it as the x-session-id header — so it MUST stay browser-readable
// (no httpOnly) and the name MUST match the frontend's yourverse-session.
export const SESSION_COOKIE_NAME = "yourverse-session";
export const SESSION_HEADER_NAME = "x-session-id";

// Guest session id wire format: v1.<uuid>.<hmac-sha256-base64url>
const SESSION_ID_VERSION = "v1";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface GuestSessionResolution {
  kind: "guest";
  sessionId: string;
  // True when we accepted a client-minted id that the backend has NOT yet
  // signed — the controller must Set-Cookie the signed value back so the next
  // request carries a backend-verified id.
  needsResign: boolean;
}

export interface UserSessionResolution {
  kind: "user";
  userId: string;
}

export type SessionResolution = GuestSessionResolution | UserSessionResolution;

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/**
 * Single place that answers "whose cart is this request for?" (architecture
 * rule 1). Precedence: a valid JWT cookie if present, otherwise the guest
 * session id from the x-session-id header, then the yourverse-session cookie.
 *
 * CUTOVER CONTRACT (backend-architecture.md §6 / §15, deliberately not buried):
 * the frontend today mints an UNSIGNED client-side UUID (crypto.randomUUID in
 * lib/cart/session-cookie.ts) and sends it as x-session-id. To keep every
 * existing guest cart working across cutover, this backend:
 *   - ACCEPTS an unsigned-but-well-formed UUID as a valid session id, but marks
 *     it needsResign so the controller re-issues it as a signed cookie;
 *   - treats anything that looks signed but fails verification, or is neither a
 *     signed value nor a UUID (tampered/garbage), as "no session" — the caller
 *     returns an empty cart, never a 5xx. The frontend's first-contact behavior
 *     is preserved either way.
 */
@Injectable()
export class GuestSessionService {
  constructor(private readonly config: AppConfigService) {}

  async resolveSessionOrUser(req: Request): Promise<SessionResolution | null> {
    // 1. JWT cookie beats the guest id (architecture §7). Phase 4 wires the
    //    real verification; until then there is no auth, so this never resolves.
    const userId = await this.tryResolveUserIdFromJwt(req);
    if (userId) {
      return { kind: "user", userId };
    }

    // 2. Guest session id.
    const raw = this.readSessionId(req);
    if (!raw) {
      return null;
    }
    const signed = this.verifySignedSessionId(raw);
    if (signed) {
      return { kind: "guest", sessionId: signed, needsResign: false };
    }
    if (isUuid(raw)) {
      return { kind: "guest", sessionId: raw, needsResign: true };
    }
    return null;
  }

  // A fresh server-minted session id, used when GET /cart arrives with no
  // session at all (the "create one and return it" path of the DoD).
  mintGuestSessionId(): string {
    return randomUUID();
  }

  // Sets (or re-issues) the signed session cookie. Always called when the route
  // has a resolved session: it upgrades client-minted ids on first contact and
  // keeps the cookie current for every request.
  ensureSessionCookie(res: Response, sessionId: string): void {
    res.cookie(SESSION_COOKIE_NAME, this.signSessionId(sessionId), {
      path: "/",
      maxAge: this.config.sessionTtlDays * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      httpOnly: false, // the frontend must read it via document.cookie to send as x-session-id
      secure: this.config.nodeEnv === "production",
    });
  }

  // --- internals -----------------------------------------------------------

  // Phase 4: verify the access_token cookie and return the user's id. There is
  // no User/JWT implementation yet, so this is a placeholder that preserves the
  // "JWT first, guest id second" precedence in the resolution function.
  private async tryResolveUserIdFromJwt(_req: Request): Promise<string | null> {
    return null;
  }

  // Header wins over the cookie; the frontend sends both (header from the
  // cookie value), and a freshly re-signed cookie may not have reached the
  // browser yet when the header already carries the new value.
  private readSessionId(req: Request): string | null {
    const header = req.headers[SESSION_HEADER_NAME];
    if (typeof header === "string" && header.length > 0) {
      return header;
    }
    return this.readCookie(req, SESSION_COOKIE_NAME);
  }

  // Minimal cookie parser (avoids a cookie-parser dependency until Phase 4's
  // JWT work needs middleware). Only reads, never writes.
  private readCookie(req: Request, name: string): string | null {
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

  private signSessionId(sessionId: string): string {
    const signature = createHmac("sha256", this.config.sessionSigningSecret)
      .update(sessionId)
      .digest("base64url");
    return `${SESSION_ID_VERSION}.${sessionId}.${signature}`;
  }

  private verifySignedSessionId(value: string): string | null {
    const parts = value.split(".");
    if (parts.length !== 3 || parts[0] !== SESSION_ID_VERSION) {
      return null;
    }
    const [, sessionId, signature] = parts;
    if (!isUuid(sessionId)) {
      return null;
    }
    const expected = this.signSessionId(sessionId);
    const actual = `${SESSION_ID_VERSION}.${sessionId}.${signature}`;
    const expectedBuf = Buffer.from(expected);
    const actualBuf = Buffer.from(actual);
    if (expectedBuf.length !== actualBuf.length) {
      return null;
    }
    return timingSafeEqual(expectedBuf, actualBuf) ? sessionId : null;
  }
}
