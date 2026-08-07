import Link from "next/link";
import type { OrderDto } from "@/lib/api/types";
import type { OrderTotals } from "@/lib/orders/order-totals";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { getPaymentMethod } from "./payment-methods";

export interface OrderConfirmationProps {
  order: OrderDto;
  totals: OrderTotals;
  dict: Dictionary;
}

export function OrderConfirmation({ order, totals, dict }: OrderConfirmationProps) {
  const t = createTranslator(dict);
  const paymentMethod = getPaymentMethod(order.paymentMethodId);

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
              {totals.subtotal.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div>
            <dt>{t("cart.shipping")}</dt>
            <dd>
              {totals.shipping === 0
                ? t("common.free")
                : `${totals.shipping.toLocaleString()} ${order.currency}`}
            </dd>
          </div>
          <div>
            <dt>{t("cart.tax")}</dt>
            <dd>
              {totals.tax.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div className="shop-summary__grand">
            <dt>{t("cart.total")}</dt>
            <dd>
              {totals.total.toLocaleString()} {order.currency}
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
            <dd>{paymentMethod ? t(paymentMethod.labelKey) : order.paymentMethodId}</dd>
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
