"use client";

import type { PaymentFormProps } from "../payment-methods";
import { FormField } from "../FormField";
import { useI18n } from "@/lib/i18n/locale-provider";

export function WalletForm({ value, onChange, errors }: PaymentFormProps) {
  const { t } = useI18n();

  return (
    <div className="shop-grid">
      <FormField
        label={t("payment.walletEmail")}
        name="wallet.email"
        type="email"
        value={value["wallet.email"] ?? ""}
        error={errors?.["wallet.email"]}
        onChange={(next) => onChange({ ...value, "wallet.email": next })}
        autoComplete="email"
      />
    </div>
  );
}
