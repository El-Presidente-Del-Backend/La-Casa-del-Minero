"use server"

import { FieldValue } from "firebase-admin/firestore"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { adminDb } from "@/lib/firebase/admin"
import { requireAdmin } from "@/lib/firebase/session"
import { PLACEHOLDER_IMAGE } from "@/lib/products"

type Spec = { label: string; value: string }

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function parseSpecs(formData: FormData): Spec[] {
  const labels = formData.getAll("spec_label") as string[]
  const values = formData.getAll("spec_value") as string[]

  const specs: Spec[] = []
  labels.forEach((label, i) => {
    if (label && values[i]) specs.push({ label, value: values[i] })
  })
  return specs
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Firestore no tiene restricciones UNIQUE como las que aplicaba Postgres sobre
 * `products.sku` y `categories.name`, así que se comprueban a mano.
 */
async function assertFieldIsFree(
  collection: string,
  field: string,
  value: string,
  exceptId?: string
) {
  const snapshot = await adminDb.collection(collection).where(field, "==", value).get()
  const clash = snapshot.docs.some((doc) => doc.id !== exceptId)
  if (clash) throw new Error(`Ya existe un registro con ${field} "${value}"`)
}

/**
 * El nombre de la categoría se guarda dentro de cada producto para evitar una
 * lectura extra por producto al pintar la tienda (Firestore no hace joins).
 */
async function resolveCategoryName(categoryId: string): Promise<string> {
  const doc = await adminDb.collection("categories").doc(categoryId).get()
  if (!doc.exists) throw new Error("La categoría seleccionada no existe")
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

function productFromForm(formData: FormData, categoryName: string) {
  const originalPrice = formData.get("original_price") as string

  return {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    longDescription: (formData.get("long_description") as string) ?? "",
    price: parseFloat(formData.get("price") as string),
    originalPrice: originalPrice ? parseFloat(originalPrice) : null,
    categoryId: formData.get("category_id") as string,
    categoryName,
    imageUrl: (formData.get("image_url") as string) || PLACEHOLDER_IMAGE,
    badge: (formData.get("badge") as string) || null,
    inStock: formData.get("in_stock") === "on",
    sku: formData.get("sku") as string,
    specs: parseSpecs(formData),
  }
}

function revalidateStore() {
  revalidatePath("/tienda")
  revalidatePath("/tienda/[id]", "page")
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const sku = formData.get("sku") as string
  await assertFieldIsFree("products", "sku", sku)

  const categoryName = await resolveCategoryName(formData.get("category_id") as string)

  await adminDb.collection("products").add({
    ...productFromForm(formData, categoryName),
    createdAt: FieldValue.serverTimestamp(),
  })

  revalidatePath("/admin/productos")
  revalidateStore()
  redirect("/admin/productos")
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()

  const sku = formData.get("sku") as string
  await assertFieldIsFree("products", "sku", sku, id)

  const categoryName = await resolveCategoryName(formData.get("category_id") as string)

  // Las especificaciones viven dentro del documento, así que reemplazar el array
  // sustituye al delete + insert sobre product_specs que hacía la versión SQL.
  await adminDb
    .collection("products")
    .doc(id)
    .update(productFromForm(formData, categoryName))

  revalidatePath("/admin/productos")
  revalidateStore()
  redirect("/admin/productos")
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  await adminDb.collection("products").doc(id).delete()

  revalidatePath("/admin/productos")
  revalidateStore()
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------

export async function createCategory(formData: FormData) {
  await requireAdmin()

  const name = (formData.get("name") as string).trim()
  const label = (formData.get("label") as string).trim()
  const imageUrl = ((formData.get("image_url") as string) ?? "").trim() || null

  await assertFieldIsFree("categories", "name", name)

  await adminDb.collection("categories").add({
    name,
    slug: slugify(name),
    label,
    imageUrl,
    createdAt: FieldValue.serverTimestamp(),
  })

  // Sin redirect: el formulario de categorías es inline, así que basta con
  // revalidar para que el Server Component vuelva a pintar la tabla.
  revalidatePath("/admin/categorias")
  revalidateStore()
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin()

  const name = (formData.get("name") as string).trim()
  const label = (formData.get("label") as string).trim()
  const imageUrl = ((formData.get("image_url") as string) ?? "").trim() || null

  await assertFieldIsFree("categories", "name", name, id)

  await adminDb.collection("categories").doc(id).update({
    name,
    slug: slugify(name),
    label,
    imageUrl,
  })

  // Al renombrar hay que propagar el nombre desnormalizado a sus productos.
  const affected = await adminDb.collection("products").where("categoryId", "==", id).get()
  await updateInBatches(affected.docs, { categoryName: name })

  revalidatePath("/admin/categorias")
  revalidatePath("/admin/productos")
  revalidateStore()
}

export async function deleteCategory(id: string) {
  await requireAdmin()

  // Equivalente al ON DELETE SET NULL que tenía la clave foránea en Postgres.
  const affected = await adminDb.collection("products").where("categoryId", "==", id).get()
  await updateInBatches(affected.docs, { categoryId: null, categoryName: "" })

  await adminDb.collection("categories").doc(id).delete()

  revalidatePath("/admin/categorias")
  revalidatePath("/admin/productos")
  revalidateStore()
}
