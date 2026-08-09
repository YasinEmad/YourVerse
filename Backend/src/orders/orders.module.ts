import { Module } from "@nestjs/common";
import { CartModule } from "../cart/cart.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

// Orders module (Phase 2). POST/GET/GET/:id only.
//
// - Reads/writes the cart exclusively through CartService (imported from
//   CartModule) — never direct Cart/CartItem queries (architecture rule 4).
// - No payments/ submodule and no payment fields anywhere: every order is COD,
//   created status PENDING with no charge step (architecture rule 3). Card/
//   wallet payments, if they ever return, are a new payments/ phase.
// - order-totals.service.ts is a plain (non-DI) pure function module, so it
//   needs no registration here — it is the single source of truth for totals
//   math and is imported directly by OrdersService.
@Module({
  imports: [CartModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
