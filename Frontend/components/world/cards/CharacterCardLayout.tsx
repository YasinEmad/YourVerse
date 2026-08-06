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
    <article className="world-card world-card--character">
      <div className="world-card__media-wrap">
        <CardMedia product={product} />
        {product.badge ? <span className="world-card__rank">{product.badge}</span> : null}
      </div>
      <h3 className="world-card__title">{product.title}</h3>
      {product.subtitle ? <p className="world-card__subtitle">{product.subtitle}</p> : null}
      <div className="world-card__chips">
        <CardTag>
          {labels.primaryMeta.en}: {product.primaryMeta ?? "—"}
        </CardTag>
        {labels.secondaryMeta && product.secondaryMeta ? (
          <CardTag>{product.secondaryMeta}</CardTag>
        ) : null}
      </div>
      <footer className="world-card__foot">
        <CardPrice product={product} />
        <CardCta disabled={!product.available} onClick={onAddToCart}>{labels.ctaLabel.en}</CardCta>
      </footer>
    </article>
  );
}
