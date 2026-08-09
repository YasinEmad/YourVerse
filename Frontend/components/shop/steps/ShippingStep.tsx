"use client";

import { useState } from "react";
import type { CheckoutStepProps } from "../checkout-steps";
import { FormField } from "../FormField";
import { useI18n } from "@/lib/i18n/locale-provider";

const REQUIRED_FIELDS = ["fullName", "email", "line1", "city", "country"] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ShippingStep({ value, onChange, onSubmit }: CheckoutStepProps) {
  const { t } = useI18n();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: string, next: string) => onChange({ ...value, [key]: next });

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    for (const key of REQUIRED_FIELDS) {
      if (!value[key]?.trim()) {
        nextErrors[key] = t("checkout.requiredField");
      }
    }
    if (value.email && !EMAIL_PATTERN.test(value.email)) {
      nextErrors.email = t("checkout.invalidEmail");
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <fieldset className="m-0 border-none p-0">
      <legend className="font-heading m-0 mb-6 text-2xl text-world-text">
        {t("checkout.shippingTitle")}
      </legend>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4">
        <FormField
          label={t("checkout.shippingFields.fullName")}
          name="fullName"
          value={value.fullName ?? ""}
          error={errors.fullName}
          onChange={(next) => setField("fullName", next)}
          autoComplete="name"
        />
        <FormField
          label={t("checkout.shippingFields.email")}
          name="email"
          type="email"
          value={value.email ?? ""}
          error={errors.email}
          onChange={(next) => setField("email", next)}
          autoComplete="email"
        />
        <FormField
          label={t("checkout.shippingFields.phoneOptional")}
          name="phone"
          type="tel"
          value={value.phone ?? ""}
          onChange={(next) => setField("phone", next)}
          autoComplete="tel"
        />
        <FormField
          label={t("checkout.shippingFields.line1")}
          name="line1"
          value={value.line1 ?? ""}
          error={errors.line1}
          onChange={(next) => setField("line1", next)}
          autoComplete="address-line1"
        />
        <FormField
          label={t("checkout.shippingFields.line2Optional")}
          name="line2"
          value={value.line2 ?? ""}
          onChange={(next) => setField("line2", next)}
          autoComplete="address-line2"
        />
        <FormField
          label={t("checkout.shippingFields.city")}
          name="city"
          value={value.city ?? ""}
          error={errors.city}
          onChange={(next) => setField("city", next)}
          autoComplete="address-level2"
        />
        <FormField
          label={t("checkout.shippingFields.regionOptional")}
          name="region"
          value={value.region ?? ""}
          onChange={(next) => setField("region", next)}
          autoComplete="address-level1"
        />
        <FormField
          label={t("checkout.shippingFields.postalCodeOptional")}
          name="postalCode"
          value={value.postalCode ?? ""}
          onChange={(next) => setField("postalCode", next)}
          autoComplete="postal-code"
        />
        <FormField
          label={t("checkout.shippingFields.country")}
          name="country"
          value={value.country ?? ""}
          error={errors.country}
          onChange={(next) => setField("country", next)}
          autoComplete="country"
        />
      </div>
      <button
        className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
        type="button"
        onClick={handleSubmit}
      >
        {t("common.continue")}
      </button>
    </fieldset>
  );
}
