import type { ProductViewModel } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  title,
  products,
}: {
  title?: string;
  products: ProductViewModel[];
}) {
  return (
    <section className="world-grid" aria-label={title ?? "Products"}>
      {title ? <h2 className="world-grid__title">{title}</h2> : null}
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </section>
  );
}
