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
    <div className="mx-auto w-full max-w-[60rem] px-6 pt-12 pb-24">
      <h1 className="font-heading m-0 mb-8 text-4xl leading-tight text-world-text">
        {t("cart.title")}
      </h1>

      {status === "loading" && cart.items.length === 0 ? (
        <p className="text-world-text-muted">{t("cart.loading")}</p>
      ) : cart.items.length === 0 ? (
        <div className="flex flex-col items-start gap-6">
          <p className="m-0 text-world-text-muted">{t("cart.empty")}</p>
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {t("cart.browseWorlds")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] items-start gap-8 max-[48rem]:grid-cols-1">
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
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
          <div className="flex flex-col gap-6">
            <OrderSummary items={cart.items} currency={cart.currency} />
            <Link
              href="/checkout"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg no-underline transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t("cart.proceedToCheckout")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
