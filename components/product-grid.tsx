"use client"

import { useMemo } from "react"
import { ProductCard } from "@/components/product-card"
import type { CategoryRecord, Product } from "@/lib/products"
import { PackageX } from "lucide-react"

export function ProductGrid({
  search,
  activeCategoryId,
  categories,
  products,
}: {
  search: string
  activeCategoryId: string
  categories: CategoryRecord[]
  products: Product[]
}) {
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        activeCategoryId === "todos" ||
        p.categoryId === activeCategoryId ||
        p.parentCategoryId === activeCategoryId
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategoryId, products])

  const activeLabel =
    activeCategoryId === "todos"
      ? "Todos los Productos"
      : categories.find((c) => c.id === activeCategoryId)?.label ?? "Productos"

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-primary" />
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wide text-foreground">
            {activeLabel}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-20 text-center">
          <PackageX className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-semibold text-muted-foreground">
            No se encontraron productos
          </p>
          <p className="text-sm text-muted-foreground/70">
            Intenta cambiar los filtros o el término de búsqueda.
          </p>
        </div>
      )}
    </div>
  )
}
