import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCategoryOptions } from "@/lib/admin-queries"
import { createProduct } from "@/app/actions/admin"
import { ProductForm } from "../product-form"

export default async function NuevoProducto() {
  const categories = await getCategoryOptions()

  return (
    <div>
      <Link href="/admin/productos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
        Nuevo Producto
      </h1>
      <ProductForm
        categories={categories}
        action={createProduct}
        submitLabel="Crear Producto"
      />
    </div>
  )
}
