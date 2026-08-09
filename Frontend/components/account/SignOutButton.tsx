"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { endSession } from "@/lib/auth/client";
import { useI18n } from "@/lib/i18n/locale-provider";

export function SignOutButton() {
  const { t } = useI18n();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await endSession();
      router.push("/");
      router.refresh();
    } catch {
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <button
      type="button"
      className="account-nav__link"
      disabled={signingOut}
      onClick={() => void handleSignOut()}
    >
      {signingOut ? t("common.loading") : t("account.signOut")}
    </button>
  );
}
