"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/lib/i18n/locale-provider";
import { CartLineItem } from "@/components/shop/CartLineItem";
import { OrderSummary } from "@/components/shop/OrderSummary";

export default function CartPage() {
  const { cart, status, updateItem, removeItem } = useCart();
  const { t } = useI18n();

  return (
    <div className="shop-page__inner">
      <h1 className="shop-page__title">{t("cart.title")}</h1>

      {status === "loading" && cart.items.length === 0 ? (
        <p className="shop-loading">{t("cart.loading")}</p>
      ) : cart.items.length === 0 ? (
        <div className="shop-empty-block">
          <p className="shop-empty">{t("cart.empty")}</p>
          <Link href="/" className="world-button">
            {t("cart.browseWorlds")}
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
              {t("cart.proceedToCheckout")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
