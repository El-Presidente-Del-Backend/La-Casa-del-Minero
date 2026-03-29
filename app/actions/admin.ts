"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

async function assertAdmin() {
  const supabase = await createClient()

  let userId: string | null = null
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    userId = user.id
  } else {
    const { data: { session } } = await supabase.auth.getSession()
    userId = session?.user?.id ?? null
  }
  if (!userId) throw new Error("No autenticado")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (profile?.role !== "admin") throw new Error("No autorizado")
  return supabase
}

export async function createProduct(formData: FormData) {
  const supabase = await assertAdmin()

  const specs: { label: string; value: string }[] = []
  const specLabels = formData.getAll("spec_label") as string[]
  const specValues = formData.getAll("spec_value") as string[]
  specLabels.forEach((label, i) => {
    if (label && specValues[i]) specs.push({ label, value: specValues[i] })
  })

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      long_description: formData.get("long_description") as string,
      price: parseFloat(formData.get("price") as string),
      original_price: formData.get("original_price") ? parseFloat(formData.get("original_price") as string) : null,
      category_id: formData.get("category_id") as string,
      image_url: formData.get("image_url") as string || "/images/products/placeholder.jpg",
      badge: (formData.get("badge") as string) || null,
      in_stock: formData.get("in_stock") === "on",
      sku: formData.get("sku") as string,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  if (specs.length > 0 && product) {
    await supabase.from("product_specs").insert(
      specs.map((s) => ({ product_id: product.id, ...s }))
    )
  }

  revalidatePath("/admin/productos")
  revalidatePath("/tienda")
  redirect("/admin/productos")
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await assertAdmin()

  const specs: { label: string; value: string }[] = []
  const specLabels = formData.getAll("spec_label") as string[]
  const specValues = formData.getAll("spec_value") as string[]
  specLabels.forEach((label, i) => {
    if (label && specValues[i]) specs.push({ label, value: specValues[i] })
  })

  const { error } = await supabase
    .from("products")
    .update({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      long_description: formData.get("long_description") as string,
      price: parseFloat(formData.get("price") as string),
      original_price: formData.get("original_price") ? parseFloat(formData.get("original_price") as string) : null,
      category_id: formData.get("category_id") as string,
      image_url: formData.get("image_url") as string || "/images/products/placeholder.jpg",
      badge: (formData.get("badge") as string) || null,
      in_stock: formData.get("in_stock") === "on",
      sku: formData.get("sku") as string,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  // Replace specs: delete old, insert new
  await supabase.from("product_specs").delete().eq("product_id", id)
  if (specs.length > 0) {
    await supabase.from("product_specs").insert(
      specs.map((s) => ({ product_id: id, ...s }))
    )
  }

  revalidatePath("/admin/productos")
  revalidatePath("/tienda")
  redirect("/admin/productos")
}

export async function deleteProduct(id: string) {
  const supabase = await assertAdmin()

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/productos")
  revalidatePath("/tienda")
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createCategory(formData: FormData) {
  const supabase = await assertAdmin()

  const name = (formData.get("name") as string).trim()
  const label = (formData.get("label") as string).trim()
  const image_url = (formData.get("image_url") as string).trim() || null

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    label,
    image_url,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/admin/categorias")
  revalidatePath("/tienda")
  redirect("/admin/categorias")
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await assertAdmin()

  const name = (formData.get("name") as string).trim()
  const label = (formData.get("label") as string).trim()
  const image_url = (formData.get("image_url") as string).trim() || null

  const { error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(name), label, image_url })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/categorias")
  revalidatePath("/tienda")
  redirect("/admin/categorias")
}

export async function deleteCategory(id: string) {
  const supabase = await assertAdmin()

  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/categorias")
  revalidatePath("/tienda")
}
