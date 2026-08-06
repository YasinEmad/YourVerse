import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/catalog";
import { WorldNav } from "@/components/world/WorldNav";
import { ProductDetail } from "@/components/world/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { worldSlug: string; productSlug: string };
}) {
  const product = await getProduct(params.productSlug, params.worldSlug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <WorldNav />
      <main>
        <ProductDetail product={product} />
      </main>
    </>
  );
}
