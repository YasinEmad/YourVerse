import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";

// E2E against the real HTTP routes. Requires the seeded dev database and Redis
// (see README): the .env DATABASE_URL/REDIS_URL are used by AppModule.

describe("Worlds + Catalog API", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalFilters(app.get(AllExceptionsFilter));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /worlds", () => {
    it("returns only active worlds as WorldSummaryDto[]", async () => {
      const response = await request(app.getHttpServer()).get("/worlds").expect(200);
      const worlds = response.body;
      expect(Array.isArray(worlds)).toBe(true);
      expect(worlds.length).toBeGreaterThanOrEqual(6);
      for (const world of worlds) {
        expect(Object.keys(world).sort()).toEqual(["isActive", "name", "slug", "tagline"]);
        expect(world.isActive).toBe(true);
        expect(world.name).toHaveProperty("en");
        expect(world.name).toHaveProperty("ar");
        expect(world.tagline).toHaveProperty("en");
        expect(world.tagline).toHaveProperty("ar");
      }
    });
  });

  describe("GET /worlds/:slug", () => {
    it("returns the world with its products as WorldDetailDto", async () => {
      const response = await request(app.getHttpServer()).get("/worlds/tech").expect(200);
      const body = response.body;
      expect(Object.keys(body).sort()).toEqual(["products", "world"]);
      expect(body.world.slug).toBe("tech");
      expect(body.world.isActive).toBe(true);
      expect(Array.isArray(body.products)).toBe(true);
      expect(body.products.length).toBe(7);
      for (const product of body.products) {
        expect(product).toHaveProperty("slug");
        expect(product).toHaveProperty("title");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("available");
      }
    });

    it("preserves the mock's per-world display titles (poetry is Arabic)", async () => {
      const response = await request(app.getHttpServer()).get("/worlds/poetry").expect(200);
      expect(response.body.products[0].title).toBe("قميص القصيدة");
    });

    it("404s for an unknown or inactive world with the ApiError shape", async () => {
      const response = await request(app.getHttpServer()).get("/worlds/does-not-exist").expect(404);
      expect(response.body).toEqual({
        statusCode: 404,
        message: "World not found",
        error: "Not Found",
      });
    });
  });

  describe("GET /products", () => {
    it("paginates by cursor with clamped limit and no overlap", async () => {
      const page1 = await request(app.getHttpServer())
        .get("/products?worldSlug=tech&limit=3")
        .expect(200);
      expect(page1.body.items).toHaveLength(3);
      expect(page1.body.items.map((item: { slug: string }) => item.slug)).toEqual([
        "the-one-hoodie",
        "universe-cap",
        "worlds-poster",
      ]);
      expect(page1.body.nextCursor).toBe("worlds-poster");

      const page2 = await request(app.getHttpServer())
        .get(`/products?worldSlug=tech&limit=3&cursor=${page1.body.nextCursor}`)
        .expect(200);
      expect(page2.body.items.map((item: { slug: string }) => item.slug)).toEqual([
        "hyperion-runtime",
        "sundial-db",
        "marrow-cli",
      ]);
      expect(page2.body.nextCursor).toBe("marrow-cli");

      const page3 = await request(app.getHttpServer())
        .get(`/products?worldSlug=tech&limit=3&cursor=${page2.body.nextCursor}`)
        .expect(200);
      expect(page3.body.items.map((item: { slug: string }) => item.slug)).toEqual([
        "obsidian-panel",
      ]);
      expect(page3.body.nextCursor).toBeNull();

      const allSlugs = [
        ...page1.body.items,
        ...page2.body.items,
        ...page3.body.items,
      ].map((item: { slug: string }) => item.slug);
      expect(new Set(allSlugs).size).toBe(allSlugs.length);
    });

    it("returns a complete list with nextCursor null for a large limit", async () => {
      const response = await request(app.getHttpServer())
        .get("/products?worldSlug=tech&limit=100")
        .expect(200);
      expect(response.body.items).toHaveLength(7);
      expect(response.body.nextCursor).toBeNull();
    });

    it("clamps limit below 1 to 1", async () => {
      const response = await request(app.getHttpServer())
        .get("/products?worldSlug=tech&limit=0")
        .expect(200);
      expect(response.body.items).toHaveLength(1);
    });

    it("returns an empty page for an unknown world (mock parity)", async () => {
      const response = await request(app.getHttpServer())
        .get("/products?worldSlug=unknown")
        .expect(200);
      expect(response.body).toEqual({ items: [], nextCursor: null });
    });
  });

  describe("GET /products/:slug", () => {
    it("returns the world-scoped detail", async () => {
      const response = await request(app.getHttpServer())
        .get("/products/neon-katana?world=gaming")
        .expect(200);
      expect(response.body.slug).toBe("neon-katana");
      expect(response.body.price).toBe(79);
      expect(response.body.available).toBe(true);
    });

    it("404s when the product has no presentation in the given world", async () => {
      const response = await request(app.getHttpServer())
        .get("/products/neon-katana?world=tech")
        .expect(404);
      expect(response.body).toMatchObject({ statusCode: 404, error: "Not Found" });
    });

    it("returns unavailable products with available: false (not a 404)", async () => {
      const response = await request(app.getHttpServer())
        .get("/products/obsidian-panel?world=tech")
        .expect(200);
      expect(response.body.available).toBe(false);
    });

    it("404s for an unknown slug", async () => {
      await request(app.getHttpServer()).get("/products/does-not-exist").expect(404);
    });

    it("supports the no-world base view", async () => {
      const response = await request(app.getHttpServer()).get("/products/hyperion-runtime").expect(200);
      expect(response.body.title).toBe("Hyperion Runtime");
      expect(response.body.price).toBe(99);
      expect(response.body.available).toBe(true);
    });
  });
});
