"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { computeOrderTotals } from "@/lib/orders/order-totals";
import { useI18n } from "@/lib/i18n/locale-provider";
import { CartLineItem } from "./CartLineItem";

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t } = useI18n();
  const { cart, status, updateItem, removeItem } = useCart();
  const totals = computeOrderTotals(cart.items);
  const empty = cart.items.length === 0;
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    previousFocus.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusable = panel?.querySelector<HTMLElement>(
      "button, [href], [tabindex]:not([tabindex='-1'])",
    );
    (focusable ?? panel)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) {
        return;
      }
      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])"),
      );
      if (focusableElements.length === 0) {
        return;
      }
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus.current?.focus?.();
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
        aria-label={t("a11y.close")}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className="shop-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
      >
        <header className="shop-drawer__head">
          <h2 className="shop-drawer__title">{t("cart.title")}</h2>
          <button
            type="button"
            className="shop-drawer__close"
            aria-label={t("a11y.close")}
            onClick={onClose}
          >
            ×
          </button>
        </header>

        {empty ? (
          <p className="shop-drawer__empty">
            {status === "loading" ? t("cart.loading") : t("cart.empty")}
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
            <span>{t("cart.subtotal")}</span>
            <strong>
              {totals.subtotal.toLocaleString()} {cart.currency}
            </strong>
          </div>
          <div className="shop-drawer__actions">
            <Link href="/cart" className="world-button world-button--ghost" onClick={onClose}>
              {t("cart.viewCart")}
            </Link>
            <Link href="/checkout" className="world-button" onClick={onClose}>
              {t("cart.checkout")}
            </Link>
          </div>
        </footer>
      </aside>
    </div>
  );
}
