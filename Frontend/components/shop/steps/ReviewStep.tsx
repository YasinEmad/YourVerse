"use client";

import Link from "next/link";
import { useState } from "react";
import type { CheckoutStepProps } from "../checkout-steps";
import { useCart } from "@/hooks/useCart";
import { OrderSummary } from "../OrderSummary";
import { getPaymentMethod } from "../payment-methods";

export function ReviewStep({ value, onSubmit, isSubmitting }: CheckoutStepProps) {
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
      nextErrors.cart = "Your cart is empty.";
    }
    if (!value.email?.trim()) {
      nextErrors.email = "Required";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="shop-step">
        <h2 className="shop-step__title">Review your order</h2>
        <p className="shop-empty">Your cart is empty.</p>
        <Link href="/cart" className="world-button">
          Back to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="shop-step">
      <h2 className="shop-step__title">Review your order</h2>
      {errors.cart ? <p className="shop-error" role="alert">{errors.cart}</p> : null}
      <div className="shop-review">
        <OrderSummary items={cart.items} currency={cart.currency} />
        <dl className="shop-meta">
          <div>
            <dt>Ship to</dt>
            <dd>
              {shippingAddress.fullName} · {shippingAddress.line1}
              {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""}, {shippingAddress.city},{" "}
              {shippingAddress.region ? `${shippingAddress.region}, ` : ""}
              {shippingAddress.country} · {shippingAddress.email}
            </dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{method?.label ?? value.paymentMethodId ?? "—"}</dd>
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
        {isSubmitting ? "Placing order…" : "Place order"}
      </button>
    </div>
  );
}
