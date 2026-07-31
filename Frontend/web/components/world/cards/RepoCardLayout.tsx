import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardPrice } from "./card-primitives";

export function RepoCardLayout({
  product,
  labels,
}: {
  product: ProductViewModel;
  labels: WorldCardFieldLabels;
}) {
  return (
    <article className="world-card world-card--repo">
      <header className="world-card__head">
        <span className="world-card__status" aria-hidden="true" />
        <span className="world-card__tag">{product.badge ?? labels.title.en}</span>
      </header>
      <h3 className="world-card__title">{product.title}</h3>
      {product.subtitle ? <p className="world-card__subtitle">{product.subtitle}</p> : null}
      <dl className="world-card__meta">
        <div>
          <dt>{labels.primaryMeta.en}</dt>
          <dd>{product.primaryMeta ?? "—"}</dd>
        </div>
        {labels.secondaryMeta && product.secondaryMeta ? (
          <div>
            <dt>{labels.secondaryMeta.en}</dt>
            <dd>{product.secondaryMeta}</dd>
          </div>
        ) : null}
      </dl>
      <footer className="world-card__foot">
        <CardPrice product={product} />
        <CardCta disabled={!product.available}>{labels.ctaLabel.en}</CardCta>
      </footer>
    </article>
  );
}
