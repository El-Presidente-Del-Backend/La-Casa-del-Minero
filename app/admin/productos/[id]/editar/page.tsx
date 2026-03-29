import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { updateProduct } from "@/app/actions/admin"
import { ProductForm } from "../../product-form"

export default async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }, { data: specs }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("product_specs").select("label, value").eq("product_id", id),
  ])

  if (!product) notFound()

  const updateWithId = updateProduct.bind(null, id)

  return (
    <div>
      <Link href="/admin/productos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
        Editar: {product.name}
      </h1>
      <ProductForm
        categories={categories ?? []}
        defaultValues={{
          name: product.name,
          description: product.description,
          long_description: product.long_description,
          price: product.price,
          original_price: product.original_price,
          category_id: product.category_id,
          image_url: product.image_url,
          badge: product.badge,
          in_stock: product.in_stock,
          sku: product.sku,
          specs: specs ?? [],
        }}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  )
}
