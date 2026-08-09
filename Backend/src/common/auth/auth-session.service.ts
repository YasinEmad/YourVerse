import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import type { Request } from "express";
import { AppConfigService } from "../config/app-config.service";
import {
  AUTH_SESSION_COOKIE_NAME,
  AuthSessionCookieOptions,
  readAuthSessionId,
  signAuthSession,
} from "./session-cookie";

// Central place for the authenticated session cookie: name, signing, settings,
// and lifecycle are configured HERE and nowhere else (Phase 4A rule: "Keep
// cookie configuration centralized"). The httpOnly cookie carries a signed
// userId; the browser never reads it, and no Firebase/access/refresh token is
// ever stored in it or returned to the client.
@Injectable()
export class AuthSessionService {
  constructor(private readonly config: AppConfigService) {}

  // Sets the authenticated session cookie. httpOnly + SameSite=Lax + Secure in
  // production, matching the guest session cookie's hardening level.
  create(res: Response, userId: string): void {
    this.write(res, signAuthSession(userId, this.config.sessionSigningSecret), {
      secret: this.config.sessionSigningSecret,
      httpOnly: true,
      secure: this.config.nodeEnv === "production",
      sameSite: "lax",
      maxAgeMs: this.config.sessionTtlDays * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  // Returns the authenticated user's id from the request cookie, or null.
  resolve(req: Request): string | null {
    return readAuthSessionId(req, this.config.sessionSigningSecret);
  }

  clear(res: Response): void {
    res.clearCookie(AUTH_SESSION_COOKIE_NAME, { path: "/" });
  }

  private write(res: Response, value: string, options: AuthSessionCookieOptions): void {
    res.cookie(AUTH_SESSION_COOKIE_NAME, value, {
      path: options.path ?? "/",
      httpOnly: options.httpOnly ?? true,
      secure: options.secure ?? false,
      sameSite: options.sameSite ?? "lax",
      maxAge: options.maxAgeMs,
    });
  }
}
