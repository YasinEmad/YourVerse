import type { ComponentType, ReactNode } from "react";
import { CardForm } from "./payment-forms/CardForm";
import { WalletForm } from "./payment-forms/WalletForm";
import { CodForm } from "./payment-forms/CodForm";

export interface PaymentFormProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  errors?: Record<string, string>;
}

export interface PaymentMethodDescriptor {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  requiredFields: string[];
  icon: ReactNode;
  form: ComponentType<PaymentFormProps>;
}

export const paymentMethods: PaymentMethodDescriptor[] = [
  {
    id: "card",
    labelKey: "payment.card",
    descriptionKey: "payment.cardDescription",
    requiredFields: ["card.number", "card.expiry", "card.cvc"],
    icon: <CardGlyph />,
    form: CardForm,
  },
  {
    id: "wallet",
    labelKey: "payment.wallet",
    descriptionKey: "payment.walletDescription",
    requiredFields: ["wallet.email"],
    icon: <WalletGlyph />,
    form: WalletForm,
  },
  {
    id: "cod",
    labelKey: "payment.cod",
    descriptionKey: "payment.codDescription",
    requiredFields: [],
    icon: <CashGlyph />,
    form: CodForm,
  },
];

export const KNOWN_PAYMENT_METHOD_IDS = paymentMethods.map((method) => method.id);

export function getPaymentMethod(id: string): PaymentMethodDescriptor | undefined {
  return paymentMethods.find((method) => method.id === id);
}

function CardGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="15" x2="10" y2="15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function WalletGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CashGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
