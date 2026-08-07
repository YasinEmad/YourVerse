import "@/lib/api/server";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/api/orders";
import { computeOrderTotals } from "@/lib/orders/order-totals";
import { getServerDictionary } from "@/lib/i18n/server";
import { OrderConfirmation } from "@/components/shop/OrderConfirmation";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await getOrder(params.orderId);

  if (!order) {
    notFound();
  }

  // Re-derive totals from the order record server-side rather than trusting
  // anything the client could have sent or stored.
  const totals = computeOrderTotals(order.items);
  const dict = await getServerDictionary();

  return (
    <div className="shop-page__inner">
      <OrderConfirmation order={order} totals={totals} dict={dict} />
    </div>
  );
}
