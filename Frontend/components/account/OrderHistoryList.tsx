import Link from "next/link";
import type { OrderDto } from "@/lib/api/types";
import type { Translate } from "@/lib/i18n/translate";

export interface OrderHistoryListProps {
  orders: OrderDto[];
  t: Translate;
  locale: string;
}

export function OrderHistoryList({ orders, t, locale }: OrderHistoryListProps) {
  if (orders.length === 0) {
    return <p className="shop-empty">{t("orders.empty")}</p>;
  }

  return (
    <ul className="order-list">
      {orders.map((order) => (
        <li key={order.id} className="order-card">
          <div className="order-card__main">
            <p className="order-card__number">{t("orders.orderNumber", { number: order.orderNumber })}</p>
            <p className="order-card__meta">
              {t("orders.placedOn", {
                date: new Date(order.createdAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
              })}
            </p>
            <p className="order-card__meta">
              {t("orders.status")}: {t(`orders.statuses.${order.status.toLowerCase()}`)}
            </p>
          </div>
          <div className="order-card__aside">
            <p className="order-card__total">
              {order.total.toLocaleString(locale)} {order.currency}
            </p>
            <Link href={`/account/orders/${order.id}`} className="world-button world-button--ghost">
              {t("orders.viewOrder")}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
