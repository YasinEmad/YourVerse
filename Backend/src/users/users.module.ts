import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../common/auth/auth.guard";
import { CartModule } from "../cart/cart.module";
import { FirebaseModule } from "../firebase/firebase.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

// Users module (Phase 4A). Owns authentication end to end:
//
//   - FirebaseModule: server-side ID token verification (Firebase Admin SDK);
//   - UsersController: POST /users/session (the exchange), /users/logout,
//     GET /users/me;
//   - APP_GUARD AuthGuard: the global authentication boundary. Every route
//     requires a valid backend session unless marked @Public() — worlds,
//     catalog, cart, orders already opt out, keeping them guest-accessible.
//
// UsersService is exported so the guard can resolve the application User.
@Module({
  imports: [FirebaseModule, CartModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [UsersService],
})
export class UsersModule {}
