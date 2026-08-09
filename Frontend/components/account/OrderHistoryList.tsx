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
    return <p className="m-0 text-world-text-muted">{t("orders.empty")}</p>;
  }

  return (
    <ul className="m-0 grid list-none gap-4 p-0">
      {orders.map((order) => (
        <li
          key={order.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-world border border-world-border bg-world-surface p-4"
        >
          <div className="grid gap-1">
            <p className="font-mono m-0 text-base text-world-text">
              {t("orders.orderNumber", { number: order.orderNumber })}
            </p>
            <p className="m-0 text-sm text-world-text-muted">
              {t("orders.placedOn", {
                date: new Date(order.createdAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
              })}
            </p>
            <p className="m-0 text-sm text-world-text-muted">
              {t("orders.status")}: {t(`orders.statuses.${order.status.toLowerCase()}`)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-mono m-0 text-sm text-world-text">
              {order.total.toLocaleString(locale)} {order.currency}
            </p>
            <Link
              href={`/account/orders/${order.id}`}
              className="inline-flex cursor-pointer items-center justify-center rounded-world border border-world-border bg-transparent px-4 py-2 text-sm font-semibold text-world-text transition-[opacity,transform] duration-150 hover:-translate-y-px hover:border-world-primary hover:text-world-primary hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t("orders.viewOrder")}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
