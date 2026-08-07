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
  labelKey: string;
  component: ComponentType<CheckoutStepProps>;
}

export const checkoutSteps: CheckoutStepConfig[] = [
  { id: "shipping", labelKey: "checkout.steps.shipping", component: ShippingStep },
  { id: "payment", labelKey: "checkout.steps.payment", component: PaymentStep },
  { id: "review", labelKey: "checkout.steps.review", component: ReviewStep },
];

export function getCheckoutStep(id: string): CheckoutStepConfig | undefined {
  return checkoutSteps.find((step) => step.id === id);
}
