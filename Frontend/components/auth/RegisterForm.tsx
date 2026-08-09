"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authErrorMessage, registerWithEmail } from "@/lib/auth/client";
import { useI18n } from "@/lib/i18n/locale-provider";
import { FormField } from "@/components/shop/FormField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function RegisterForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!value.name?.trim()) {
      nextErrors.name = t("auth.nameRequired");
    }
    if (!value.email?.trim()) {
      nextErrors.email = t("auth.requiredField");
    } else if (!EMAIL_PATTERN.test(value.email)) {
      nextErrors.email = t("auth.invalidEmail");
    }
    if (!value.password) {
      nextErrors.password = t("auth.requiredField");
    } else if (value.password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = t("auth.passwordMin");
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await registerWithEmail(value.name.trim(), value.email.trim(), value.password);
      router.push("/account");
    } catch (caught) {
      setError(authErrorMessage(caught, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">{t("auth.registerTitle")}</h1>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
        <FormField
          label={t("auth.name")}
          name="name"
          value={value.name ?? ""}
          error={errors.name}
          onChange={(next) => setValue((current) => ({ ...current, name: next }))}
          autoComplete="name"
        />
        <FormField
          label={t("auth.email")}
          name="email"
          type="email"
          value={value.email ?? ""}
          error={errors.email}
          onChange={(next) => setValue((current) => ({ ...current, email: next }))}
          autoComplete="email"
        />
        <FormField
          label={t("auth.password")}
          name="password"
          type="password"
          value={value.password ?? ""}
          error={errors.password}
          onChange={(next) => setValue((current) => ({ ...current, password: next }))}
          autoComplete="new-password"
        />
        {error ? (
          <p className="shop-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="world-button auth-form__submit" type="submit" disabled={submitting}>
          {submitting ? t("common.loading") : t("auth.register")}
        </button>
      </form>
      <p className="auth-link-row">
        {t("auth.haveAccount")}{" "}
        <Link href="/login" className="auth-link">
          {t("auth.signInInstead")}
        </Link>
      </p>
      <Link href="/" className="auth-link">
        {t("auth.backToStore")}
      </Link>
    </div>
  );
}
