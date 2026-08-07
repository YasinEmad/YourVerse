"use client";

import type { CheckoutStepConfig, CheckoutStepProps } from "./checkout-steps";
import { useI18n } from "@/lib/i18n/locale-provider";

export interface CheckoutStepsProps {
  steps: CheckoutStepConfig[];
  activeIndex: number;
  onSelectStep: (index: number) => void;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function CheckoutSteps({
  steps,
  activeIndex,
  onSelectStep,
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: CheckoutStepsProps) {
  const { t } = useI18n();
  const ActiveStep = steps[activeIndex].component;

  return (
    <div className="shop-steps">
      <ol className="shop-steps__list">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          return (
            <li
              key={step.id}
              className={`shop-steps__item${isActive ? " is-active" : ""}${
                isComplete ? " is-complete" : ""
              }`}
            >
              <button
                type="button"
                className="shop-steps__link"
                disabled={index > activeIndex}
                onClick={() => onSelectStep(index)}
              >
                <span className="shop-steps__number">{isComplete ? "✓" : index + 1}</span>
                <span>{t(step.labelKey)}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="shop-steps__panel">
        <ActiveStep
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
