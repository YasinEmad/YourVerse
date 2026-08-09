"use client";

import Link from "next/link";
import { useState } from "react";
import type { CheckoutStepProps } from "../checkout-steps";
import { useCart } from "@/hooks/useCart";
import { OrderSummary } from "../OrderSummary";
import { useI18n } from "@/lib/i18n/locale-provider";

export function ReviewStep({ value, onSubmit, isSubmitting }: CheckoutStepProps) {
  const { t } = useI18n();
  const { cart } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      <div>
        <h2 className="font-heading m-0 mb-6 text-2xl text-world-text">
          {t("checkout.reviewTitle")}
        </h2>
        <p className="m-0 text-world-text-muted">{t("checkout.emptyCart")}</p>
        <Link
          href="/cart"
          className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {t("checkout.backToCart")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading m-0 mb-6 text-2xl text-world-text">{t("checkout.reviewTitle")}</h2>
      {errors.cart ? (
        <p className="mt-4 font-semibold text-world-accent" role="alert">
          {errors.cart}
        </p>
      ) : null}
      <div className="grid gap-6">
        <OrderSummary items={cart.items} currency={cart.currency} />
        <dl className="m-0 grid gap-3">
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {t("checkout.shipTo")}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {shippingAddress.fullName} · {shippingAddress.line1}
              {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""},{" "}
              {shippingAddress.city},{" "}
              {shippingAddress.region ? `${shippingAddress.region}, ` : ""}
              {shippingAddress.country} · {shippingAddress.email}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {t("checkout.payment")}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {t("payment.cod")} — {t("payment.codNote")}
            </dd>
          </div>
        </dl>
        {errors.email ? (
          <p className="mt-4 font-semibold text-world-accent" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>
      <button
        className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
      </button>
    </div>
  );
}
