import Link from "next/link";
import type { OrderDto } from "@/lib/api/types";
import type { OrderTotals } from "@/lib/orders/order-totals";
import { getPaymentMethod } from "./payment-methods";

export interface OrderConfirmationProps {
  order: OrderDto;
  totals: OrderTotals;
}

export function OrderConfirmation({ order, totals }: OrderConfirmationProps) {
  const paymentMethod = getPaymentMethod(order.paymentMethodId);

  return (
    <div className="shop-confirmation">
      <header className="shop-confirmation__head">
        <h1 className="shop-confirmation__title">Order confirmed</h1>
        <p className="shop-confirmation__order">Order {order.orderNumber}</p>
        <p className="shop-confirmation__status">{order.status}</p>
      </header>

      <section className="shop-confirmation__section">
        <h2 className="shop-confirmation__heading">Items</h2>
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
        <h2 className="shop-confirmation__heading">Totals</h2>
        <dl className="shop-summary__totals">
          <div>
            <dt>Subtotal</dt>
            <dd>
              {totals.subtotal.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>
              {totals.shipping === 0 ? "Free" : `${totals.shipping.toLocaleString()} ${order.currency}`}
            </dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd>
              {totals.tax.toLocaleString()} {order.currency}
            </dd>
          </div>
          <div className="shop-summary__grand">
            <dt>Total</dt>
            <dd>
              {totals.total.toLocaleString()} {order.currency}
            </dd>
          </div>
        </dl>
      </section>

      <section className="shop-confirmation__section">
        <h2 className="shop-confirmation__heading">Delivery</h2>
        <dl className="shop-meta">
          <div>
            <dt>Ship to</dt>
            <dd>
              {order.shippingAddress.fullName} · {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.region ? `${order.shippingAddress.region}, ` : ""}
              {order.shippingAddress.country}
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{order.shippingAddress.email}</dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{paymentMethod?.label ?? order.paymentMethodId}</dd>
          </div>
          <div>
            <dt>Placed</dt>
            <dd>{new Date(order.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </section>

      <Link href="/" className="world-button">
        Continue shopping
      </Link>
    </div>
  );
}
