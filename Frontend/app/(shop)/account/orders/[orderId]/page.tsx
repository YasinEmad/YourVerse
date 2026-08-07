import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/getSession";
import { getOrder } from "@/lib/api/orders";
import { computeOrderTotals } from "@/lib/orders/order-totals";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocaleFromHeaders } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { getPaymentMethod } from "@/components/shop/payment-methods";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  await requireSession();
  const dict = await getServerDictionary();
  const locale = getLocaleFromHeaders();
  const t = createTranslator(dict);

  const order = await getOrder(params.orderId);
  if (!order) {
    notFound();
  }

  const totals = computeOrderTotals(order.items);
  const paymentMethod = getPaymentMethod(order.paymentMethodId);

  return (
    <div className="shop-page__inner">
      <h1 className="shop-page__title">
        {t("orders.orderNumber", { number: order.orderNumber })}
      </h1>

      <section className="account-section">
        <h2 className="account-section__title">{dict.orders.items}</h2>
        <ul className="shop-summary__items">
          {order.items.map((item) => (
            <li key={item.id} className="shop-summary__line">
              <span className="shop-summary__name">
                {item.title} <small>× {item.quantity}</small>
              </span>
              <span className="shop-summary__price">
                {item.lineTotal.toLocaleString(locale)} {order.currency}
              </span>
            </li>
          ))}
        </ul>
        <dl className="shop-summary__totals">
          <div>
            <dt>{dict.orders.subtotal}</dt>
            <dd>
              {totals.subtotal.toLocaleString(locale)} {order.currency}
            </dd>
          </div>
          <div>
            <dt>{dict.orders.shipping}</dt>
            <dd>
              {totals.shipping === 0
                ? dict.orders.free
                : `${totals.shipping.toLocaleString(locale)} ${order.currency}`}
            </dd>
          </div>
          <div>
            <dt>{dict.orders.tax}</dt>
            <dd>
              {totals.tax.toLocaleString(locale)} {order.currency}
            </dd>
          </div>
          <div className="shop-summary__grand">
            <dt>{dict.orders.total}</dt>
            <dd>
              {totals.total.toLocaleString(locale)} {order.currency}
            </dd>
          </div>
        </dl>
      </section>

      <section className="account-section">
        <h2 className="account-section__title">{dict.orders.delivery}</h2>
        <dl className="shop-meta">
          <div>
            <dt>{dict.orders.status}</dt>
            <dd>{t(`orders.statuses.${order.status.toLowerCase()}`)}</dd>
          </div>
          <div>
            <dt>{dict.orders.shipTo}</dt>
            <dd>
              {order.shippingAddress.fullName} · {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.region ? `${order.shippingAddress.region}, ` : ""}
              {order.shippingAddress.country}
            </dd>
          </div>
          <div>
            <dt>{dict.orders.email}</dt>
            <dd>{order.shippingAddress.email}</dd>
          </div>
          <div>
            <dt>{dict.orders.payment}</dt>
            <dd>{paymentMethod ? t(paymentMethod.labelKey) : order.paymentMethodId}</dd>
          </div>
          <div>
            <dt>{t("checkout.placed")}</dt>
            <dd>
              {new Date(order.createdAt).toLocaleString(locale)}
            </dd>
          </div>
        </dl>
      </section>

      <Link href="/account/orders" className="account-back-link">
        {dict.orders.backToOrders}
      </Link>
    </div>
  );
}
