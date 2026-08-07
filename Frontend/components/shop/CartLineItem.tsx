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
    <li className="shop-line-item">
      <div className="shop-line-item__info">
        <h3 className="shop-line-item__title">{item.title}</h3>
        <p className="shop-line-item__price">
          {item.unitPrice.toLocaleString()} {currency} {t("common.each")}
        </p>
      </div>
      <div className="shop-line-item__controls">
        <button
          type="button"
          className="shop-line-item__qty"
          disabled={disabled || item.quantity <= 1}
          aria-label={t("a11y.decreaseQuantity")}
          onClick={() => onUpdateQuantity(item.quantity - 1)}
        >
          −
        </button>
        <span className="shop-line-item__count" aria-label={t("a11y.quantityLabel", { qty: item.quantity })}>
          {item.quantity}
        </span>
        <button
          type="button"
          className="shop-line-item__qty"
          disabled={disabled}
          aria-label={t("a11y.increaseQuantity")}
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          +
        </button>
        <button
          type="button"
          className="shop-line-item__remove"
          disabled={disabled}
          onClick={onRemove}
        >
          {t("common.remove")}
        </button>
      </div>
      <span className="shop-line-item__total">
        {lineTotal.toLocaleString()} {currency}
      </span>
    </li>
  );
}
