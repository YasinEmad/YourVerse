"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authErrorMessage, loginWithEmail } from "@/lib/auth/client";
import { useI18n } from "@/lib/i18n/locale-provider";
import { FormField } from "@/components/shop/FormField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!value.email?.trim()) {
      nextErrors.email = t("auth.requiredField");
    } else if (!EMAIL_PATTERN.test(value.email)) {
      nextErrors.email = t("auth.invalidEmail");
    }
    if (!value.password) {
      nextErrors.password = t("auth.requiredField");
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await loginWithEmail(value.email.trim(), value.password);
      router.push("/account");
    } catch (caught) {
      setError(authErrorMessage(caught, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-card__title">{t("auth.loginTitle")}</h1>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        noValidate
      >
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
          autoComplete="current-password"
        />
        {error ? (
          <p className="shop-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="world-button auth-form__submit" type="submit" disabled={submitting}>
          {submitting ? t("common.loading") : t("auth.login")}
        </button>
      </form>
      <p className="auth-link-row">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="auth-link">
          {t("auth.createOne")}
        </Link>
      </p>
      <Link href="/" className="auth-link">
        {t("auth.backToStore")}
      </Link>
    </div>
  );
}
