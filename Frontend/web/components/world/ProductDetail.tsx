"use client";

import Link from "next/link";
import type { ProductViewModel } from "@/types/product";
import { useWorldConfig } from "@/hooks/useWorldConfig";
import { ProductCard } from "./ProductCard";

export function ProductDetail({ product }: { product: ProductViewModel }) {
  const { slug, productCard, copy } = useWorldConfig();
  const labels = productCard.fieldLabels;

  return (
    <section className="world-detail" aria-label={product.title}>
      <div className="world-detail__card">
        <ProductCard product={product} />
      </div>
      <aside className="world-detail__aside">
        <Link href={`/${slug}`} className="world-detail__back">
          ← {slug}
        </Link>
        <h1 className="world-detail__title">{product.title}</h1>
        {product.subtitle ? <p className="world-detail__subtitle">{product.subtitle}</p> : null}
        <dl className="world-detail__meta">
          {product.primaryMeta ? (
            <div>
              <dt>{labels.primaryMeta.en}</dt>
              <dd>{product.primaryMeta}</dd>
            </div>
          ) : null}
          {labels.secondaryMeta && product.secondaryMeta ? (
            <div>
              <dt>{labels.secondaryMeta.en}</dt>
              <dd>{product.secondaryMeta}</dd>
            </div>
          ) : null}
        </dl>
        <p className="world-detail__availability">
          {product.available ? copy.addToCart.en : copy.viewDetails.en}
        </p>
      </aside>
    </section>
  );
}
