import type { PaymentFormProps } from "../payment-methods";
import { FormField } from "../FormField";

export function WalletForm({ value, onChange, errors }: PaymentFormProps) {
  return (
    <div className="shop-grid">
      <FormField
        label="Wallet email"
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
