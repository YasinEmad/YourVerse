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
      className="inline-flex cursor-pointer items-center gap-2 rounded-world border border-world-border bg-transparent px-3 py-2 text-sm text-world-text-muted transition-colors duration-150 enabled:hover:border-world-primary enabled:hover:text-world-text disabled:cursor-not-allowed disabled:opacity-50"
      disabled={signingOut}
      onClick={() => void handleSignOut()}
    >
      {signingOut ? t("common.loading") : t("account.signOut")}
    </button>
  );
}
