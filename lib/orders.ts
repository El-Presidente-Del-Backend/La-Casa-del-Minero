// Tipos y constantes de pedidos — seguros para cliente y servidor, igual rol
// que lib/products.ts.

export const ORDER_STATUSES = [
  "pendiente",
  "confirmado",
  "enviado",
  "entregado",
  "cancelado",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}
