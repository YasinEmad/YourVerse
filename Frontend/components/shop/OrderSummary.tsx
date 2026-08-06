import type { CartItemDto } from "@/lib/api/types";
import { computeOrderTotals } from "@/lib/orders/order-totals";

export interface OrderSummaryProps {
  items: CartItemDto[];
  currency: string;
  title?: string;
}

export function OrderSummary({ items, currency, title = "Order summary" }: OrderSummaryProps) {
  const totals = computeOrderTotals(items);

  return (
    <aside className="shop-summary">
      <h2 className="shop-summary__title">{title}</h2>
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
        <p className="shop-note">Your cart is empty.</p>
      )}
      <dl className="shop-summary__totals">
        <div>
          <dt>Subtotal</dt>
          <dd>
            {totals.subtotal.toLocaleString()} {currency}
          </dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{totals.shipping === 0 ? "Free" : `${totals.shipping.toLocaleString()} ${currency}`}</dd>
        </div>
        <div>
          <dt>Tax</dt>
          <dd>
            {totals.tax.toLocaleString()} {currency}
          </dd>
        </div>
        <div className="shop-summary__grand">
          <dt>Total</dt>
          <dd>
            {totals.total.toLocaleString()} {currency}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
