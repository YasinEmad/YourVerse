import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { CartService } from "../../src/cart/cart.service";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { PrismaService } from "../../src/common/prisma/prisma.service";
import { RedisService } from "../../src/common/redis/redis.service";
import { SESSION_HEADER_NAME } from "../../src/cart/guest-session.service";
import { OrdersService } from "../../src/orders/orders.service";
import type { AddressDto } from "../../src/orders/dto/create-order-request.dto";

// Orders API E2E. Requires the seeded dev DB + Redis.
//
// DoD coverage:
//   - POST /orders recomputes totals server-side and IGNORES a (hypothetical)
//     stale client total in the body;
//   - every created order has status PENDING and no payment fields anywhere in
//     the response;
//   - order creation + cart clearing are atomic — a forced failure mid-way
//     leaves neither an order nor a cleared cart;
//   - OrderItem.unitPrice is snapshotted at purchase time and does not change
//     if the product's price is updated afterwards;
//   - GET /orders/:id 404s for an order owned by a different session (and with
//     no session at all), while the owner gets 200.

const ADDRESS: AddressDto = {
  fullName: "Test User",
  email: "test@example.com",
  phone: "+1 555 0100",
  line1: "1 Test Street",
  line2: "Apt 2",
  city: "Cairo",
  region: "Giza",
  postalCode: "11511",
  country: "EG",
};

describe("Orders API (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: RedisService;
  let ordersService: OrdersService;
  let cartService: CartService;

  // Session ids created by this suite, so afterAll can leave the DB clean.
  const sessions: string[] = [];

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
    ordersService = app.get(OrdersService);
    cartService = app.get(CartService);
  });

  afterAll(async () => {
    // Restore the seeded universe-cap price (the snapshot test mutates it).
    await prisma.product.update({
      where: { slug: "universe-cap" },
      data: { basePrice: 2900 },
    });

    // Drop every order/order-item and cart/cart-item this suite created.
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await redis.delByPattern("cart:*");
    jest.restoreAllMocks();
    await app.close();
  });

  const server = () => app.getHttpServer();
  const freshSessionId = () => {
    const id = crypto.randomUUID();
    sessions.push(id);
    return id;
  };

  async function seedCart(sessionId: string, productSlug = "the-one-hoodie", quantity = 2) {
    const response = await request(server())
      .post("/cart/items")
      .set(SESSION_HEADER_NAME, sessionId)
      .send({ productSlug, quantity })
      .expect(201);
    return response.body;
  }

  describe("POST /orders", () => {
    it("creates an order with server-computed totals, ignoring a stale client total", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "the-one-hoodie", 2);

      // A hypothetical client total is sent alongside — the backend must ignore
      // it (it is stripped by the whitelist ValidationPipe and recomputed from
      // the cart's server-side state). the-one-hoodie: $89 x 2 -> subtotal 178,
      // flat $5 shipping, 10% tax = 17.8, total 200.8.
      const response = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({
          shippingAddress: ADDRESS,
          cartId: "hacked-cart-id",
          paymentMethodId: "card",
          subtotal: 1,
          total: 1,
        })
        .expect(201);

      const order = response.body;
      expect(order.status).toBe("PENDING");
      expect(order.subtotal).toBe(178);
      expect(order.shipping).toBe(5);
      expect(order.tax).toBe(17.8);
      expect(order.total).toBe(200.8);
      expect(order.currency).toBe("USD");
      expect(order.orderNumber).toMatch(/^MV-[0-9A-Z]{8}$/);

      expect(order.items).toHaveLength(1);
      expect(order.items[0]).toMatchObject({
        productSlug: "the-one-hoodie",
        title: "The One Hoodie",
        unitPrice: 89,
        quantity: 2,
        lineTotal: 178,
      });
      expect(order.shippingAddress).toEqual(ADDRESS);
      expect(order.createdAt).toBeTruthy();
    });

    it("carries NO payment-related fields in the response DTO", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "universe-cap", 1);

      const response = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: ADDRESS })
        .expect(201);

      const keys = Object.keys(response.body);
      expect(keys).not.toContain("paymentMethodId");
      expect(keys).not.toContain("paymentMethod");
      expect(JSON.stringify(response.body).toLowerCase()).not.toContain("payment");
    });

    it("clears the cart as part of order creation", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "marrow-cli", 1);

      await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: ADDRESS })
        .expect(201);

      const cart = await request(server()).get("/cart").set(SESSION_HEADER_NAME, sessionId).expect(200);
      expect(cart.body.items).toEqual([]);
      expect(cart.body.itemCount).toBe(0);
    });

    it("400s with the mock's { error: 'Missing session' } without a session", async () => {
      const response = await request(server())
        .post("/orders")
        .send({ shippingAddress: ADDRESS })
        .expect(400);
      expect(response.body).toEqual({ error: "Missing session" });
    });

    it("400s with 'Cart is empty' for a session with no cart", async () => {
      const response = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, freshSessionId())
        .send({ shippingAddress: ADDRESS })
        .expect(400);
      expect(response.body).toMatchObject({ statusCode: 400, message: "Cart is empty" });
    });

    it("400s when a required shippingAddress field is missing", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "universe-cap", 1);

      const { country, ...incomplete } = ADDRESS;
      const response = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: incomplete })
        .expect(400);
      expect(response.body.statusCode).toBe(400);
    });
  });

  describe("Order creation + cart clearing are atomic", () => {
    it("a forced failure mid-transaction leaves neither an order nor a cleared cart", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "worlds-poster", 1);

      // Inject a failure after the order write but before cart clearing. The
      // order must roll back with the transaction.
      jest.spyOn(cartService, "clearCart").mockRejectedValueOnce(new Error("injected failure"));

      await expect(
        ordersService.createOrder(sessionId, ADDRESS),
      ).rejects.toThrow("injected failure");

      const order = await prisma.order.findFirst({ where: { sessionId } });
      expect(order).toBeNull();

      const cart = await prisma.cart.findUnique({ where: { sessionId } });
      expect(cart).not.toBeNull();
      const lines = await prisma.cartItem.count({ where: { cartId: cart!.id } });
      expect(lines).toBe(1);
    });
  });

  describe("OrderItem.unitPrice is snapshotted at purchase time", () => {
    it("does not change when the product's price is updated after the order", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "universe-cap", 1);
      const created = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: ADDRESS })
        .expect(201);
      expect(created.body.items[0].unitPrice).toBe(29);

      // Price hike on the underlying product (restored in afterAll).
      await prisma.product.update({ where: { slug: "universe-cap" }, data: { basePrice: 4900 } });

      const fetched = await request(server())
        .get(`/orders/${created.body.id}`)
        .set(SESSION_HEADER_NAME, sessionId)
        .expect(200);
      expect(fetched.body.items[0].unitPrice).toBe(29);
      expect(fetched.body.total).toBe(created.body.total);

      // And the product is still $49 in the catalog.
      const product = await request(server()).get("/products/universe-cap").expect(200);
      expect(product.body.price).toBe(49);
    });
  });

  describe("GET /orders", () => {
    it("lists only the resolved session's orders, newest first", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "the-one-hoodie", 1);
      await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: ADDRESS })
        .expect(201);
      // The first order cleared the cart; restock before the second order.
      await seedCart(sessionId, "the-one-hoodie", 1);
      const newer = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: ADDRESS })
        .expect(201);

      const response = await request(server())
        .get("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .expect(200);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].id).toBe(newer.body.id);
      for (const order of response.body.items) {
        expect(order.status).toBe("PENDING");
        expect(order).not.toHaveProperty("paymentMethodId");
      }
    });

    it("400s with the mock's { error: 'Missing session' } without a session", async () => {
      const response = await request(server()).get("/orders").expect(400);
      expect(response.body).toEqual({ error: "Missing session" });
    });
  });

  describe("GET /orders/:id", () => {
    it("returns the order for its owner", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "hyperion-runtime", 1);
      const created = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: ADDRESS })
        .expect(201);

      const fetched = await request(server())
        .get(`/orders/${created.body.id}`)
        .set(SESSION_HEADER_NAME, sessionId)
        .expect(200);
      expect(fetched.body.id).toBe(created.body.id);
      expect(fetched.body).toEqual(created.body);
    });

    it("404s for an order owned by a different session (no existence leak)", async () => {
      const owner = freshSessionId();
      await seedCart(owner, "the-one-hoodie", 1);
      const created = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, owner)
        .send({ shippingAddress: ADDRESS })
        .expect(201);

      const other = freshSessionId();
      const response = await request(server())
        .get(`/orders/${created.body.id}`)
        .set(SESSION_HEADER_NAME, other)
        .expect(404);
      expect(response.body).toMatchObject({ statusCode: 404, message: "Order not found" });
    });

    it("404s with no session at all", async () => {
      const sessionId = freshSessionId();
      await seedCart(sessionId, "the-one-hoodie", 1);
      const created = await request(server())
        .post("/orders")
        .set(SESSION_HEADER_NAME, sessionId)
        .send({ shippingAddress: ADDRESS })
        .expect(201);

      const response = await request(server()).get(`/orders/${created.body.id}`).expect(404);
      expect(response.body).toMatchObject({ statusCode: 404, message: "Order not found" });
    });

    it("404s for an unknown id", async () => {
      const sessionId = freshSessionId();
      const response = await request(server())
        .get("/orders/does-not-exist")
        .set(SESSION_HEADER_NAME, sessionId)
        .expect(404);
      expect(response.body).toMatchObject({ statusCode: 404, message: "Order not found" });
    });
  });
});
