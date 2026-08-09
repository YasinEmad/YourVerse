import "@/lib/api/server";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/api/orders";
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

  // Totals are rendered from the backend's authoritative OrderDto fields
  // (backend-architecture.md §12) — never recomputed client-side.
  const dict = await getServerDictionary();

  return (
    <div className="mx-auto w-full max-w-[60rem] px-6 pt-12 pb-24">
      <OrderConfirmation order={order} dict={dict} />
    </div>
  );
}
