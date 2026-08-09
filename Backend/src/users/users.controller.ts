import { Body, Controller, Get, HttpCode, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthenticatedRequest } from "../common/auth/auth.guard";
import { AuthSessionService } from "../common/auth/auth-session.service";
import { Public } from "../common/auth/public.decorator";
import { GuestSessionService } from "../cart/guest-session.service";
import { SessionRequestDto } from "./dto/session-request.dto";
import { SessionDto } from "./dto/session.dto";
import { UserDto } from "./dto/user.dto";
import { toUserDto } from "./users.mapper";
import { UsersService } from "./users.service";

// Users module — the only module that deals with authentication. It owns the
// session cookie lifecycle; the global AuthGuard (installed here via APP_GUARD)
// enforces it for every route that isn't @Public().
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly session: AuthSessionService,
    private readonly guestSession: GuestSessionService,
  ) {}

  // POST /users/session — the ONLY authentication endpoint. Exchanges a
  // Firebase ID token (verified server-side) for the application's httpOnly
  // backend session cookie, and merges any guest cart the request carries.
  // @Public(): you cannot require a session to create one.
  @Post("session")
  @Public()
  async createSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: SessionRequestDto,
  ): Promise<SessionDto> {
    const user = await this.usersService.exchangeIdToken(
      body.idToken,
      this.guestSession.readGuestSessionId(req),
    );
    this.session.create(res, user.id);
    return { user };
  }

  // POST /users/logout — clears the application session cookie. Public so it
  // always succeeds (204) even when the cookie is already gone. No token is
  // returned; Firebase session revocation is the frontend's concern.
  @Post("logout")
  @Public()
  @HttpCode(204)
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    this.session.clear(res);
  }

  // GET /users/me — protected by the global guard (401 without a valid
  // session). The guard has already resolved the User; this controller only
  // serializes it.
  @Get("me")
  async me(@Req() req: AuthenticatedRequest): Promise<UserDto> {
    return toUserDto(req.authUser);
  }
}
