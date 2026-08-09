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
    <div className="shop-confirmation">
      <header className="shop-confirmation__head">
        <h1 className="shop-confirmation__title">{t("checkout.orderConfirmed")}</h1>
        <p className="shop-confirmation__order">
          {t("checkout.orderNumber", { number: order.orderNumber })}
        </p>
        <p className="shop-confirmation__status">
          {t(`orders.statuses.${order.status.toLowerCase()}`)}
        </p>
      </header>

      <section className="shop-confirmation__section">
        <h2 className="shop-confirmation__heading">{t("checkout.items")}</h2>
        <ul className="shop-summary__items">
          {order.items.map((item) => (
            <li key={item.id} className="shop-summary__line">
              <span className="shop-summary__name">
                {item.title} <small>× {item.quantity}</small>
              </span>
              <span className="shop-summary__price">
                {item.lineTotal.toLocaleString()} {order.currency}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="shop-confirmation__section">
        <h2 className="shop-confirmation__heading">{t("checkout.totals")}</h2>
        <dl className="shop-summary__totals">
          <div>
            <dt>{t("cart.subtotal")}</dt>
            <dd>
              {order.subtotal.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div>
            <dt>{t("cart.shipping")}</dt>
            <dd>
              {order.shipping === 0
                ? t("common.free")
                : `${order.shipping.toLocaleString()} ${order.currency}`}
            </dd>
          </div>
          <div>
            <dt>{t("cart.tax")}</dt>
            <dd>
              {order.tax.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div className="shop-summary__grand">
            <dt>{t("cart.total")}</dt>
            <dd>
              {order.total.toLocaleString()} {order.currency}
            </dd>
          </div>
        </dl>
      </section>

      <section className="shop-confirmation__section">
        <h2 className="shop-confirmation__heading">{t("checkout.delivery")}</h2>
        <dl className="shop-meta">
          <div>
            <dt>{t("checkout.shipTo")}</dt>
            <dd>
              {order.shippingAddress.fullName} · {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.region ? `${order.shippingAddress.region}, ` : ""}
              {order.shippingAddress.country}
            </dd>
          </div>
          <div>
            <dt>{t("checkout.email")}</dt>
            <dd>{order.shippingAddress.email}</dd>
          </div>
          <div>
            <dt>{t("checkout.payment")}</dt>
            <dd>
              {t("payment.cod")} — {t("payment.codNote")}
            </dd>
          </div>
          <div>
            <dt>{t("checkout.placed")}</dt>
            <dd>{new Date(order.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </section>

      <Link href="/" className="world-button">
        {t("checkout.continueShopping")}
      </Link>
    </div>
  );
}
