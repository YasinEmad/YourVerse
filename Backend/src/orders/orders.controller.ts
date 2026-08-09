import { Body, Controller, Get, NotFoundException, Param, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { Public } from "../common/auth/public.decorator";
import { MissingSessionException } from "../common/errors/missing-session.exception";
import { GuestSessionService } from "../cart/guest-session.service";
import { CreateOrderRequestDto } from "./dto/create-order-request.dto";
import { OrderDto, OrderListResponseDto } from "./dto/order.dto";
import { OrdersService } from "./orders.service";

// Orders routes accept guest (or, Phase 4+, authenticated) sessions — never
// behind the global auth guard (architecture §7), same as cart/. Every handler
// resolves "whose orders are these" through GuestSessionService.resolveSessionOrUser.
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
    const sessionId = await this.requireGuestSession(req);
    this.guestSession.ensureSessionCookie(res, sessionId);
    return this.ordersService.createOrder(sessionId, body.shippingAddress);
  }

  @Get()
  @Public()
  async listOrders(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OrderListResponseDto> {
    const sessionId = await this.requireGuestSession(req);
    this.guestSession.ensureSessionCookie(res, sessionId);
    const orders = await this.ordersService.listOrders(sessionId);
    return { items: orders };
  }

  @Get(":id")
  @Public()
  async getOrder(@Req() req: Request, @Param("id") id: string): Promise<OrderDto> {
    // No resolvable session -> can't establish ownership -> 404, never a 5xx
    // and never an existence leak for someone else's order.
    const resolution = await this.guestSession.resolveSessionOrUser(req);
    if (!resolution || resolution.kind !== "guest") {
      throw new NotFoundException("Order not found");
    }
    return this.ordersService.getOrderForSession(resolution.sessionId, id);
  }

  // Missing/invalid session on POST/GET /orders -> 400 { error: "Missing
  // session" }, exactly the mock's behavior (app/api/mock/orders/route.ts) so
  // the frontend's existing error handling doesn't change.
  private async requireGuestSession(req: Request): Promise<string> {
    const resolution = await this.guestSession.resolveSessionOrUser(req);
    if (resolution?.kind === "guest") {
      return resolution.sessionId;
    }
    throw new MissingSessionException();
  }
}
