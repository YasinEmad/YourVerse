"use client";

import { useState } from "react";
import type { CheckoutStepProps } from "../checkout-steps";
import { PaymentMethodSelect } from "../PaymentMethodSelect";
import { getPaymentMethod, paymentMethods } from "../payment-methods";
import { useI18n } from "@/lib/i18n/locale-provider";

export function PaymentStep({ value, onChange, onSubmit }: CheckoutStepProps) {
  const { t } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedId = value.paymentMethodId ?? paymentMethods[0].id;
  const method = getPaymentMethod(selectedId) ?? paymentMethods[0];

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    for (const field of method.requiredFields) {
      if (!value[field]?.trim()) {
        nextErrors[field] = t("checkout.requiredField");
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <fieldset className="shop-step">
      <legend className="shop-step__title">{t("checkout.paymentTitle")}</legend>
      <PaymentMethodSelect value={value} onChange={onChange} errors={errors} />
      <button className="world-button shop-step__submit" type="button" onClick={handleSubmit}>
        {t("common.continue")}
      </button>
    </fieldset>
  );
}
