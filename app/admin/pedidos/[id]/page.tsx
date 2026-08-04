import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, Phone, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { getAdminOrderById } from "@/lib/admin-queries"

export default async function PedidoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getAdminOrderById(id)

  if (!order) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/pedidos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a pedidos
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
            Pedido #{order.id.slice(0, 8)}
          </h1>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString("es-CL", { dateStyle: "long", timeStyle: "short" })
            : "—"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cant.</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, i) => (
                  <TableRow key={`${item.productId}-${i}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{item.quantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      ${item.price.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      ${(item.price * item.quantity).toLocaleString("es-CL")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">${order.total.toLocaleString("es-CL")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">{order.customerName}</span>
            </div>
            {order.customerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a href={`mailto:${order.customerEmail}`} className="text-foreground hover:underline">
                  {order.customerEmail}
                </a>
              </div>
            )}
            {order.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a href={`tel:${order.customerPhone}`} className="text-foreground hover:underline">
                  {order.customerPhone}
                </a>
              </div>
            )}
            {!order.customerEmail && !order.customerPhone && (
              <p className="text-muted-foreground">Sin datos de contacto.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
