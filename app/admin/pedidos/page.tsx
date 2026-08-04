import { getAdminOrders } from "@/lib/admin-queries"
import { OrdersKanban } from "./orders-kanban"

export default async function AdminPedidos() {
  const orders = await getAdminOrders()

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
          Pedidos
        </h1>
      </div>

      <OrdersKanban orders={orders} />
    </div>
  )
}
