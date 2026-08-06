"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { CartLineItem } from "@/components/shop/CartLineItem";
import { OrderSummary } from "@/components/shop/OrderSummary";

export default function CartPage() {
  const { cart, status, updateItem, removeItem } = useCart();

  return (
    <div className="shop-page__inner">
      <h1 className="shop-page__title">Your cart</h1>

      {status === "loading" && cart.items.length === 0 ? (
        <p className="shop-loading">Loading your cart…</p>
      ) : cart.items.length === 0 ? (
        <div className="shop-empty-block">
          <p className="shop-empty">Your cart is empty.</p>
          <Link href="/" className="world-button">
            Browse worlds
          </Link>
        </div>
      ) : (
        <div className="shop-cart">
          <ul className="shop-cart__items">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                currency={cart.currency}
                onUpdateQuantity={(quantity) => void updateItem(item.id, quantity)}
                onRemove={() => void removeItem(item.id)}
              />
            ))}
          </ul>
          <div className="shop-cart__summary">
            <OrderSummary items={cart.items} currency={cart.currency} />
            <Link href="/checkout" className="world-button shop-cart__checkout">
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
