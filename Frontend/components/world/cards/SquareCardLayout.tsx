import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardMedia, CardPrice, CardTag } from "./card-primitives";

export function SquareCardLayout({
  product,
  labels,
  onAddToCart,
}: {
  product: ProductViewModel;
  labels: WorldCardFieldLabels;
  onAddToCart?: () => void;
}) {
  return (
    <article className="flex flex-col items-center gap-3 rounded-world border border-world-border bg-world-surface p-6 text-center text-world-text">
      <CardMedia product={product} className="w-full max-w-[10rem]" />
      {product.badge ? <CardTag>{product.badge}</CardTag> : null}
      <h3 className="font-world-heading text-lg leading-snug text-world-text">{product.title}</h3>
      {product.primaryMeta ? (
        <p className="m-0 text-sm text-world-text-muted">{product.primaryMeta}</p>
      ) : null}
      <footer className="mt-auto flex w-full items-center justify-between gap-4">
        <CardPrice product={product} />
        <CardCta disabled={!product.available} onClick={onAddToCart}>
          {labels.ctaLabel.en}
        </CardCta>
      </footer>
    </article>
  );
}
