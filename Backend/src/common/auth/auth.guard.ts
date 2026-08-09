import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { UsersService } from "../../users/users.service";
import { UserRow } from "../../users/user.row";
import { AuthSessionService } from "./auth-session.service";
import { IS_PUBLIC_KEY } from "./public.decorator";

// The request after the guard has attached the authenticated application User.
// Routes protected by the global guard (anything not marked @Public()) read
// identity from here; controllers never re-read cookies themselves.
export interface AuthenticatedRequest extends Request {
  authUser: UserRow;
}

// Global authentication guard (Phase 4A). Installed once via APP_GUARD in
// UsersModule, which is the module that owns authentication:
//
//   authenticated-by-default — every route requires a valid backend session
//   unless it opts out with @Public(). This is the opposite of "default open",
//   so a new route can never be forgotten-and-exposed.
//
//   1. reads the httpOnly backend session cookie (AuthSessionService);
//   2. validates the signature and resolves the userId;
//   3. loads the application User from Postgres;
//   4. attaches the User to request.authUser;
//   5. 401 when a required session is missing/invalid.
//
// Manual auth checks do NOT belong in controllers — cart/orders resolve guest
// OR user identity through GuestSessionService instead (see guest-session.service).
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly session: AuthSessionService,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userId = this.session.resolve(request);
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.users.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    (request as AuthenticatedRequest).authUser = user;
    return true;
  }
}
