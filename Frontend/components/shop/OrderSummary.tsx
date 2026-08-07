"use client";

import type { CartItemDto } from "@/lib/api/types";
import { computeOrderTotals } from "@/lib/orders/order-totals";
import { useI18n } from "@/lib/i18n/locale-provider";

export interface OrderSummaryProps {
  items: CartItemDto[];
  currency: string;
  title?: string;
}

export function OrderSummary({ items, currency, title }: OrderSummaryProps) {
  const { t } = useI18n();
  const totals = computeOrderTotals(items);

  return (
    <aside className="shop-summary">
      <h2 className="shop-summary__title">{title ?? t("cart.summaryTitle")}</h2>
      {items.length > 0 ? (
        <ul className="shop-summary__items">
          {items.map((item) => (
            <li key={item.id} className="shop-summary__line">
              <span className="shop-summary__name">
                {item.title} <small>× {item.quantity}</small>
              </span>
              <span className="shop-summary__price">
                {(item.unitPrice * item.quantity).toLocaleString()} {currency}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="shop-note">{t("cart.empty")}</p>
      )}
      <dl className="shop-summary__totals">
        <div>
          <dt>{t("cart.subtotal")}</dt>
          <dd>
            {totals.subtotal.toLocaleString()} {currency}
          </dd>
        </div>
        <div>
          <dt>{t("cart.shipping")}</dt>
          <dd>{totals.shipping === 0 ? t("common.free") : `${totals.shipping.toLocaleString()} ${currency}`}</dd>
        </div>
        <div>
          <dt>{t("cart.tax")}</dt>
          <dd>
            {totals.tax.toLocaleString()} {currency}
          </dd>
        </div>
        <div className="shop-summary__grand">
          <dt>{t("cart.total")}</dt>
          <dd>
            {totals.total.toLocaleString()} {currency}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
