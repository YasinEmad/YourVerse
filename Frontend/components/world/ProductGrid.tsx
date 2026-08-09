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
    <section
      className="mx-auto grid w-full max-w-[80rem] grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-6 px-6 pt-10 pb-16"
      aria-label={title ?? "Products"}
    >
      {title ? <h2 className="col-span-full font-world-heading text-2xl text-world-text">{title}</h2> : null}
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </section>
  );
}
