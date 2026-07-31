import { notFound } from "next/navigation";
import { getWorldConfig } from "@/config/worlds";
import { getMockProducts } from "@/lib/catalog/mock-catalog";
import { WorldHero } from "@/components/world/WorldHero";
import { WorldNav } from "@/components/world/WorldNav";
import { ProductGrid } from "@/components/world/ProductGrid";

export default function WorldPage({ params }: { params: { worldSlug: string } }) {
  const config = getWorldConfig(params.worldSlug);
  if (!config || !config.isActive) {
    notFound();
  }

  const products = getMockProducts(config.slug);

  return (
    <>
      <WorldNav />
      <main>
        <WorldHero />
        <ProductGrid products={products} />
      </main>
    </>
  );
}
