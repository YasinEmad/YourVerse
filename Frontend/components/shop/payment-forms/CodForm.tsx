"use client";

import type { PaymentFormProps } from "../payment-methods";
import { useI18n } from "@/lib/i18n/locale-provider";

export function CodForm(_props: PaymentFormProps) {
  const { t } = useI18n();
  return <p className="shop-note">{t("payment.codNote")}</p>;
}
