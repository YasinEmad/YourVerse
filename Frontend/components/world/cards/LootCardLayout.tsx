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
    <article className="world-card world-card--loot" style={style}>
      <div className="world-card__media-wrap">
        <CardMedia product={product} />
        <span className="world-card__rarity">{product.primaryMeta ?? "—"}</span>
      </div>
      <h3 className="world-card__title">{product.title}</h3>
      {labels.secondaryMeta && product.secondaryMeta ? (
        <span className="world-card__stock">
          {labels.secondaryMeta.en}: {product.secondaryMeta}
        </span>
      ) : null}
      <footer className="world-card__foot">
        <CardPrice product={product} />
        <CardCta disabled={!product.available} onClick={onAddToCart}>{labels.ctaLabel.en}</CardCta>
      </footer>
    </article>
  );
}
