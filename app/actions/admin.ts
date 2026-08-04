"use server"

import { FieldValue } from "firebase-admin/firestore"
import { revalidatePath } from "next/cache"
import { adminDb } from "@/lib/firebase/admin"
import { requireAdmin } from "@/lib/firebase/session"
import { PLACEHOLDER_IMAGE } from "@/lib/products"
import { type ActionState, failState, okState } from "@/lib/action-state"
import { slugify } from "@/lib/validations/form"
import { productFormToRaw, productSchema, type ProductInput } from "@/lib/validations/product"
import { categoryFormToRaw, categorySchema } from "@/lib/validations/category"
import { orderStatusSchema } from "@/lib/validations/order"
import { sendOrderStatusEmail } from "@/lib/email"
import type { OrderItem } from "@/lib/orders"

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/**
 * Firestore no tiene restricciones UNIQUE como las que aplicaba Postgres sobre
 * `products.sku` y `categories.name`, así que se comprueban a mano.
 */
async function findFieldClash(
  collection: string,
  field: string,
  value: string,
  exceptId?: string
): Promise<boolean> {
  const snapshot = await adminDb.collection(collection).where(field, "==", value).get()
  return snapshot.docs.some((doc) => doc.id !== exceptId)
}

/**
 * El nombre de la categoría se guarda dentro de cada producto para evitar una
 * lectura extra por producto al pintar la tienda (Firestore no hace joins).
 * Devuelve null cuando la categoría no existe, en vez de lanzar, para que la
 * acción pueda mapearlo a un error de campo.
 */
async function resolveCategoryName(categoryId: string): Promise<string | null> {
  const doc = await adminDb.collection("categories").doc(categoryId).get()
  if (!doc.exists) return null
  return (doc.data()?.name as string | undefined) ?? ""
}

/** Aplica una escritura a muchos documentos respetando el límite de 500 por lote. */
async function updateInBatches(
  docs: FirebaseFirestore.QueryDocumentSnapshot[],
  data: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData>
) {
  const CHUNK = 400
  for (let i = 0; i < docs.length; i += CHUNK) {
    const batch = adminDb.batch()
    docs.slice(i, i + CHUNK).forEach((doc) => batch.update(doc.ref, data))
    await batch.commit()
  }
}

function productToFirestore(data: ProductInput, categoryName: string) {
  return {
    name: data.name,
    description: data.description,
    longDescription: data.long_description,
    price: data.price,
    originalPrice: data.original_price,
    categoryId: data.category_id,
    categoryName,
    images: data.image_urls.length > 0 ? data.image_urls : [PLACEHOLDER_IMAGE],
    badge: data.badge,
    inStock: data.in_stock,
    sku: data.sku,
    specs: data.specs,
  }
}

/** El dashboard también debe verse fresco tras cualquier mutación de productos o categorías. */
function revalidateAdmin() {
  revalidatePath("/admin")
  revalidatePath("/admin/productos")
  revalidatePath("/admin/categorias")
}

function revalidateStore() {
  revalidatePath("/tienda")
  revalidatePath("/tienda/[id]", "page")
}

function toFailState(err: unknown): ActionState {
  return failState(err instanceof Error ? err.message : "Ocurrió un error inesperado")
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin()

    const parsed = productSchema.safeParse(productFormToRaw(formData))
    if (!parsed.success) {
      return failState("Revisa los campos marcados", parsed.error.flatten().fieldErrors)
    }
    const data = parsed.data

    if (await findFieldClash("products", "sku", data.sku)) {
      return failState(`Ya existe un producto con el SKU "${data.sku}"`, {
        sku: ["Ya existe un producto con este SKU"],
      })
    }

    const categoryName = await resolveCategoryName(data.category_id)
    if (categoryName === null) {
      return failState("La categoría seleccionada no existe", {
        category_id: ["Selecciona una categoría válida"],
      })
    }

    await adminDb.collection("products").add({
      ...productToFirestore(data, categoryName),
      createdAt: FieldValue.serverTimestamp(),
    })

    revalidateAdmin()
    revalidateStore()
    return okState("Producto creado", "/admin/productos")
  } catch (err) {
    return toFailState(err)
  }
}

export async function updateProduct(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin()

    const parsed = productSchema.safeParse(productFormToRaw(formData))
    if (!parsed.success) {
      return failState("Revisa los campos marcados", parsed.error.flatten().fieldErrors)
    }
    const data = parsed.data

    if (await findFieldClash("products", "sku", data.sku, id)) {
      return failState(`Ya existe un producto con el SKU "${data.sku}"`, {
        sku: ["Ya existe un producto con este SKU"],
      })
    }

    const categoryName = await resolveCategoryName(data.category_id)
    if (categoryName === null) {
      return failState("La categoría seleccionada no existe", {
        category_id: ["Selecciona una categoría válida"],
      })
    }

    // Las especificaciones viven dentro del documento, así que reemplazar el array
    // sustituye al delete + insert sobre product_specs que hacía la versión SQL.
    await adminDb.collection("products").doc(id).update(productToFirestore(data, categoryName))

    revalidateAdmin()
    revalidateStore()
    return okState("Cambios guardados", "/admin/productos")
  } catch (err) {
    return toFailState(err)
  }
}

export async function deleteProduct(
  id: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin()

    await adminDb.collection("products").doc(id).delete()

    revalidateAdmin()
    revalidateStore()
    return okState("Producto eliminado")
  } catch (err) {
    return toFailState(err)
  }
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin()

    const parsed = categorySchema.safeParse(categoryFormToRaw(formData))
    if (!parsed.success) {
      return failState("Revisa los campos marcados", parsed.error.flatten().fieldErrors)
    }
    const data = parsed.data

    if (await findFieldClash("categories", "name", data.name)) {
      return failState(`Ya existe una categoría con el nombre "${data.name}"`, {
        name: ["Ya existe una categoría con este nombre"],
      })
    }

    await adminDb.collection("categories").add({
      name: data.name,
      slug: slugify(data.name),
      label: data.label,
      imageUrl: data.image_url || null,
      createdAt: FieldValue.serverTimestamp(),
    })

    revalidateAdmin()
    revalidateStore()
    return okState("Categoría creada")
  } catch (err) {
    return toFailState(err)
  }
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin()

    const parsed = categorySchema.safeParse(categoryFormToRaw(formData))
    if (!parsed.success) {
      return failState("Revisa los campos marcados", parsed.error.flatten().fieldErrors)
    }
    const data = parsed.data

    if (await findFieldClash("categories", "name", data.name, id)) {
      return failState(`Ya existe una categoría con el nombre "${data.name}"`, {
        name: ["Ya existe una categoría con este nombre"],
      })
    }

    await adminDb.collection("categories").doc(id).update({
      name: data.name,
      slug: slugify(data.name),
      label: data.label,
      imageUrl: data.image_url || null,
    })

    // Al renombrar hay que propagar el nombre desnormalizado a sus productos.
    const affected = await adminDb.collection("products").where("categoryId", "==", id).get()
    await updateInBatches(affected.docs, { categoryName: data.name })

    revalidateAdmin()
    revalidateStore()
    return okState("Categoría actualizada")
  } catch (err) {
    return toFailState(err)
  }
}

export async function deleteCategory(
  id: string,
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin()

    // Equivalente al ON DELETE SET NULL que tenía la clave foránea en Postgres.
    const affected = await adminDb.collection("products").where("categoryId", "==", id).get()
    await updateInBatches(affected.docs, { categoryId: null, categoryName: "" })

    await adminDb.collection("categories").doc(id).delete()

    revalidateAdmin()
    revalidateStore()
    return okState("Categoría eliminada")
  } catch (err) {
    return toFailState(err)
  }
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------

const NOTIFIABLE_STATUSES = new Set(["confirmado", "enviado", "entregado"])

export async function updateOrderStatus(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin()

    const parsed = orderStatusSchema.safeParse(formData.get("status"))
    if (!parsed.success) {
      return failState("Estado inválido")
    }
    const newStatus = parsed.data

    const ref = adminDb.collection("orders").doc(id)
    const doc = await ref.get()
    if (!doc.exists) {
      return failState("El pedido no existe")
    }
    const order = doc.data()!
    const previousStatus = order.status as string | undefined

    await ref.update({
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp(),
    })

    // El correo es un efecto secundario best-effort: si falla (o el secreto
    // de Resend todavía no está configurado), el cambio de estado igual queda
    // guardado — solo se registra el error en el servidor.
    const customerEmail = order.customerEmail as string | null
    if (newStatus !== previousStatus && NOTIFIABLE_STATUSES.has(newStatus) && customerEmail) {
      // Se espera el envío (en vez de fire-and-forget) para que no quede a
      // medias si el proceso se recicla apenas termina esta acción — el
      // try/catch de más abajo asegura que un fallo de Resend no rompa el
      // cambio de estado, que ya quedó guardado en la línea de arriba.
      try {
        await sendOrderStatusEmail({
          to: customerEmail,
          customerName: (order.customerName as string) || "Cliente",
          items: (order.items as OrderItem[]) ?? [],
          total: (order.total as number) ?? 0,
          status: newStatus as "confirmado" | "enviado" | "entregado",
          orderId: id,
        })
      } catch (err) {
        console.error(`No se pudo enviar el correo del pedido ${id}:`, err)
      }
    }

    revalidatePath("/admin/pedidos")
    revalidatePath(`/admin/pedidos/${id}`)
    revalidateAdmin()
    return okState("Estado actualizado")
  } catch (err) {
    return toFailState(err)
  }
}
