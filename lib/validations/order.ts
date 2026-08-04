import { z } from "zod"
import { ORDER_STATUSES } from "@/lib/orders"

export const orderItemInputSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(10),
})

/**
 * name/phone son opcionales a nivel de schema: la obligatoriedad depende de
 * si el comprador tiene sesión activa, algo que el schema no puede saber.
 * Esa regla vive en la Server Action (app/actions/orders.ts).
 */
export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, "El carrito está vacío"),
  name: z.string().trim().min(2, "Ingresa tu nombre").max(120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{6,20}$/, "Ingresa un teléfono válido")
    .optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const orderStatusSchema = z.enum(ORDER_STATUSES)
