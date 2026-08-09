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
    <aside className="rounded-world border border-world-border bg-world-surface p-6">
      <h2 className="font-heading m-0 mb-4 text-lg text-world-text">
        {title ?? t("cart.summaryTitle")}
      </h2>
      {items.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-3 border-b border-world-border p-0 pb-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-world-text">
                {item.title}{" "}
                <small className="text-world-text-muted">× {item.quantity}</small>
              </span>
              <span className="font-mono text-sm text-world-text">
                {(item.unitPrice * item.quantity).toLocaleString()} {currency}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-sm text-world-text-muted">{t("cart.empty")}</p>
      )}
      <dl className="mt-4 grid gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-world-text-muted">{t("cart.subtotal")}</dt>
          <dd className="m-0 font-mono text-sm text-world-text">
            {totals.subtotal.toLocaleString()} {currency}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-world-text-muted">{t("cart.shipping")}</dt>
          <dd className="m-0 font-mono text-sm text-world-text">
            {totals.shipping === 0 ? t("common.free") : `${totals.shipping.toLocaleString()} ${currency}`}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-world-text-muted">{t("cart.tax")}</dt>
          <dd className="m-0 font-mono text-sm text-world-text">
            {totals.tax.toLocaleString()} {currency}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-world-border pt-3">
          <dt className="text-base font-bold text-world-text-muted">{t("cart.total")}</dt>
          <dd className="m-0 font-mono text-base font-bold text-world-text">
            {totals.total.toLocaleString()} {currency}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
