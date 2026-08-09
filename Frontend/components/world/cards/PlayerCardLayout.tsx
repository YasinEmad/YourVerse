import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardPrice } from "./card-primitives";

export function PlayerCardLayout({
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
      <span className="grid h-12 w-12 place-items-center rounded-world bg-world-accent font-world-heading text-xl font-extrabold text-world-bg">
        {product.badge ?? product.title.slice(0, 1)}
      </span>
      <h3 className="font-world-heading text-lg leading-snug text-world-text">{product.title}</h3>
      {product.subtitle ? (
        <p className="m-0 text-sm text-world-text-muted">{product.subtitle}</p>
      ) : null}
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-world-text-muted">{labels.primaryMeta.en}</span>
        <span className="font-world-mono text-3xl font-bold text-world-accent">
          {product.primaryMeta ?? "—"}
        </span>
      </div>
      {labels.secondaryMeta && product.secondaryMeta ? (
        <span className="font-world-mono text-sm text-world-text-muted">
          {labels.secondaryMeta.en}: {product.secondaryMeta}
        </span>
      ) : null}
      <footer className="mt-auto flex items-center justify-between gap-4">
        <CardPrice product={product} />
        <CardCta disabled={!product.available} onClick={onAddToCart}>
          {labels.ctaLabel.en}
        </CardCta>
      </footer>
    </article>
  );
}
