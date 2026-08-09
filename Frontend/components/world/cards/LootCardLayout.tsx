import type { CSSProperties } from "react";
import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardMedia, CardPrice } from "./card-primitives";

export function LootCardLayout({
  product,
  labels,
  onAddToCart,
}: {
  product: ProductViewModel;
  labels: WorldCardFieldLabels;
  onAddToCart?: () => void;
}) {
  const style = product.accentColor
    ? ({ "--card-accent": product.accentColor } as CSSProperties)
    : undefined;

  return (
    <article
      className="flex flex-col gap-3 rounded-world border border-world-border bg-world-surface p-6 text-world-text"
      style={style}
    >
      <div className="relative">
        <CardMedia product={product} />
        <span className="absolute bottom-2 start-2 rounded-world bg-[color:color-mix(in_srgb,var(--card-accent,var(--world-primary))_22%,transparent)] px-2 py-1 text-xs uppercase tracking-[0.08em] text-world-text">
          {product.primaryMeta ?? "—"}
        </span>
      </div>
      <h3 className="font-world-heading text-lg leading-snug text-world-text">{product.title}</h3>
      {labels.secondaryMeta && product.secondaryMeta ? (
        <span className="font-world-mono text-xs text-world-text-muted">
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
