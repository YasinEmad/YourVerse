import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { PrismaService } from "../../src/common/prisma/prisma.service";
import { RedisService } from "../../src/common/redis/redis.service";

// DoD: the catalog list response is cached in Redis and a ProductWorldPresentation
// write invalidates the cached page, so the next request reads fresh data.

describe("Catalog list cache invalidation (e2e)", () => {
  let app: INestApplication;
  let redis: RedisService;
  let prisma: PrismaService;

  const ORIGINAL_SUBTITLE = "240gsm graphite fleece · ESD-safe lining";
  const MUTATED_SUBTITLE = "240gsm graphite fleece · ESD-safe lining · INVALIDATED";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalFilters(app.get(AllExceptionsFilter));
    await app.init();

    redis = app.get(RedisService);
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // restore the seeded value regardless of test outcome
    const product = await prisma.product.findUnique({ where: { slug: "the-one-hoodie" } });
    const world = await prisma.world.findUnique({ where: { slug: "tech" } });
    if (product && world) {
      await prisma.productWorldPresentation.update({
        where: { productId_worldId: { productId: product.id, worldId: world.id } },
        data: { subtitle: ORIGINAL_SUBTITLE },
      });
    }
    await app.close();
  });

  it("caches the list response, then invalidates it on a PWP write", async () => {
    const cacheKey = "catalog:list:tech::3";
    await redis.del([cacheKey]);

    // 1. Prime the cache with the seeded value.
    const first = await request(app.getHttpServer())
      .get("/products?worldSlug=tech&limit=3")
      .expect(200);
    expect(first.body.items).toHaveLength(3);
    expect(first.body.items[0].subtitle).toBe(ORIGINAL_SUBTITLE);
    expect(await redis.exists(cacheKey)).toBe(true);

    // 2. A repeated request within the TTL is served from cache.
    const second = await request(app.getHttpServer())
      .get("/products?worldSlug=tech&limit=3")
      .expect(200);
    expect(second.body.items[0].subtitle).toBe(ORIGINAL_SUBTITLE);

    // 3. Write through PrismaService; the middleware must purge the cached page
    //    BEFORE the write resolves (awaited listener chain).
    const product = await prisma.product.findUniqueOrThrow({ where: { slug: "the-one-hoodie" } });
    const world = await prisma.world.findUniqueOrThrow({ where: { slug: "tech" } });
    await prisma.productWorldPresentation.update({
      where: { productId_worldId: { productId: product.id, worldId: world.id } },
      data: { subtitle: MUTATED_SUBTITLE },
    });

    // 4. Cache key is gone and the next request reflects the mutation.
    expect(await redis.exists(cacheKey)).toBe(false);
    const third = await request(app.getHttpServer())
      .get("/products?worldSlug=tech&limit=3")
      .expect(200);
    expect(third.body.items[0].subtitle).toBe(MUTATED_SUBTITLE);
  });
});
