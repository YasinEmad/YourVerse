import { Injectable } from "@nestjs/common";
import { CartService } from "../cart/cart.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { FirebaseService } from "../firebase/firebase.service";
import { UserDto } from "./dto/user.dto";
import { UserRow } from "./user.row";
import { toUserDto } from "./users.mapper";

// Application-user business logic. Firebase owns authentication: this service
// only ever sees a VERIFIED Firebase UID (from FirebaseService) and maps it to
// the Postgres User row — it never touches passwords, tokens, or Firebase
// credentials (backend-architecture.md §7).
//
// Cart merging on authentication goes through CartService, never direct
// Cart/CartItem queries (Phase 4A rule: "Do NOT duplicate cart mutation logic
// inside UsersService").
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
    private readonly cartService: CartService,
  ) {}

  // POST /users/session body handling. Verifies the Firebase ID token,
  // resolves the application User (creating it on first login), merges the
  // caller's guest cart when they arrive with one, and returns the User the
  // controller wraps in SessionDto. The httpOnly session cookie is set by the
  // controller, not here.
  async exchangeIdToken(idToken: string, guestSessionId?: string | null): Promise<UserDto> {
    const verified = await this.firebase.verifyIdToken(idToken);
    const user = await this.findOrCreateByFirebaseUid(verified.uid, verified.email);

    if (guestSessionId && guestSessionId !== user.id) {
      await this.cartService.mergeGuestCart(guestSessionId, user.id);
    }

    return toUserDto(user);
  }

  // Loads the application User by id. Used by the global auth guard after the
  // session cookie's userId is verified.
  async findUserById(userId: string): Promise<UserRow | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private findOrCreateByFirebaseUid(firebaseUid: string, email?: string | null): Promise<UserRow> {
    return this.prisma.user.upsert({
      where: { firebaseUid },
      update: {},
      create: {
        firebaseUid,
        // Anonymous Firebase providers may omit email; the column is unique, so
        // fall back to a deterministic placeholder that can never collide.
        email: email ?? `${firebaseUid}@firebase.invalid`,
      },
    });
  }
}
