import { INestApplication, UnauthorizedException, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { FirebaseService } from "../../src/firebase/firebase.service";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { PrismaService } from "../../src/common/prisma/prisma.service";
import { RedisService } from "../../src/common/redis/redis.service";
import { SESSION_HEADER_NAME } from "../../src/cart/guest-session.service";
import type { AddressDto } from "../../src/orders/dto/create-order-request.dto";

// Users API E2E — Phase 4A (Firebase Authentication Backend).
//
// Firebase Admin is replaced with a fake verifier (real Firebase verification
// needs live credentials + network); everything else — the session cookie,
// the global guard, User persistence, and guest-cart merge — runs through the
// real code paths.
//
// DoD coverage:
//   - GET /users/me: 401 without a session, UserDto with a valid one;
//   - invalid session -> 401;
//   - no credential (idToken/accessToken/refreshToken) ever appears in a body;
//   - the backend session is an httpOnly cookie;
//   - logout clears the cookie;
//   - guest cart transfers to a user with no existing cart;
//   - guest cart merges (quantities add) into an existing user cart;
//   - authenticated users can still place/list/fetch orders (user-kind resolution).

const FIREBASE_USERS: Record<string, { uid: string; email: string }> = {
  alice: { uid: "firebase-uid-alice", email: "alice@yourverse.test" },
  bob: { uid: "firebase-uid-bob", email: "bob@yourverse.test" },
  carol: { uid: "firebase-uid-carol", email: "carol@yourverse.test" },
  dana: { uid: "firebase-uid-dana", email: "dana@yourverse.test" },
};

// Each test scenario uses its OWN Firebase user so carts don't accumulate.
const TOKEN_ALICE = "firebase-test-token-alice";
const TOKEN_BOB = "firebase-test-token-bob";
const TOKEN_CAROL = "firebase-test-token-carol";
const TOKEN_DANA = "firebase-test-token-dana";

const ADDRESS: AddressDto = {
  fullName: "Test User",
  email: "test@example.com",
  phone: "+1 555 0100",
  line1: "1 Test Street",
  city: "Cairo",
  country: "EG",
};

const fakeFirebase: Pick<FirebaseService, "verifyIdToken"> = {
  verifyIdToken: async (idToken: string) => {
    const user = FIREBASE_USERS[idToken.replace("firebase-test-token-", "")];
    if (user) return { uid: user.uid, email: user.email };
    throw new UnauthorizedException("Invalid or expired Firebase ID token");
  },
};

describe("Users API (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseService)
      .useValue(fakeFirebase)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalFilters(app.get(AllExceptionsFilter));
    await app.init();

    prisma = app.get(PrismaService);
    redis = app.get(RedisService);
  });

  afterAll(async () => {
    // Leave the dev DB clean: drop only the rows this suite created. The dev
    // DB is shared with other suites running in parallel, so never use a
    // global deleteMany({}) here.
    const firebaseUids = Object.values(FIREBASE_USERS).map((u) => u.uid);
    const userIds = (
      await prisma.user.findMany({
        where: { firebaseUid: { in: firebaseUids } },
        select: { id: true },
      })
    ).map((u) => u.id);
    const sessionIds = [...createdGuestSessions];

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          OR: [{ userId: { in: userIds } }, { sessionId: { in: sessionIds } }],
        },
      },
    });
    await prisma.cart.deleteMany({
      where: { OR: [{ userId: { in: userIds } }, { sessionId: { in: sessionIds } }] },
    });
    await prisma.orderItem.deleteMany({
      where: { order: { userId: { in: userIds } } },
    });
    await prisma.order.deleteMany({
      where: { userId: { in: userIds } },
    });
    await prisma.user.deleteMany({
      where: { firebaseUid: { in: firebaseUids } },
    });
    await redis.delByPattern("cart:*");
    await app.close();
  });

  const server = () => app.getHttpServer();
  const createdGuestSessions: string[] = [];
  const freshGuestSessionId = () => {
    const id = crypto.randomUUID();
    createdGuestSessions.push(id);
    return id;
  };

  // A supertest agent persists cookies like a browser, so the httpOnly session
  // cookie issued by /users/session is sent on subsequent requests.
  const agent = () => request.agent(server());

  const authCookieFrom = (res: request.Response): string | null => {
    const setCookie = res.headers["set-cookie"] as unknown as string[] | undefined;
    const cookie = setCookie?.find((c) => c.startsWith("yourverse-auth="));
    return cookie ? cookie.split(";")[0] : null;
  };

  async function loginAs(token: string) {
    const client = agent();
    const res = await client.post("/users/session").send({ idToken: token }).expect(201);
    return { client, body: res.body as { user: { id: string; email: string } }, res };
  }

  describe("POST /users/session", () => {
    it("exchanges a verified Firebase ID token for a session + httpOnly cookie", async () => {
      const { client, body, res } = await loginAs(TOKEN_ALICE);

      expect(body.user).toEqual({
        id: expect.any(String) as string,
        email: "alice@yourverse.test",
        loyaltyPoints: 0,
      });
      expect(body).not.toHaveProperty("idToken");
      expect(body).not.toHaveProperty("accessToken");
      expect(body).not.toHaveProperty("refreshToken");

      const setCookie = res.headers["set-cookie"] as unknown as string[];
      const authCookie = setCookie.find((c) => c.startsWith("yourverse-auth="));
      expect(authCookie).toBeDefined();
      expect(authCookie!.toLowerCase()).toContain("httponly");
      expect(authCookie!.toLowerCase()).toContain("samesite=lax");

      // The same cookie authenticates GET /users/me.
      const me = await client.get("/users/me").expect(200);
      expect(me.body.id).toBe(body.user.id);
      expect(me.body.email).toBe("alice@yourverse.test");
      expect(me.body.loyaltyPoints).toBe(0);
    });

    it("never serializes a credential anywhere in the response JSON", async () => {
      const { res } = await loginAs(TOKEN_ALICE);
      const serialized = JSON.stringify(res.body).toLowerCase();
      expect(serialized).not.toContain("idtoken");
      expect(serialized).not.toContain("accesstoken");
      expect(serialized).not.toContain("refreshtoken");
    });

    it("creates the User once and returns the same id on later logins", async () => {
      const first = await loginAs(TOKEN_ALICE);
      const second = await loginAs(TOKEN_ALICE);
      expect(second.body.user.id).toBe(first.body.user.id);
    });

    it("401s for an invalid / expired ID token", async () => {
      const response = await request(server())
        .post("/users/session")
        .send({ idToken: "definitely-not-valid" })
        .expect(401);
      expect(response.body).toMatchObject({ statusCode: 401 });
    });

    it("400s when idToken is missing", async () => {
      const response = await request(server()).post("/users/session").send({}).expect(400);
      expect(response.body.statusCode).toBe(400);
    });
  });

  describe("GET /users/me", () => {
    it("401s without any session", async () => {
      const response = await request(server()).get("/users/me").expect(401);
      expect(response.body.statusCode).toBe(401);
    });

    it("401s with only a guest session (x-session-id)", async () => {
      await request(server())
        .get("/users/me")
        .set(SESSION_HEADER_NAME, freshGuestSessionId())
        .expect(401);
    });

    it("401s with an invalid / tampered session cookie", async () => {
      const valid = authCookieFrom((await loginAs(TOKEN_BOB)).res)!;
      const tampered = valid.slice(0, -4) + "AAAA";
      await request(server()).get("/users/me").set("Cookie", tampered).expect(401);
      await request(server()).get("/users/me").set("Cookie", "yourverse-auth=garbage").expect(401);
    });
  });

  describe("POST /users/logout", () => {
    it("clears the session cookie so /users/me goes back to 401", async () => {
      const { client } = await loginAs(TOKEN_ALICE);
      await client.get("/users/me").expect(200);

      const logout = await client.post("/users/logout").expect(204);
      const setCookie = logout.headers["set-cookie"] as unknown as string[];
      expect(setCookie.some((c) => c.startsWith("yourverse-auth="))).toBe(true);

      await client.get("/users/me").expect(401);
    });

    it("succeeds (204) even with no session at all", async () => {
      await request(server()).post("/users/logout").expect(204);
    });
  });

  describe("Guest cart transfer + merge on authentication", () => {
    it("transfers a guest cart to a user with no existing cart", async () => {
      const guestSession = freshGuestSessionId();
      await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, guestSession)
        .send({ productSlug: "marrow-cli", quantity: 2 })
        .expect(201);

      // Authenticate WHILE carrying the guest session id: first login merges.
      const client = agent();
      await client
        .post("/users/session")
        .set(SESSION_HEADER_NAME, guestSession)
        .send({ idToken: TOKEN_CAROL })
        .expect(201);

      const merged = await client.get("/cart").expect(200);
      expect(merged.body.items).toHaveLength(1);
      expect(merged.body.items[0]).toMatchObject({
        productSlug: "marrow-cli",
        quantity: 2,
      });

      // The guest cart no longer exists for the guest.
      const guestCart = await request(server())
        .get("/cart")
        .set(SESSION_HEADER_NAME, guestSession)
        .expect(200);
      expect(guestCart.body.items).toEqual([]);
    });

    it("merges a guest cart into an existing user cart, adding quantities", async () => {
      // Seed the user's existing cart: the-one-hoodie x3, worlds-poster x2.
      const { client } = await loginAs(TOKEN_BOB);
      await client.post("/cart/items").send({ productSlug: "the-one-hoodie", quantity: 3 }).expect(201);
      await client.post("/cart/items").send({ productSlug: "worlds-poster", quantity: 2 }).expect(201);

      // A guest cart on the same browser: the-one-hoodie x2, universe-cap x1.
      const guestSession = freshGuestSessionId();
      await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, guestSession)
        .send({ productSlug: "the-one-hoodie", quantity: 2 })
        .expect(201);
      await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, guestSession)
        .send({ productSlug: "universe-cap", quantity: 1 })
        .expect(201);

      // Re-authenticate carrying the guest session id — quantities add.
      await client
        .post("/users/session")
        .set(SESSION_HEADER_NAME, guestSession)
        .send({ idToken: TOKEN_BOB })
        .expect(201);

      const merged = await client.get("/cart").expect(200);
      expect(merged.body.itemCount).toBe(8);
      const bySlug = new Map(
        (merged.body.items as Array<{ productSlug: string; quantity: number }>).map((i) => [
          i.productSlug,
          i.quantity,
        ]),
      );
      expect(bySlug.get("the-one-hoodie")).toBe(5);
      expect(bySlug.get("worlds-poster")).toBe(2);
      expect(bySlug.get("universe-cap")).toBe(1);

      // The guest cart is gone.
      const guestCart = await request(server())
        .get("/cart")
        .set(SESSION_HEADER_NAME, guestSession)
        .expect(200);
      expect(guestCart.body.items).toEqual([]);
    });
  });

  describe("Authenticated orders (user-kind resolution)", () => {
    it("places, lists, and fetches an order as an authenticated user", async () => {
      const { client } = await loginAs(TOKEN_DANA);
      await client.post("/cart/items").send({ productSlug: "the-one-hoodie", quantity: 2 }).expect(201);

      const created = await client
        .post("/orders")
        .send({ shippingAddress: ADDRESS })
        .expect(201);
      expect(created.body.status).toBe("PENDING");
      expect(created.body.subtotal).toBe(178);
      expect(created.body.total).toBe(200.8);
      expect(JSON.stringify(created.body)).not.toContain("token");

      const listed = await client.get("/orders").expect(200);
      expect(listed.body.items).toHaveLength(1);
      expect(listed.body.items[0].id).toBe(created.body.id);

      const fetched = await client.get(`/orders/${created.body.id}`).expect(200);
      expect(fetched.body.id).toBe(created.body.id);

      // The order is owned by the user, not by any guest session.
      const other = await request(server())
        .get(`/orders/${created.body.id}`)
        .set(SESSION_HEADER_NAME, freshGuestSessionId())
        .expect(404);
      expect(other.body.statusCode).toBe(404);
    });
  });
});
