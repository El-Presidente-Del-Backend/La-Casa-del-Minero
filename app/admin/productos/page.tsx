import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAdminProducts, getCategoryOptions } from "@/lib/admin-queries"
import { ProductsTable } from "./products-table"

export default async function AdminProductos() {
  const [products, categories] = await Promise.all([getAdminProducts(), getCategoryOptions()])

  // Proyección ligera: la tabla no necesita longDescription/description/specs,
  // y evitar mandarlos al cliente mantiene el payload del listado pequeño.
  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    price: p.price,
    imageUrl: p.imageUrl,
    badge: p.badge,
    inStock: p.inStock,
  }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
          Productos
        </h1>
        <Link href="/admin/productos/nuevo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <ProductsTable products={rows} categories={categories} />
    </div>
  )
}
