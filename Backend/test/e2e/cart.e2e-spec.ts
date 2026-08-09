import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { PrismaService } from "../../src/common/prisma/prisma.service";
import { RedisService } from "../../src/common/redis/redis.service";
import { SESSION_COOKIE_NAME, SESSION_HEADER_NAME } from "../../src/cart/guest-session.service";

// Cart API E2E — the anonymous guest flow. Requires the seeded dev DB + Redis.
//
// DoD coverage (backend-architecture.md §15):
//   - full anonymous flow: GET creates a session + empty cart, POST adds/merges,
//     PATCH/DELETE mutate the same cart;
//   - an unsigned or tampered x-session-id results in an empty cart, never a 5xx;
//   - mutations without a session -> 400 { error: "Missing session" } (the exact
//     mock body the frontend already handles);
//   - cache invalidation: a write is reflected on the very next GET /cart.

describe("Cart API (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalFilters(app.get(AllExceptionsFilter));
    await app.init();

    prisma = app.get(PrismaService);
    redis = app.get(RedisService);
  });

  afterAll(async () => {
    // Leave the dev DB clean: drop everything this suite created.
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await redis.delByPattern("cart:*");
    await app.close();
  });

  const server = () => app.getHttpServer();
  const freshSessionId = () => crypto.randomUUID();
  const signedCookieValue = (sessionId: string) => `v1.${sessionId}.`; // signature varies

  describe("GET /cart", () => {
    it("creates an empty cart + signed session cookie when no session exists", async () => {
      const response = await request(server()).get("/cart").expect(200);
      const cart = response.body;
      expect(Object.keys(cart).sort()).toEqual([
        "currency",
        "id",
        "itemCount",
        "items",
        "sessionId",
        "subtotal",
      ]);
      expect(cart.items).toEqual([]);
      expect(cart.subtotal).toBe(0);
      expect(cart.itemCount).toBe(0);
      expect(cart.currency).toBe("USD");
      expect(cart.sessionId).toMatch(/^[0-9a-f-]{36}$/i);

      const setCookie = response.headers["set-cookie"] as unknown as string[];
      expect(setCookie.some((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`))).toBe(true);
      expect(setCookie.join()).toContain(`Max-Age=2592000`);
    });

    it("returns an empty cart (not a 5xx) for an unsigned or tampered session id", async () => {
      // Unsigned client-minted UUID: accepted as a valid session, empty cart.
      const unsignedId = freshSessionId();
      const unsigned = await request(server())
        .get("/cart")
        .set(SESSION_HEADER_NAME, unsignedId)
        .expect(200);
      expect(unsigned.body.sessionId).toBe(unsignedId);
      expect(unsigned.body.items).toEqual([]);

      // Tampered signed-looking value: no session -> mint a fresh one, empty cart.
      const tampered = await request(server())
        .get("/cart")
        .set(SESSION_HEADER_NAME, "v1.00000000-0000-4000-8000-000000000000.AAAA")
        .expect(200);
      expect(tampered.body.items).toEqual([]);
      expect(tampered.body.sessionId).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it("re-signs a client-minted UUID cookie on first contact", async () => {
      const unsignedId = freshSessionId();
      const first = await request(server())
        .get("/cart")
        .set(SESSION_HEADER_NAME, unsignedId)
        .expect(200);
      const setCookie = first.headers["set-cookie"] as unknown as string[];
      expect(setCookie.join()).toContain(signedCookieValue(unsignedId));
    });
  });

  describe("POST /cart/items", () => {
    it("adds a line to the session's cart and returns the mock shape", async () => {
      const sessionId = freshSessionId();
      const response = await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ productSlug: "the-one-hoodie", quantity: 2 })
        .expect(201);

      const cart = response.body;
      expect(cart.sessionId).toBe(sessionId);
      expect(cart.itemCount).toBe(2);
      expect(cart.subtotal).toBe(178); // 89 * 2
      expect(cart.currency).toBe("USD");
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toMatchObject({
        productSlug: "the-one-hoodie",
        title: "The One Hoodie",
        unitPrice: 89,
        currency: "USD",
        quantity: 2,
      });
      expect(cart.items[0].id).toBeTruthy();
    });

    it("merges into the existing line instead of duplicating", async () => {
      const sessionId = freshSessionId();
      await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ productSlug: "the-one-hoodie", quantity: 1 })
        .expect(201);
      const second = await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ productSlug: "the-one-hoodie", quantity: 3 })
        .expect(201);
      expect(second.body.items).toHaveLength(1);
      expect(second.body.items[0].quantity).toBe(4);
      expect(second.body.itemCount).toBe(4);
    });

    it("404s with the mock message for an unknown product slug", async () => {
      const response = await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, freshSessionId())
        .send({ productSlug: "does-not-exist", quantity: 1 })
        .expect(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        message: "Product not found or unavailable",
        error: "Not Found",
      });
    });

    it("returns 400 { error: 'Missing session' } when no session is present", async () => {
      const response = await request(server())
        .post("/cart/items")
        .send({ productSlug: "the-one-hoodie", quantity: 1 })
        .expect(400);
      expect(response.body).toEqual({ error: "Missing session" });
    });

    it("returns 400 (never 5xx) for a tampered session id", async () => {
      const response = await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, "garbage-not-a-session")
        .send({ productSlug: "the-one-hoodie", quantity: 1 })
        .expect(400);
      expect(response.body).toEqual({ error: "Missing session" });
    });
  });

  describe("PATCH /cart/items/:lineId", () => {
    async function cartWithOneLine(sessionId: string, productSlug = "the-one-hoodie") {
      const added = await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ productSlug, quantity: 1 })
        .expect(201);
      return added.body.items[0].id;
    }

    it("updates quantity", async () => {
      const sessionId = freshSessionId();
      const lineId = await cartWithOneLine(sessionId);
      const updated = await request(server())
        .patch(`/cart/items/${lineId}`)
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ quantity: 5 })
        .expect(200);
      expect(updated.body.items[0].quantity).toBe(5);
      expect(updated.body.itemCount).toBe(5);
    });

    it("removes the line when quantity is 0 (mock parity)", async () => {
      const sessionId = freshSessionId();
      const lineId = await cartWithOneLine(sessionId);
      const removed = await request(server())
        .patch(`/cart/items/${lineId}`)
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ quantity: 0 })
        .expect(200);
      expect(removed.body.items).toEqual([]);
      expect(removed.body.itemCount).toBe(0);
    });

    it("404s with the mock message for an unknown lineId", async () => {
      const sessionId = freshSessionId();
      await cartWithOneLine(sessionId);
      const response = await request(server())
        .patch("/cart/items/does-not-exist")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ quantity: 1 })
        .expect(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        message: "Cart item not found",
        error: "Not Found",
      });
    });
  });

  describe("DELETE /cart/items/:lineId", () => {
    it("removes the line (mock parity: silent for a missing line)", async () => {
      const sessionId = freshSessionId();
      const added = await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ productSlug: "universe-cap", quantity: 2 })
        .expect(201);
      const lineId = added.body.items[0].id;

      const removed = await request(server())
        .delete(`/cart/items/${lineId}`)
        .set(SESSION_HEADER_NAME, sessionId)
        .expect(200);
      expect(removed.body.items).toEqual([]);
      expect(removed.body.itemCount).toBe(0);

      // Re-delete: still 200, still empty (no 404 for an already-gone line).
      const again = await request(server())
        .delete(`/cart/items/${lineId}`)
        .set(SESSION_HEADER_NAME, sessionId)
        .expect(200);
      expect(again.body.items).toEqual([]);
    });

    it("returns 400 { error: 'Missing session' } without a session", async () => {
      const response = await request(server()).delete("/cart/items/whatever").expect(400);
      expect(response.body).toEqual({ error: "Missing session" });
    });
  });

  describe("Cache invalidation (DoD: a write is reflected on the next read)", () => {
    it("primes the cache on GET, invalidates on POST, then reads fresh from Postgres", async () => {
      const sessionId = freshSessionId();
      const cacheKey = `cart:${sessionId}`;

      // 1. GET primes cart:{sessionId}.
      const empty = await request(server()).get("/cart").set(SESSION_HEADER_NAME, sessionId).expect(200);
      expect(empty.body.items).toEqual([]);
      expect(await redis.exists(cacheKey)).toBe(true);

      // 2. POST writes to Postgres and invalidates the cache key.
      await request(server())
        .post("/cart/items")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ productSlug: "marrow-cli", quantity: 1 })
        .expect(201);
      expect(await redis.exists(cacheKey)).toBe(false);

      // 3. The very next GET reads the fresh Postgres state, never stale cache.
      const after = await request(server()).get("/cart").set(SESSION_HEADER_NAME, sessionId).expect(200);
      expect(after.body.items).toHaveLength(1);
      expect(after.body.items[0].productSlug).toBe("marrow-cli");
      expect(after.body.items[0].title).toBe("Marrow CLI");
      expect(await redis.exists(cacheKey)).toBe(true);
    });
  });
});
