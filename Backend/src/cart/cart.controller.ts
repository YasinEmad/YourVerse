import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { Public } from "../common/auth/public.decorator";
import { MissingSessionException } from "../common/errors/missing-session.exception";
import { CartService } from "./cart.service";
import { AddCartItemRequestDto } from "./dto/add-cart-item-request.dto";
import { CartDto } from "./dto/cart.dto";
import { UpdateCartItemRequestDto } from "./dto/update-cart-item-request.dto";
import { GuestSessionService } from "./guest-session.service";

// Cart routes accept guest (or, Phase 4+, authenticated) sessions — never
// behind the global auth guard (architecture §7). Every handler resolves
// "whose cart is this" through GuestSessionService.resolveSessionOrUser — no
// cookie/header reading happens in this controller.
@Controller("cart")
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly guestSession: GuestSessionService,
  ) {}

  @Get()
  @Public()
  async getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<CartDto> {
    const resolution = await this.guestSession.resolveSessionOrUser(req);
    const sessionId =
      resolution?.kind === "guest" ? resolution.sessionId : this.guestSession.mintGuestSessionId();
    // Re-issue the signed cookie: upgrades a client-minted id on first contact,
    // and mints one for a first-contact request with no session at all.
    this.guestSession.ensureSessionCookie(res, sessionId);
    return this.cartService.getCart(sessionId);
  }

  @Post("items")
  @Public()
  async addItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: AddCartItemRequestDto,
  ): Promise<CartDto> {
    const sessionId = await this.requireGuestSession(req);
    this.guestSession.ensureSessionCookie(res, sessionId);
    return this.cartService.addItem(sessionId, body.productSlug, body.quantity ?? 1);
  }

  @Patch("items/:lineId")
  @Public()
  async updateItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param("lineId") lineId: string,
    @Body() body: UpdateCartItemRequestDto,
  ): Promise<CartDto> {
    const sessionId = await this.requireGuestSession(req);
    this.guestSession.ensureSessionCookie(res, sessionId);
    return this.cartService.updateItem(sessionId, lineId, body.quantity ?? 0);
  }

  @Delete("items/:lineId")
  @Public()
  async removeItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param("lineId") lineId: string,
  ): Promise<CartDto> {
    const sessionId = await this.requireGuestSession(req);
    this.guestSession.ensureSessionCookie(res, sessionId);
    return this.cartService.removeItem(sessionId, lineId);
  }

  // Missing/invalid session on a mutation -> 400 "Missing session", exactly the
  // mock's behavior (app/api/mock/cart/items/route.ts) so the frontend's error
  // handling doesn't change. Phase 4 user-kind resolutions route by userId here.
  private async requireGuestSession(req: Request): Promise<string> {
    const resolution = await this.guestSession.resolveSessionOrUser(req);
    if (resolution?.kind === "guest") {
      return resolution.sessionId;
    }
    throw new MissingSessionException();
  }
}
