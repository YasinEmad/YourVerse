import { Body, Controller, Get, NotFoundException, Param, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { Public } from "../common/auth/public.decorator";
import { MissingSessionException } from "../common/errors/missing-session.exception";
import { GuestSessionService } from "../cart/guest-session.service";
import { CreateOrderRequestDto } from "./dto/create-order-request.dto";
import { OrderDto, OrderListResponseDto } from "./dto/order.dto";
import { OrdersService } from "./orders.service";

// Orders routes accept guest (or authenticated) sessions — never behind the
// global auth guard (architecture §7), same as cart/. Every handler resolves
// "whose orders are these" through GuestSessionService.resolveSessionOrUser.
//
// Request shape is deliberately minimal (architecture rule 3): shippingAddress
// only. No cartId (the server derives the cart from the session), no
// paymentMethodId (COD is implicit), no client total (server recomputes it).
// Anything the current frontend still sends beyond this — cartId,
// paymentMethodId, or a hypothetical client total — is stripped by the global
// whitelist ValidationPipe and ignored.
@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly guestSession: GuestSessionService,
  ) {}

  @Post()
  @Public()
  async createOrder(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: CreateOrderRequestDto,
  ): Promise<OrderDto> {
    const { key, kind } = await this.requireOrderKey(req);
    this.ensureGuestCookie(res, kind, key);
    return this.ordersService.createOrder(key, body.shippingAddress, {
      userId: kind === "user" ? key : undefined,
    });
  }

  @Get()
  @Public()
  async listOrders(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OrderListResponseDto> {
    const { key, kind } = await this.requireOrderKey(req);
    this.ensureGuestCookie(res, kind, key);
    const orders = await this.ordersService.listOrders(key);
    return { items: orders };
  }

  @Get(":id")
  @Public()
  async getOrder(@Req() req: Request, @Param("id") id: string): Promise<OrderDto> {
    // No resolvable session -> can't establish ownership -> 404, never a 5xx
    // and never an existence leak for someone else's order.
    const resolution = await this.guestSession.resolveSessionOrUser(req);
    if (!resolution) {
      throw new NotFoundException("Order not found");
    }
    const key = resolution.kind === "user" ? resolution.userId : resolution.sessionId;
    return this.ordersService.getOrderForSession(key, id);
  }

  // Missing/invalid session on POST/GET /orders -> 400 { error: "Missing
  // session" }, exactly the mock's behavior (app/api/mock/orders/route.ts) so
  // the frontend's existing error handling doesn't change. User-kind
  // resolutions route by userId (the order's sessionId once authenticated).
  private async requireOrderKey(req: Request): Promise<{ key: string; kind: "guest" | "user" }> {
    const resolution = await this.guestSession.resolveSessionOrUser(req);
    if (!resolution) {
      throw new MissingSessionException();
    }
    return resolution.kind === "user"
      ? { key: resolution.userId, kind: "user" }
      : { key: resolution.sessionId, kind: "guest" };
  }

  private ensureGuestCookie(res: Response, kind: "guest" | "user", key: string): void {
    if (kind === "guest") {
      this.guestSession.ensureSessionCookie(res, key);
    }
  }
}
