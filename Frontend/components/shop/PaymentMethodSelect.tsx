"use client";

import { getPaymentMethod, paymentMethods } from "./payment-methods";
import type { PaymentFormProps } from "./payment-methods";

export function PaymentMethodSelect({ value, onChange, errors }: PaymentFormProps) {
  const selectedId = value.paymentMethodId ?? paymentMethods[0].id;
  const selected = getPaymentMethod(selectedId) ?? paymentMethods[0];

  const selectMethod = (id: string) => onChange({ ...value, paymentMethodId: id });
  const SelectedForm = selected.form;

  return (
    <div className="shop-payment">
      <div className="shop-payment__methods" role="radiogroup" aria-label="Payment method">
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
                <strong>{method.label}</strong>
                {method.description ? <small>{method.description}</small> : null}
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
