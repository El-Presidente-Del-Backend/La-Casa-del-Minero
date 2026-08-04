"use client"

import Link from "next/link"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AdminOrder } from "@/lib/admin-queries"

export function OrderCard({ order, dragging = false }: { order: AdminOrder; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
  })

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      className={cn(
        "flex cursor-grab flex-col gap-2 rounded-md border border-border bg-card p-3 text-sm shadow-sm transition-shadow active:cursor-grabbing",
        isDragging && "opacity-40",
        dragging && "rotate-2 cursor-grabbing shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-foreground">{order.customerName}</p>
        <Link
          href={`/admin/pedidos/${order.id}`}
          onPointerDown={(e) => e.stopPropagation()}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          title="Ver detalle"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {order.customerEmail ?? order.customerPhone ?? "Sin contacto"}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {itemCount} {itemCount === 1 ? "producto" : "productos"}
        </span>
        <span className="font-semibold text-foreground">${order.total.toLocaleString("es-CL")}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })
          : "—"}
      </p>
    </div>
  )
}
