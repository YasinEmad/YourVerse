import type { ProductViewModel } from "@/types/product";
import type { WorldCardFieldLabels } from "@/types/world-config";
import { CardCta, CardPrice } from "./card-primitives";

export function VerseCardLayout({
  product,
  labels,
}: {
  product: ProductViewModel;
  labels: WorldCardFieldLabels;
}) {
  return (
    <article className="world-card world-card--verse">
      <span className="world-card__era">
        {labels.primaryMeta.en}: {product.primaryMeta ?? "—"}
      </span>
      <h3 className="world-card__verse">{product.title}</h3>
      {product.subtitle ? <p className="world-card__subtitle">{product.subtitle}</p> : null}
      {labels.secondaryMeta && product.secondaryMeta ? (
        <span className="world-card__meter">
          {labels.secondaryMeta.en}: {product.secondaryMeta}
        </span>
      ) : null}
      <footer className="world-card__foot world-card__foot--center">
        <CardPrice product={product} />
        <CardCta disabled={!product.available}>{labels.ctaLabel.en}</CardCta>
      </footer>
    </article>
  );
}
