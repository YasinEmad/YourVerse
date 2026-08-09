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
    <div className="mx-auto w-full max-w-[60rem] px-6 pt-12 pb-24">
      <h1 className="font-heading m-0 mb-8 text-4xl leading-tight text-world-text">
        {dict.orders.title}
      </h1>
      <OrderHistoryList orders={items} t={t} locale={locale} />
      <Link
        href="/account"
        className="mt-8 inline-flex items-center gap-2 rounded-world border border-world-border bg-transparent px-3 py-2 text-sm text-world-text-muted no-underline transition-colors duration-150 hover:border-world-primary hover:text-world-text"
      >
        {dict.orders.backToAccount}
      </Link>
    </div>
  );
}
