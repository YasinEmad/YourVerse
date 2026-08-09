"use client";

import type { CartItemDto } from "@/lib/api/types";
import { toLineTotal } from "@/lib/cart/cart-store";
import { useI18n } from "@/lib/i18n/locale-provider";

export interface CartLineItemProps {
  item: CartItemDto;
  currency: string;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function CartLineItem({
  item,
  currency,
  onUpdateQuantity,
  onRemove,
  disabled,
}: CartLineItemProps) {
  const { t } = useI18n();
  const lineTotal = toLineTotal(item);

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 rounded-world border border-world-border bg-world-surface p-4 max-[48rem]:grid-cols-1">
      <div>
        <h3 className="font-heading m-0 text-base text-world-text">{item.title}</h3>
        <p className="mt-1 text-sm text-world-text-muted">
          {item.unitPrice.toLocaleString()} {currency} {t("common.each")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-world border border-world-border bg-transparent text-world-text transition-colors duration-150 hover:border-world-primary hover:text-world-primary disabled:cursor-not-allowed disabled:opacity-40"
          disabled={disabled || item.quantity <= 1}
          aria-label={t("a11y.decreaseQuantity")}
          onClick={() => onUpdateQuantity(item.quantity - 1)}
        >
          −
        </button>
        <span
          className="min-w-[2ch] text-center font-mono text-world-text"
          aria-label={t("a11y.quantityLabel", { qty: item.quantity })}
        >
          {item.quantity}
        </span>
        <button
          type="button"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-world border border-world-border bg-transparent text-world-text transition-colors duration-150 hover:border-world-primary hover:text-world-primary disabled:cursor-not-allowed disabled:opacity-40"
          disabled={disabled}
          aria-label={t("a11y.increaseQuantity")}
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          +
        </button>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent px-3 py-2 text-sm text-world-text-muted underline underline-offset-[3px] transition-colors duration-150 hover:text-world-text disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={onRemove}
        >
          {t("common.remove")}
        </button>
      </div>
      <span className="font-mono text-end text-sm text-world-text max-[48rem]:text-start">
        {lineTotal.toLocaleString()} {currency}
      </span>
    </li>
  );
}
