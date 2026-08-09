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
    <div className="grid w-full max-w-[26rem] gap-6 rounded-world border border-world-border bg-world-surface p-8">
      <h1 className="font-heading m-0 text-3xl leading-tight text-world-text">
        {t("auth.loginTitle")}
      </h1>
      <form
        className="grid gap-4"
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
          <p className="mt-4 font-semibold text-world-accent" role="alert">
            {error}
          </p>
        ) : null}
        <button
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-world border border-world-primary bg-world-primary px-4 py-2 text-sm font-semibold text-world-bg transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
          type="submit"
          disabled={submitting}
        >
          {submitting ? t("common.loading") : t("auth.login")}
        </button>
      </form>
      <p className="m-0 text-sm text-world-text-muted">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="text-world-text underline underline-offset-[3px] transition-colors duration-150 hover:text-world-primary">
          {t("auth.createOne")}
        </Link>
      </p>
      <Link
        href="/"
        className="text-world-text underline underline-offset-[3px] transition-colors duration-150 hover:text-world-primary"
      >
        {t("auth.backToStore")}
      </Link>
    </div>
  );
}
