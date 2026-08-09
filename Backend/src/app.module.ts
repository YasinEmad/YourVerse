import { Module } from "@nestjs/common";
import { CartModule } from "./cart/cart.module";
import { CatalogModule } from "./catalog/catalog.module";
import { CommonModule } from "./common/common.module";
import { OrdersModule } from "./orders/orders.module";
import { WorldsModule } from "./worlds/worlds.module";

@Module({
  imports: [CommonModule, WorldsModule, CatalogModule, CartModule, OrdersModule],
})
export class AppModule {}
