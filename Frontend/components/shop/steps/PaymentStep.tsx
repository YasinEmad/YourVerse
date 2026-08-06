"use client";

import { useState } from "react";
import type { CheckoutStepProps } from "../checkout-steps";
import { PaymentMethodSelect } from "../PaymentMethodSelect";
import { getPaymentMethod, paymentMethods } from "../payment-methods";

export function PaymentStep({ value, onChange, onSubmit }: CheckoutStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedId = value.paymentMethodId ?? paymentMethods[0].id;
  const method = getPaymentMethod(selectedId) ?? paymentMethods[0];

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    for (const field of method.requiredFields) {
      if (!value[field]?.trim()) {
        nextErrors[field] = "Required";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <fieldset className="shop-step">
      <legend className="shop-step__title">Payment method</legend>
      <PaymentMethodSelect value={value} onChange={onChange} errors={errors} />
      <button className="world-button shop-step__submit" type="button" onClick={handleSubmit}>
        Continue
      </button>
    </fieldset>
  );
}
