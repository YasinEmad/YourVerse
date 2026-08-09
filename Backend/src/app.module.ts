import { Module } from "@nestjs/common";
import { CartModule } from "./cart/cart.module";
import { CatalogModule } from "./catalog/catalog.module";
import { CommonModule } from "./common/common.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { OrdersModule } from "./orders/orders.module";
import { UsersModule } from "./users/users.module";
import { WorldsModule } from "./worlds/worlds.module";

@Module({
  imports: [
    CommonModule,
    FirebaseModule,
    WorldsModule,
    CatalogModule,
    CartModule,
    OrdersModule,
    UsersModule,
  ],
})
export class AppModule {}
