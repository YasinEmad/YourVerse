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

// TODO(follow-up, Phase 2 simplification): the backend is COD-only — every
// order is created status PENDING with no payment step and no paymentMethodId.
// The payment step below should be dropped (or rendered as a COD-only note)
// once PaymentMethodSelect/payment-methods.tsx are simplified.

export const checkoutSteps: CheckoutStepConfig[] = [
  { id: "shipping", labelKey: "checkout.steps.shipping", component: ShippingStep },
  { id: "payment", labelKey: "checkout.steps.payment", component: PaymentStep },
  { id: "review", labelKey: "checkout.steps.review", component: ReviewStep },
];

export function getCheckoutStep(id: string): CheckoutStepConfig | undefined {
  return checkoutSteps.find((step) => step.id === id);
}
