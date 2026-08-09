"use client";

import type { ComponentType } from "react";
import { ShippingStep } from "./steps/ShippingStep";
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

// Phase 2 simplification: no payment step. The backend is COD-only — every
// order is created status PENDING with no payment method choice, so the only
// steps are shipping and review. The review step surfaces the COD notice.
export const checkoutSteps: CheckoutStepConfig[] = [
  { id: "shipping", labelKey: "checkout.steps.shipping", component: ShippingStep },
  { id: "review", labelKey: "checkout.steps.review", component: ReviewStep },
];

export function getCheckoutStep(id: string): CheckoutStepConfig | undefined {
  return checkoutSteps.find((step) => step.id === id);
}
