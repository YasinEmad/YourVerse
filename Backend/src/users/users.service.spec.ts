import { CartService } from "../cart/cart.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { FirebaseService } from "../firebase/firebase.service";
import { UserRow } from "./user.row";
import { UsersService } from "./users.service";

const USER_ROW: UserRow = {
  id: "user-1a2b3c4d",
  firebaseUid: "uid-1a2b3c4d",
  email: "alice@yourverse.test",
  name: null,
  favoriteWorldSlug: null,
  createdAt: new Date("2026-01-15T12:00:00.000Z"),
  updatedAt: new Date("2026-01-15T12:00:00.000Z"),
};

function setup() {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  } as unknown as PrismaService;
  const firebase = { verifyIdToken: jest.fn() } as unknown as FirebaseService;
  const cartService = {
    mergeGuestCart: jest.fn().mockResolvedValue(undefined),
  } as unknown as CartService;
  const service = new UsersService(prisma, firebase, cartService);
  return { service, prisma, firebase, cartService };
}

describe("UsersService", () => {
  it("verifies the Firebase ID token and resolves/creates the User by firebaseUid", async () => {
    const { service, firebase, prisma } = setup();
    (firebase.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1a2b3c4d", email: "alice@yourverse.test" });
    (prisma.user.upsert as jest.Mock).mockResolvedValue(USER_ROW);

    const dto = await service.exchangeIdToken("firebase-id-token");

    expect(firebase.verifyIdToken).toHaveBeenCalledWith("firebase-id-token");
    expect(prisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { firebaseUid: "uid-1a2b3c4d" } }),
    );
    expect(dto).toEqual({ id: "user-1a2b3c4d", email: "alice@yourverse.test", loyaltyPoints: 0 });
  });

  it("falls back to a deterministic placeholder email when the provider omits it", async () => {
    const { service, firebase, prisma } = setup();
    (firebase.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-anon", email: null });
    (prisma.user.upsert as jest.Mock).mockResolvedValue({ ...USER_ROW, firebaseUid: "uid-anon" });

    await service.exchangeIdToken("token");

    expect(prisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ email: "uid-anon@firebase.invalid" }),
      }),
    );
  });

  it("merges the guest cart THROUGH CartService when a guest session id is present", async () => {
    const { service, firebase, prisma, cartService } = setup();
    (firebase.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1a2b3c4d", email: null });
    (prisma.user.upsert as jest.Mock).mockResolvedValue(USER_ROW);

    await service.exchangeIdToken("token", "guest-9f8e7d6c");

    expect(cartService.mergeGuestCart).toHaveBeenCalledTimes(1);
    expect(cartService.mergeGuestCart).toHaveBeenCalledWith("guest-9f8e7d6c", "user-1a2b3c4d");
  });

  it("does NOT touch CartService when there is no guest session id", async () => {
    const { service, firebase, prisma, cartService } = setup();
    (firebase.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1a2b3c4d", email: null });
    (prisma.user.upsert as jest.Mock).mockResolvedValue(USER_ROW);

    await service.exchangeIdToken("token");

    expect(cartService.mergeGuestCart).not.toHaveBeenCalled();
  });

  it("never merges a user's own id back into itself", async () => {
    const { service, firebase, prisma, cartService } = setup();
    (firebase.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1a2b3c4d", email: null });
    (prisma.user.upsert as jest.Mock).mockResolvedValue(USER_ROW);

    await service.exchangeIdToken("token", USER_ROW.id);

    expect(cartService.mergeGuestCart).not.toHaveBeenCalled();
  });

  it("never returns a credential in the UserDto", async () => {
    const { service, firebase, prisma } = setup();
    (firebase.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "uid-1a2b3c4d", email: null });
    (prisma.user.upsert as jest.Mock).mockResolvedValue(USER_ROW);

    const dto = await service.exchangeIdToken("token");

    expect(dto).not.toHaveProperty("idToken");
    expect(dto).not.toHaveProperty("accessToken");
    expect(dto).not.toHaveProperty("refreshToken");
  });

  it("findUserById delegates to Prisma for the auth guard", async () => {
    const { service, prisma } = setup();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(USER_ROW);

    const user = await service.findUserById(USER_ROW.id);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: USER_ROW.id } });
    expect(user?.id).toBe(USER_ROW.id);
  });
});
