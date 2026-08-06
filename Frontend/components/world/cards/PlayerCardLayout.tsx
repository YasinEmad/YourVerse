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
    <article className="world-card world-card--player">
      <span className="world-card__shirt">{product.badge ?? product.title.slice(0, 1)}</span>
      <h3 className="world-card__title">{product.title}</h3>
      {product.subtitle ? <p className="world-card__subtitle">{product.subtitle}</p> : null}
      <div className="world-card__stat">
        <span className="world-card__stat-label">{labels.primaryMeta.en}</span>
        <span className="world-card__stat-value">{product.primaryMeta ?? "—"}</span>
      </div>
      {labels.secondaryMeta && product.secondaryMeta ? (
        <span className="world-card__position">
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
