import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardPrice } from "./card-primitives";

export function VerseCardLayout({
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
      <span className="font-world-mono text-xs uppercase tracking-[0.1em] text-world-text-muted">
        {labels.primaryMeta.en}: {product.primaryMeta ?? "—"}
      </span>
      <h3 className="m-0 font-world-heading text-2xl leading-relaxed text-world-text [direction:rtl]">
        {product.title}
      </h3>
      {product.subtitle ? (
        <p className="m-0 text-sm text-world-text-muted">{product.subtitle}</p>
      ) : null}
      {labels.secondaryMeta && product.secondaryMeta ? (
        <span className="text-sm text-world-text-muted">
          {labels.secondaryMeta.en}: {product.secondaryMeta}
        </span>
      ) : null}
      <footer className="mt-auto flex items-center justify-center gap-4">
        <CardPrice product={product} />
        <CardCta disabled={!product.available} onClick={onAddToCart}>
          {labels.ctaLabel.en}
        </CardCta>
      </footer>
    </article>
  );
}
