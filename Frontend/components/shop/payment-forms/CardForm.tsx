import type { PaymentFormProps } from "../payment-methods";
import { FormField } from "../FormField";

export function CardForm({ value, onChange, errors }: PaymentFormProps) {
  const setField = (key: string, next: string) => onChange({ ...value, [key]: next });

  return (
    <div className="shop-grid">
      <FormField
        label="Card number"
        name="card.number"
        value={value["card.number"] ?? ""}
        error={errors?.["card.number"]}
        onChange={(next) => setField("card.number", next)}
        autoComplete="cc-number"
        placeholder="4242 4242 4242 4242"
      />
      <FormField
        label="Expiry"
        name="card.expiry"
        value={value["card.expiry"] ?? ""}
        error={errors?.["card.expiry"]}
        onChange={(next) => setField("card.expiry", next)}
        autoComplete="cc-exp"
        placeholder="MM/YY"
      />
      <FormField
        label="CVC"
        name="card.cvc"
        value={value["card.cvc"] ?? ""}
        error={errors?.["card.cvc"]}
        onChange={(next) => setField("card.cvc", next)}
        autoComplete="cc-csc"
        placeholder="123"
      />
    </div>
  );
}
