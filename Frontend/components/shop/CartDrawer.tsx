"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { computeOrderTotals } from "@/lib/orders/order-totals";
import { CartLineItem } from "./CartLineItem";

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, status, updateItem, removeItem } = useCart();
  const totals = computeOrderTotals(cart.items);
  const empty = cart.items.length === 0;

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="shop-drawer">
      <button
        type="button"
        className="shop-drawer__overlay"
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside
        className="shop-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        <header className="shop-drawer__head">
          <h2 className="shop-drawer__title">Your cart</h2>
          <button type="button" className="shop-drawer__close" aria-label="Close cart" onClick={onClose}>
            ×
          </button>
        </header>

        {empty ? (
          <p className="shop-drawer__empty">
            {status === "loading" ? "Loading your cart…" : "Your cart is empty."}
          </p>
        ) : (
          <ul className="shop-drawer__items">
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
        )}

        <footer className="shop-drawer__foot">
          <div className="shop-drawer__subtotal">
            <span>Subtotal</span>
            <strong>
              {totals.subtotal.toLocaleString()} {cart.currency}
            </strong>
          </div>
          <div className="shop-drawer__actions">
            <Link href="/cart" className="world-button world-button--ghost" onClick={onClose}>
              View cart
            </Link>
            <Link href="/checkout" className="world-button" onClick={onClose}>
              Checkout
            </Link>
          </div>
        </footer>
      </aside>
    </div>
  );
}
