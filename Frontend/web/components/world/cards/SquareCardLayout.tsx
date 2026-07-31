import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardMedia, CardPrice, CardTag } from "./card-primitives";

export function SquareCardLayout({
  product,
  labels,
}: {
  product: ProductViewModel;
  labels: WorldCardFieldLabels;
}) {
  return (
    <article className="world-card world-card--square">
      <div className="world-card__media-wrap">
        <CardMedia product={product} />
        {product.badge ? <CardTag>{product.badge}</CardTag> : null}
      </div>
      <h3 className="world-card__title">{product.title}</h3>
      {product.primaryMeta ? <p className="world-card__subtitle">{product.primaryMeta}</p> : null}
      <footer className="world-card__foot">
        <CardPrice product={product} />
        <CardCta disabled={!product.available}>{labels.ctaLabel.en}</CardCta>
      </footer>
    </article>
  );
}
