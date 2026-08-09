import type { ReactNode } from "react";
import type { ProductViewModel } from "@/types/product";

export function CardMedia({
  product,
  className,
}: {
  product: ProductViewModel;
  className?: string;
}) {
  return (
    <div
      className={`grid aspect-square place-items-center overflow-hidden rounded-world border border-world-border bg-world-bg-alt font-world-heading text-4xl text-world-text-muted${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span>{product.title.slice(0, 1)}</span>
      )}
    </div>
  );
}

export function CardPrice({ product }: { product: ProductViewModel }) {
  return (
    <span className="font-world-mono text-sm text-world-text">
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
    <button
      className="inline-flex cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function CardTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[calc(var(--world-radius)/2)] border border-world-border px-2 py-1 text-xs text-world-text-muted">
      {children}
    </span>
  );
}
