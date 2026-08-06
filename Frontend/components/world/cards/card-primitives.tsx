import type { ReactNode } from "react";
import type { ProductViewModel } from "@/types/product";

export function CardMedia({ product }: { product: ProductViewModel }) {
  return (
    <div className="world-card__media" aria-hidden="true">
      {product.imageUrl ? <img src={product.imageUrl} alt="" /> : <span>{product.title.slice(0, 1)}</span>}
    </div>
  );
}

export function CardPrice({ product }: { product: ProductViewModel }) {
  return (
    <span className="world-card__price">
      {product.price.toLocaleString()} {product.currency}
    </span>
  );
}

export function CardCta({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button className="world-button" type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function CardTag({ children }: { children: ReactNode }) {
  return <span className="world-card__tag">{children}</span>;
}
