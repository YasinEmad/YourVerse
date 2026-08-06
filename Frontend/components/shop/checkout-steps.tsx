"use client";

import type { ComponentType } from "react";
import { ShippingStep } from "./steps/ShippingStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ReviewStep } from "./steps/ReviewStep";

export interface CheckoutStepProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export interface CheckoutStepConfig {
  id: string;
  label: string;
  component: ComponentType<CheckoutStepProps>;
}

export const checkoutSteps: CheckoutStepConfig[] = [
  { id: "shipping", label: "Shipping", component: ShippingStep },
  { id: "payment", label: "Payment", component: PaymentStep },
  { id: "review", label: "Review", component: ReviewStep },
];

export function getCheckoutStep(id: string): CheckoutStepConfig | undefined {
  return checkoutSteps.find((step) => step.id === id);
}
