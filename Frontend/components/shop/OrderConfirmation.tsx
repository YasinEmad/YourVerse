import Link from "next/link";
import type { OrderDto } from "@/lib/api/types";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { createTranslator } from "@/lib/i18n/translate";

export interface OrderConfirmationProps {
  order: OrderDto;
  dict: Dictionary;
}

// Renders the backend's AUTHORITATIVE OrderDto totals (backend-architecture.md
// §12) — never a client-side recomputation. COD-only: payment is shown as a
// static notice, not a stored choice.
export function OrderConfirmation({ order, dict }: OrderConfirmationProps) {
  const t = createTranslator(dict);

  return (
    <div className="flex flex-col gap-10">
      <header className="text-center">
        <h1 className="font-heading m-0 text-4xl text-world-text">{t("checkout.orderConfirmed")}</h1>
        <p className="mt-2 font-mono text-world-primary">
          {t("checkout.orderNumber", { number: order.orderNumber })}
        </p>
        <p className="mt-1 text-sm text-world-text-muted">
          {t(`orders.statuses.${order.status.toLowerCase()}`)}
        </p>
      </header>

      <section className="grid gap-4">
        <h2 className="font-heading m-0 text-lg text-world-text">{t("checkout.items")}</h2>
        <ul className="m-0 flex list-none flex-col gap-3 border-b border-world-border p-0 pb-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-world-text">
                {item.title} <small className="text-world-text-muted">× {item.quantity}</small>
              </span>
              <span className="font-mono text-sm text-world-text">
                {item.lineTotal.toLocaleString()} {order.currency}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading m-0 text-lg text-world-text">{t("checkout.totals")}</h2>
        <dl className="mt-4 grid gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-world-text-muted">{t("cart.subtotal")}</dt>
            <dd className="m-0 font-mono text-sm text-world-text">
              {order.subtotal.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-world-text-muted">{t("cart.shipping")}</dt>
            <dd className="m-0 font-mono text-sm text-world-text">
              {order.shipping === 0
                ? t("common.free")
                : `${order.shipping.toLocaleString()} ${order.currency}`}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-world-text-muted">{t("cart.tax")}</dt>
            <dd className="m-0 font-mono text-sm text-world-text">
              {order.tax.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-world-border pt-3">
            <dt className="text-base font-bold text-world-text-muted">{t("cart.total")}</dt>
            <dd className="m-0 font-mono text-base font-bold text-world-text">
              {order.total.toLocaleString()} {order.currency}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading m-0 text-lg text-world-text">{t("checkout.delivery")}</h2>
        <dl className="m-0 grid gap-3">
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {t("checkout.shipTo")}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {order.shippingAddress.fullName} · {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.region ? `${order.shippingAddress.region}, ` : ""}
              {order.shippingAddress.country}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {t("checkout.email")}
            </dt>
            <dd className="m-0 text-sm text-world-text">{order.shippingAddress.email}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {t("checkout.payment")}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {t("payment.cod")} — {t("payment.codNote")}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {t("checkout.placed")}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {new Date(order.createdAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>

      <Link
        href="/"
        className="inline-flex w-max cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {t("checkout.continueShopping")}
      </Link>
    </div>
  );
}
