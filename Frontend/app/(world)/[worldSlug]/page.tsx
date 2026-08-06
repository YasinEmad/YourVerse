import { notFound } from "next/navigation";
import { getWorldConfig } from "@/config/worlds";
import { getWorldProducts } from "@/lib/api/catalog";
import { WorldHero } from "@/components/world/WorldHero";
import { WorldNav } from "@/components/world/WorldNav";
import { ProductGrid } from "@/components/world/ProductGrid";

export const dynamic = "force-dynamic";

export default async function WorldPage({ params }: { params: { worldSlug: string } }) {
  const config = getWorldConfig(params.worldSlug);
  if (!config || !config.isActive) {
    notFound();
  }

  const products = await getWorldProducts(config.slug);

  return (
    <>
      <WorldNav />
      <main>
        <WorldHero />
        <ProductGrid title={config.name.en} products={products} />
      </main>
    </>
  );
}
