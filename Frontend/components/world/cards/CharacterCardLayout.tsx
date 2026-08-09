import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardMedia, CardPrice, CardTag } from "./card-primitives";

export function CharacterCardLayout({
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
      <div className="relative">
        <CardMedia product={product} />
        {product.badge ? (
          <span className="absolute top-2 end-2 rounded-world bg-world-accent px-2 py-1 font-world-heading text-xs font-bold text-world-bg">
            {product.badge}
          </span>
        ) : null}
      </div>
      <h3 className="font-world-heading text-lg leading-snug text-world-text">{product.title}</h3>
      {product.subtitle ? (
        <p className="m-0 text-sm text-world-text-muted">{product.subtitle}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <CardTag>
          {labels.primaryMeta.en}: {product.primaryMeta ?? "—"}
        </CardTag>
        {labels.secondaryMeta && product.secondaryMeta ? (
          <CardTag>{product.secondaryMeta}</CardTag>
        ) : null}
      </div>
      <footer className="mt-auto flex items-center justify-between gap-4">
        <CardPrice product={product} />
        <CardCta disabled={!product.available} onClick={onAddToCart}>
          {labels.ctaLabel.en}
        </CardCta>
      </footer>
    </article>
  );
}
