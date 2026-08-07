"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/lib/api/orders";
import type { AddressDto, CreateOrderRequestDto } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/locale-provider";
import { checkoutSteps } from "./checkout-steps";
import { CheckoutSteps } from "./CheckoutSteps";

export function CheckoutForm() {
  const { t } = useI18n();
  const router = useRouter();
  const { cart, status, refresh } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [value, setValue] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLastStep = activeIndex === checkoutSteps.length - 1;

  const handleSubmit = async () => {
    if (cart.items.length === 0) {
      setError(t("checkout.emptyCart"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const shippingAddress: AddressDto = {
        fullName: value.fullName ?? "",
        email: value.email ?? "",
        phone: value.phone,
        line1: value.line1 ?? "",
        line2: value.line2,
        city: value.city ?? "",
        region: value.region,
        postalCode: value.postalCode,
        country: value.country ?? "",
      };
      const payload: CreateOrderRequestDto = {
        cartId: cart.id,
        shippingAddress,
        paymentMethodId: value.paymentMethodId ?? "",
      };
      const order = await createOrder(payload);
      await refresh();
      router.push(`/checkout/confirmation/${order.id}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : t("common.unexpectedError"),
      );
      setSubmitting(false);
    }
  };

  const handleStepSubmit = () => {
    if (isLastStep) {
      void handleSubmit();
    } else {
      setActiveIndex((index) => index + 1);
    }
  };

  if (status === "idle" || status === "loading") {
    return <p className="shop-loading">{t("checkout.loading")}</p>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="shop-page__inner">
        <h1 className="shop-page__title">{t("checkout.title")}</h1>
        <p className="shop-empty">{t("checkout.emptyCart")}</p>
        <Link href="/cart" className="world-button">
          {t("checkout.backToCart")}
        </Link>
      </div>
    );
  }

  return (
    <div className="shop-page__inner">
      <h1 className="shop-page__title">{t("checkout.title")}</h1>
      <CheckoutSteps
        steps={checkoutSteps}
        activeIndex={activeIndex}
        onSelectStep={(index) => {
          if (index < activeIndex) {
            setActiveIndex(index);
          }
        }}
        value={value}
        onChange={setValue}
        onSubmit={handleStepSubmit}
        isSubmitting={submitting}
      />
      {error ? (
        <p className="shop-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
