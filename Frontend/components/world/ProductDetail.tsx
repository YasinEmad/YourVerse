"use client";

import Link from "next/link";
import type { ProductViewModel } from "@/types/product";
import { useWorldConfig } from "@/hooks/useWorldConfig";
import { ProductCard } from "./ProductCard";

export function ProductDetail({ product }: { product: ProductViewModel }) {
  const { slug, productCard, copy } = useWorldConfig();
  const labels = productCard.fieldLabels;

  return (
    <section
      className="mx-auto grid w-full max-w-[60rem] grid-cols-[minmax(0,28rem)_1fr] items-start gap-12 px-6 pt-12 pb-24 max-[640px]:grid-cols-1"
      aria-label={product.title}
    >
      <div className="max-w-[28rem]">
        <ProductCard product={product} />
      </div>
      <aside className="flex flex-col gap-4">
        <Link
          href={`/${slug}`}
          className="self-start font-world-mono text-sm text-world-text-muted no-underline transition-colors duration-150 hover:text-world-text"
        >
          ← {slug}
        </Link>
        <h1 className="font-world-heading text-4xl leading-tight text-world-text">
          {product.title}
        </h1>
        {product.subtitle ? (
          <p className="m-0 text-lg text-world-text-muted">{product.subtitle}</p>
        ) : null}
        <dl className="m-0 mt-2 grid gap-3">
          {product.primaryMeta ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
                {labels.primaryMeta.en}
              </dt>
              <dd className="m-0 font-world-mono text-base text-world-text">
                {product.primaryMeta}
              </dd>
            </div>
          ) : null}
          {labels.secondaryMeta && product.secondaryMeta ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
                {labels.secondaryMeta.en}
              </dt>
              <dd className="m-0 font-world-mono text-base text-world-text">
                {product.secondaryMeta}
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-6 font-semibold text-world-accent">
          {product.available ? copy.addToCart.en : copy.viewDetails.en}
        </p>
      </aside>
    </section>
  );
}
