import Link from "next/link";
import { requireSession } from "@/lib/auth/getSession";
import { getOrders } from "@/lib/api/orders";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocaleFromHeaders } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { OrderHistoryList } from "@/components/account/OrderHistoryList";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await requireSession();
  const dict = await getServerDictionary();
  const locale = getLocaleFromHeaders();
  const t = createTranslator(dict);

  const { items } = await getOrders();

  return (
    <div className="shop-page__inner">
      <h1 className="shop-page__title">{dict.orders.title}</h1>
      <OrderHistoryList orders={items} t={t} locale={locale} />
      <Link href="/account" className="account-back-link">
        {dict.orders.backToAccount}
      </Link>
    </div>
  );
}
