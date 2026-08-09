"use client";

import { getPaymentMethod, paymentMethods } from "./payment-methods";
import type { PaymentFormProps } from "./payment-methods";
import { useI18n } from "@/lib/i18n/locale-provider";

// TODO(follow-up, Phase 2 simplification): the backend is COD-only. Until
// payment-methods.tsx collapses to COD only, this selector misleads users by
// offering payment options the backend cannot process. See payment-methods.tsx.

export function PaymentMethodSelect({ value, onChange, errors }: PaymentFormProps) {
  const { t } = useI18n();
  const selectedId = value.paymentMethodId ?? paymentMethods[0].id;
  const selected = getPaymentMethod(selectedId) ?? paymentMethods[0];

  const selectMethod = (id: string) => onChange({ ...value, paymentMethodId: id });
  const SelectedForm = selected.form;

  return (
    <div className="shop-payment">
      <div className="shop-payment__methods" role="radiogroup" aria-label={t("payment.methodLabel")}>
        {paymentMethods.map((method) => {
          const isSelected = method.id === selectedId;
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`shop-payment__method${isSelected ? " is-selected" : ""}`}
              onClick={() => selectMethod(method.id)}
            >
              <span className="shop-payment__icon" aria-hidden="true">
                {method.icon}
              </span>
              <span className="shop-payment__label">
                <strong>{t(method.labelKey)}</strong>
                {method.descriptionKey ? <small>{t(method.descriptionKey)}</small> : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className="shop-payment__form">
        <SelectedForm value={value} onChange={onChange} errors={errors} />
      </div>
    </div>
  );
}
