import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAdminProductById, getCategoryOptions } from "@/lib/admin-queries"
import { updateProduct } from "@/app/actions/admin"
import { ProductForm } from "../../product-form"

export default async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [product, categories] = await Promise.all([getAdminProductById(id), getCategoryOptions()])

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
        categories={categories}
        defaultValues={{
          name: product.name,
          description: product.description,
          long_description: product.longDescription,
          price: product.price,
          original_price: product.originalPrice,
          category_id: product.categoryId ?? "",
          image_url: product.imageUrl,
          badge: product.badge,
          in_stock: product.inStock,
          sku: product.sku,
          specs: product.specs,
        }}
        action={updateWithId}
        submitLabel="Guardar Cambios"
      />
    </div>
  )
}
