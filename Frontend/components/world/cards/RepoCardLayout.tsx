import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardPrice, CardTag } from "./card-primitives";

export function RepoCardLayout({
  product,
  labels,
  onAddToCart,
}: {
  product: ProductViewModel;
  labels: WorldCardFieldLabels;
  onAddToCart?: () => void;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-world border border-world-border bg-world-surface p-6 text-world-text">
      <header className="flex items-center justify-between font-world-mono text-xs text-world-text-muted">
        <span className="h-2 w-2 rounded-full bg-world-primary" aria-hidden="true" />
        <CardTag>{product.badge ?? labels.title.en}</CardTag>
      </header>
      <h3 className="font-world-heading text-lg leading-snug text-world-text">{product.title}</h3>
      {product.subtitle ? (
        <p className="m-0 text-sm text-world-text-muted">{product.subtitle}</p>
      ) : null}
      <dl className="m-0 grid grid-cols-2 gap-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
            {labels.primaryMeta.en}
          </dt>
          <dd className="m-0 font-world-mono text-sm text-world-text">
            {product.primaryMeta ?? "—"}
          </dd>
        </div>
        {labels.secondaryMeta && product.secondaryMeta ? (
          <div>
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {labels.secondaryMeta.en}
            </dt>
            <dd className="m-0 font-world-mono text-sm text-world-text">{product.secondaryMeta}</dd>
          </div>
        ) : null}
      </dl>
      <footer className="mt-auto flex items-center justify-between gap-4">
        <CardPrice product={product} />
        <CardCta disabled={!product.available} onClick={onAddToCart}>
          {labels.ctaLabel.en}
        </CardCta>
      </footer>
    </article>
  );
}
