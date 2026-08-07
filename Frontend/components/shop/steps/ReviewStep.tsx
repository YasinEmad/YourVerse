"use client";

import Link from "next/link";
import { useState } from "react";
import type { CheckoutStepProps } from "../checkout-steps";
import { useCart } from "@/hooks/useCart";
import { OrderSummary } from "../OrderSummary";
import { getPaymentMethod } from "../payment-methods";
import { useI18n } from "@/lib/i18n/locale-provider";

export function ReviewStep({ value, onSubmit, isSubmitting }: CheckoutStepProps) {
  const { t } = useI18n();
  const { cart } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const method = getPaymentMethod(value.paymentMethodId ?? "");

  const shippingAddress = {
    fullName: value.fullName ?? "",
    email: value.email ?? "",
    phone: value.phone ?? "",
    line1: value.line1 ?? "",
    line2: value.line2 ?? "",
    city: value.city ?? "",
    region: value.region ?? "",
    postalCode: value.postalCode ?? "",
    country: value.country ?? "",
  };

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (cart.items.length === 0) {
      nextErrors.cart = t("checkout.emptyCart");
    }
    if (!value.email?.trim()) {
      nextErrors.email = t("checkout.requiredField");
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="shop-step">
        <h2 className="shop-step__title">{t("checkout.reviewTitle")}</h2>
        <p className="shop-empty">{t("checkout.emptyCart")}</p>
        <Link href="/cart" className="world-button">
          {t("checkout.backToCart")}
        </Link>
      </div>
    );
  }

  return (
    <div className="shop-step">
      <h2 className="shop-step__title">{t("checkout.reviewTitle")}</h2>
      {errors.cart ? <p className="shop-error" role="alert">{errors.cart}</p> : null}
      <div className="shop-review">
        <OrderSummary items={cart.items} currency={cart.currency} />
        <dl className="shop-meta">
          <div>
            <dt>{t("checkout.shipTo")}</dt>
            <dd>
              {shippingAddress.fullName} · {shippingAddress.line1}
              {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""}, {shippingAddress.city},{" "}
              {shippingAddress.region ? `${shippingAddress.region}, ` : ""}
              {shippingAddress.country} · {shippingAddress.email}
            </dd>
          </div>
          <div>
            <dt>{t("checkout.payment")}</dt>
            <dd>{method ? t(method.labelKey) : value.paymentMethodId ?? "—"}</dd>
          </div>
        </dl>
        {errors.email ? <p className="shop-error" role="alert">{errors.email}</p> : null}
      </div>
      <button
        className="world-button shop-step__submit"
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
      </button>
    </div>
  );
}
