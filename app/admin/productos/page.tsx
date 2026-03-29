import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { DeleteProductButton } from "./delete-button"

export default async function AdminProductos() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })

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

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categoría</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Precio</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      {product.badge && <Badge variant="secondary" className="mt-0.5 text-[10px]">{product.badge}</Badge>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{product.sku}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {(product.categories as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                  ${product.price}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${product.in_stock ? "bg-green-500" : "bg-red-500"}`} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/productos/${product.id}/editar`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
