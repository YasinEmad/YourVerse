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
    <div className="flex flex-col gap-8">
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={index > activeIndex}
                onClick={() => onSelectStep(index)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-world border bg-transparent px-3 py-2 text-sm text-world-text-muted enabled:hover:border-world-primary enabled:hover:text-world-text disabled:cursor-not-allowed disabled:opacity-50${
                  isActive
                    ? " border-world-primary text-world-text"
                    : isComplete
                      ? " border-[color:color-mix(in_srgb,var(--world-primary)_45%,transparent)] text-world-text"
                      : " border-world-border"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold${
                    isActive ? " bg-world-primary text-world-bg" : " bg-world-border text-world-text"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </span>
                <span>{t(step.labelKey)}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div>
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
