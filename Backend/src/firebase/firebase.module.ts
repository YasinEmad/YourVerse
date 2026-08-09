import { Module } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";

// Firebase module (Phase 4A). Owns the single Firebase Admin SDK instance and
// exposes verifyIdToken to whoever needs it — today that is UsersService (the
// /users/session exchange). No controller or service reads process.env or
// initializes Firebase itself.
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
