"use server"

import { FieldValue } from "firebase-admin/firestore"
import { revalidatePath } from "next/cache"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser } from "@/lib/firebase/session"
import { resolveProductImages } from "@/lib/products"
import type { OrderItem } from "@/lib/orders"
import { createOrderSchema } from "@/lib/validations/order"

export type CreateOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> }

/**
 * Pública: cualquier visitante debe poder registrar un pedido, con o sin
 * sesión. No usa requireAdmin() ni el contrato ActionState de
 * app/actions/admin.ts porque no es un <form> nativo — los ítems vienen del
 * cart-context, no de FormData.
 */
export async function createOrder(input: {
  items: { productId: string; quantity: number }[]
  name?: string
  phone?: string
}): Promise<CreateOrderResult> {
  try {
    const parsed = createOrderSchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false, error: "Revisa los datos", fieldErrors: parsed.error.flatten().fieldErrors }
    }
    const data = parsed.data

    const user = await getCurrentUser()

    if (!user && (!data.name || !data.phone)) {
      return { ok: false, error: "Ingresa tu nombre y teléfono para continuar" }
    }

    // El carrito es estado de cliente (localStorage): nunca se confía en el
    // precio que envía, se recalcula desde el catálogo real.
    const refs = data.items.map((i) => adminDb.collection("products").doc(i.productId))
    const snaps = refs.length > 0 ? await adminDb.getAll(...refs) : []

    const items: OrderItem[] = []
    snaps.forEach((snap, idx) => {
      if (!snap.exists) return
      const p = snap.data()!
      items.push({
        productId: snap.id,
        name: (p.name as string) ?? "",
        price: (p.price as number) ?? 0,
        quantity: data.items[idx].quantity,
        image: resolveProductImages(p.images as string[] | undefined, p.imageUrl as string | undefined)[0],
      })
    })

    if (items.length === 0) {
      return { ok: false, error: "El carrito no contiene productos válidos" }
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    let customerName = data.name ?? "Cliente"
    if (user) {
      const profile = await adminDb.collection("users").doc(user.uid).get()
      customerName = (profile.data()?.fullName as string) || user.email || "Cliente"
    }

    const ref = await adminDb.collection("orders").add({
      items,
      total,
      status: "pendiente",
      customerUid: user?.uid ?? null,
      customerEmail: user?.email ?? null,
      customerName,
      customerPhone: user ? null : data.phone ?? null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    revalidatePath("/admin/pedidos")
    revalidatePath("/admin")

    return { ok: true, orderId: ref.id }
  } catch {
    return { ok: false, error: "No se pudo registrar el pedido" }
  }
}
