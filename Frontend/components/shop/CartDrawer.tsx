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
    <div className="fixed inset-0 z-drawer flex justify-end">
      <button
        type="button"
        className="absolute inset-0 cursor-default border-none bg-black/55"
        aria-label={t("a11y.close")}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className="relative z-10 flex h-full w-[min(100%,26rem)] flex-col border-s border-world-border bg-world-bg shadow-[0_0_2rem_rgba(0,0,0,0.4)]"
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
      >
        <header className="flex items-center justify-between border-b border-world-border px-6 py-4">
          <h2 className="font-heading m-0 text-xl text-world-text">{t("cart.title")}</h2>
          <button
            type="button"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-world border-none bg-transparent text-xl text-world-text-muted transition-colors duration-150 hover:text-world-text"
            aria-label={t("a11y.close")}
            onClick={onClose}
          >
            ×
          </button>
        </header>

        {empty ? (
          <p className="px-6 py-8 text-world-text-muted">
            {status === "loading" ? t("cart.loading") : t("cart.empty")}
          </p>
        ) : (
          <ul className="m-0 flex flex-1 list-none flex-col gap-4 overflow-y-auto p-0 px-6 py-4">
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

        <footer className="flex flex-col gap-4 border-t border-world-border px-6 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-world-text-muted">{t("cart.subtotal")}</span>
            <strong className="font-mono text-world-text">
              {totals.subtotal.toLocaleString()} {cart.currency}
            </strong>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/cart"
              className="inline-flex cursor-pointer items-center justify-center rounded-world border border-world-border bg-transparent px-4 py-2 text-sm font-semibold text-world-text no-underline transition-[opacity,transform] duration-150 hover:-translate-y-px hover:border-world-primary hover:text-world-primary hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-45"
              onClick={onClose}
            >
              {t("cart.viewCart")}
            </Link>
            <Link
              href="/checkout"
              className="inline-flex cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg no-underline transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              onClick={onClose}
            >
              {t("cart.checkout")}
            </Link>
          </div>
        </footer>
      </aside>
    </div>
  );
}
