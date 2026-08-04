"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { ClipboardList, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { updateOrderStatus } from "@/app/actions/admin"
import { idleState } from "@/lib/action-state"
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders"
import type { AdminOrder } from "@/lib/admin-queries"
import { OrderCard } from "./order-card"

async function persistStatus(orderId: string, status: OrderStatus) {
  const formData = new FormData()
  formData.set("status", status)
  return updateOrderStatus(orderId, idleState, formData)
}

function KanbanColumn({
  status,
  orders,
}: {
  status: OrderStatus
  orders: AdminOrder[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {ORDER_STATUS_LABELS[status]}
        </h3>
        <Badge variant="secondary">{orders.length}</Badge>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-32 flex-1 flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-2 transition-colors",
          isOver && "border-primary bg-primary/5"
        )}
      >
        {orders.length === 0 ? (
          <p className="p-2 text-center text-xs text-muted-foreground">Sin pedidos</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  )
}

export function OrdersKanban({ orders: initialOrders }: { orders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.customerName.toLowerCase().includes(q) ||
        (o.customerEmail ?? "").toLowerCase().includes(q) ||
        (o.customerPhone ?? "").toLowerCase().includes(q)
    )
  }, [orders, search])

  const byStatus = (status: OrderStatus) => filtered.filter((o) => o.status === status)
  const activeOrder = activeId ? orders.find((o) => o.id === activeId) : undefined

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string)

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return

    const orderId = active.id as string
    const newStatus = over.id as OrderStatus
    const current = orders.find((o) => o.id === orderId)
    if (!current || current.status === newStatus) return

    const previousStatus = current.status
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))

    void persistStatus(orderId, newStatus).then((result) => {
      if (result.status === "success") {
        toast.success(`Pedido movido a ${ORDER_STATUS_LABELS[newStatus]}`)
      } else {
        toast.error(result.message ?? "No se pudo actualizar el pedido")
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: previousStatus } : o)))
      }
    })
  }

  if (orders.length === 0) {
    return (
      <Empty className="rounded-lg border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardList />
          </EmptyMedia>
          <EmptyTitle>Aún no hay pedidos</EmptyTitle>
          <EmptyDescription>
            Cuando un cliente pulse "Comprar por WhatsApp" en la tienda, el pedido aparecerá aquí.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {ORDER_STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} orders={byStatus(status)} />
          ))}
        </div>
        <DragOverlay>{activeOrder ? <OrderCard order={activeOrder} dragging /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
