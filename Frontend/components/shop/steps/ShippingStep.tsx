"use client";

import { useState } from "react";
import type { CheckoutStepProps } from "../checkout-steps";
import { FormField } from "../FormField";

const REQUIRED_FIELDS = ["fullName", "email", "line1", "city", "country"] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ShippingStep({ value, onChange, onSubmit }: CheckoutStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: string, next: string) => onChange({ ...value, [key]: next });

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    for (const key of REQUIRED_FIELDS) {
      if (!value[key]?.trim()) {
        nextErrors[key] = "Required";
      }
    }
    if (value.email && !EMAIL_PATTERN.test(value.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <fieldset className="shop-step">
      <legend className="shop-step__title">Shipping details</legend>
      <div className="shop-grid">
        <FormField
          label="Full name"
          name="fullName"
          value={value.fullName ?? ""}
          error={errors.fullName}
          onChange={(next) => setField("fullName", next)}
          autoComplete="name"
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={value.email ?? ""}
          error={errors.email}
          onChange={(next) => setField("email", next)}
          autoComplete="email"
        />
        <FormField
          label="Phone (optional)"
          name="phone"
          type="tel"
          value={value.phone ?? ""}
          onChange={(next) => setField("phone", next)}
          autoComplete="tel"
        />
        <FormField
          label="Address line 1"
          name="line1"
          value={value.line1 ?? ""}
          error={errors.line1}
          onChange={(next) => setField("line1", next)}
          autoComplete="address-line1"
        />
        <FormField
          label="Address line 2 (optional)"
          name="line2"
          value={value.line2 ?? ""}
          onChange={(next) => setField("line2", next)}
          autoComplete="address-line2"
        />
        <FormField
          label="City"
          name="city"
          value={value.city ?? ""}
          error={errors.city}
          onChange={(next) => setField("city", next)}
          autoComplete="address-level2"
        />
        <FormField
          label="Region (optional)"
          name="region"
          value={value.region ?? ""}
          onChange={(next) => setField("region", next)}
          autoComplete="address-level1"
        />
        <FormField
          label="Postal code (optional)"
          name="postalCode"
          value={value.postalCode ?? ""}
          onChange={(next) => setField("postalCode", next)}
          autoComplete="postal-code"
        />
        <FormField
          label="Country"
          name="country"
          value={value.country ?? ""}
          error={errors.country}
          onChange={(next) => setField("country", next)}
          autoComplete="country"
        />
      </div>
      <button className="world-button shop-step__submit" type="button" onClick={handleSubmit}>
        Continue
      </button>
    </fieldset>
  );
}
