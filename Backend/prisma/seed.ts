import { PrismaClient } from "@prisma/client";
import { seedProducts, seedWorlds } from "./seed-data";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const worldBySlug = new Map<string, string>();

  for (const [index, world] of seedWorlds.entries()) {
    const created = await prisma.world.upsert({
      where: { slug: world.slug },
      create: world,
      update: world,
    });
    worldBySlug.set(world.slug, created.id);
    console.log(`world ${index + 1}/${seedWorlds.length}: ${world.slug}`);
  }

  for (const [index, product] of seedProducts.entries()) {    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        slug: product.slug,
        baseTitle: product.baseTitle,
        basePrice: product.basePriceCents,
        currency: product.currency,
      },
      update: {
        baseTitle: product.baseTitle,
        basePrice: product.basePriceCents,
        currency: product.currency,
      },
    });

    for (const presentation of product.worlds) {
      const worldId = worldBySlug.get(presentation.worldSlug);
      if (!worldId) {
        throw new Error(`Unknown world "${presentation.worldSlug}" for product "${product.slug}"`);
      }
      // sortWeight encodes the product's position in the global seed array,
      // which mirrors the mock catalog's per-world ordering.
      await prisma.productWorldPresentation.upsert({
        where: {
          productId_worldId: { productId: created.id, worldId },
        },
        create: {
          productId: created.id,
          worldId,
          title: { en: presentation.title, ar: presentation.title },
          subtitle: presentation.subtitle ?? null,
          primaryValue: presentation.primaryValue,
          secondaryValue: presentation.secondaryValue ?? null,
          imageUrl: null,
          accentColor: presentation.accentColor ?? null,
          badge: presentation.badge ?? null,
          isAvailable: presentation.available ?? true,
          sortWeight: index,
        },
        update: {
          title: { en: presentation.title, ar: presentation.title },
          subtitle: presentation.subtitle ?? null,
          primaryValue: presentation.primaryValue,
          secondaryValue: presentation.secondaryValue ?? null,
          imageUrl: null,
          accentColor: presentation.accentColor ?? null,
          badge: presentation.badge ?? null,
          isAvailable: presentation.available ?? true,
          sortWeight: index,
        },
      });
    }

    console.log(`product ${index + 1}/${seedProducts.length}: ${product.slug} (${product.worlds.length} presentations)`);
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
