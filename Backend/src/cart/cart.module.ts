import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { GuestSessionService } from "./guest-session.service";

// Cart module (Phase 1). get/add/update/remove only — no knowledge of checkout,
// orders, or payments (architecture rule 4; Phase 3's order creation reads the
// cart through CartService, never by querying CartItem directly).
@Module({
  controllers: [CartController],
  providers: [CartService, GuestSessionService],
  // CartService: OrdersModule reads/writes the cart through it (never direct
  // CartItem queries). GuestSessionService: the shared "whose request is this"
  // resolver — orders/ resolves the same way cart/ does.
  exports: [CartService, GuestSessionService],
})
export class CartModule {}
