import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/getSession";
import { getOrder } from "@/lib/api/orders";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocaleFromHeaders } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  await requireSession();
  const dict = await getServerDictionary();
  const locale = getLocaleFromHeaders();
  const t = createTranslator(dict);

  const order = await getOrder(params.orderId);
  if (!order) {
    notFound();
  }

  // Totals render the backend's authoritative OrderDto values
  // (backend-architecture.md §12), never a client-side recomputation.

  return (
    <div className="mx-auto w-full max-w-[60rem] px-6 pt-12 pb-24">
      <h1 className="font-heading m-0 mb-8 text-4xl leading-tight text-world-text">
        {t("orders.orderNumber", { number: order.orderNumber })}
      </h1>

      <section className="mt-10 grid gap-4">
        <h2 className="font-heading m-0 text-lg text-world-text">{dict.orders.items}</h2>
        <ul className="m-0 flex list-none flex-col gap-3 border-b border-world-border p-0 pb-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-world-text">
                {item.title} <small className="text-world-text-muted">× {item.quantity}</small>
              </span>
              <span className="font-mono text-sm text-world-text">
                {item.lineTotal.toLocaleString(locale)} {order.currency}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-world-text-muted">{dict.orders.subtotal}</dt>
            <dd className="m-0 font-mono text-sm text-world-text">
              {order.subtotal.toLocaleString(locale)} {order.currency}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-world-text-muted">{dict.orders.shipping}</dt>
            <dd className="m-0 font-mono text-sm text-world-text">
              {order.shipping === 0
                ? dict.orders.free
                : `${order.shipping.toLocaleString(locale)} ${order.currency}`}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-world-text-muted">{dict.orders.tax}</dt>
            <dd className="m-0 font-mono text-sm text-world-text">
              {order.tax.toLocaleString(locale)} {order.currency}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-world-border pt-3">
            <dt className="text-base font-bold text-world-text-muted">{dict.orders.total}</dt>
            <dd className="m-0 font-mono text-base font-bold text-world-text">
              {order.total.toLocaleString(locale)} {order.currency}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 grid gap-4">
        <h2 className="font-heading m-0 text-lg text-world-text">{dict.orders.delivery}</h2>
        <dl className="m-0 grid gap-3">
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {dict.orders.status}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {t(`orders.statuses.${order.status.toLowerCase()}`)}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {dict.orders.shipTo}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {order.shippingAddress.fullName} · {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.region ? `${order.shippingAddress.region}, ` : ""}
              {order.shippingAddress.country}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {dict.orders.email}
            </dt>
            <dd className="m-0 text-sm text-world-text">{order.shippingAddress.email}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {dict.orders.payment}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {t("payment.cod")} — {t("payment.codNote")}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs uppercase tracking-[0.08em] text-world-text-muted">
              {t("checkout.placed")}
            </dt>
            <dd className="m-0 text-sm text-world-text">
              {new Date(order.createdAt).toLocaleString(locale)}
            </dd>
          </div>
        </dl>
      </section>

      <Link
        href="/account/orders"
        className="mt-8 inline-flex items-center gap-2 rounded-world border border-world-border bg-transparent px-3 py-2 text-sm text-world-text-muted no-underline transition-colors duration-150 hover:border-world-primary hover:text-world-text"
      >
        {dict.orders.backToOrders}
      </Link>
    </div>
  );
}
