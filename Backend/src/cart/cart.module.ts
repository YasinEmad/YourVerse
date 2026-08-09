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
  exports: [CartService],
})
export class CartModule {}
