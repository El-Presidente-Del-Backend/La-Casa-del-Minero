"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Package, Pencil, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { DeleteProductButton } from "./delete-button"

export type ProductRow = {
  id: string
  name: string
  sku: string
  categoryId: string | null
  categoryName: string
  price: number
  imageUrl: string
  badge: string | null
  inStock: boolean
}

type StockFilter = "all" | "in" | "out"

const PAGE_SIZE = 20

/**
 * Filtrado y paginación en el cliente sobre el dataset completo: Firestore no
 * hace búsqueda de texto parcial, y una paginación por cursor exigiría
 * orderBy('createdAt'), justo lo que el proyecto evita porque descartaría
 * productos legacy sin ese campo (ver lib/queries.ts). Con un catálogo de
 * cientos de productos el payload es trivial y esto evita releer la colección
 * en cada interacción. Si el catálogo supera ~500 productos, reconsiderar
 * migrar a searchParams + paginación server-side.
 */
export function ProductsTable({
  products,
  categories,
}: {
  products: ProductRow[]
  categories: { id: string; name: string }[]
}) {
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [stock, setStock] = useState<StockFilter>("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      const matchesCategory = categoryId === "all" || p.categoryId === categoryId
      const matchesStock = stock === "all" || (stock === "in" ? p.inStock : !p.inStock)
      return matchesQuery && matchesCategory && matchesStock
    })
  }, [products, search, categoryId, stock])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  const hasFilters = search.trim() !== "" || categoryId !== "all" || stock !== "all"

  const clearFilters = () => {
    setSearch("")
    setCategoryId("all")
    setStock("all")
    setPage(1)
  }

  if (products.length === 0) {
    return (
      <Empty className="rounded-lg border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package />
          </EmptyMedia>
          <EmptyTitle>Aún no hay productos</EmptyTitle>
          <EmptyDescription>Crea el primer producto para verlo listado aquí.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/admin/productos/nuevo">
            <Button className="gap-2">Nuevo Producto</Button>
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryId}
          onValueChange={(v) => {
            setCategoryId(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={stock}
          onValueChange={(v) => {
            setStock(v as StockFilter)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquier stock</SelectItem>
            <SelectItem value="in">En stock</SelectItem>
            <SelectItem value="out">Sin stock</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Limpiar
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length === 0
          ? "Sin resultados"
          : `Mostrando ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} de ${filtered.length} productos`}
      </p>

      {filtered.length === 0 ? (
        <Empty className="rounded-lg border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>Sin resultados{search.trim() && ` para "${search.trim()}"`}</EmptyTitle>
            <EmptyDescription>Prueba a ajustar la búsqueda o los filtros.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="hidden md:table-cell">SKU</TableHead>
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        {product.badge && (
                          <Badge variant="secondary" className="mt-0.5 text-[10px]">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{product.sku}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {product.categoryName || "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    ${product.price.toLocaleString("es-CL")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.inStock ? "secondary" : "destructive"}>
                      {product.inStock ? "En stock" : "Sin stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/productos/${product.id}/editar`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
