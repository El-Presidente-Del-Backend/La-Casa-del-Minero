import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck, RotateCcw, Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { products, getProductById, getRelatedProducts, categoryLabels, type Category } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { StoreFooter } from "@/components/store-footer"
import { ProductDetailNavbar } from "@/components/product-detail-navbar"
import { QuantitySelector } from "@/components/quantity-selector"

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return { title: "Producto no encontrado" }
  return {
    title: `${product.name} - La Casa del Minero Tienda`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const related = getRelatedProducts(id, 4)
  const catLabel = categoryLabels[product.category as Category] ?? product.category

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-muted-foreground">
            <li>
              <Link href="/tienda" className="transition-colors hover:text-primary">
                Tienda
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/tienda" className="transition-colors hover:text-primary">
                {catLabel}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        {/* Product detail */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.badge && (
              <Badge className="absolute left-4 top-4 text-xs uppercase tracking-wider">
                {product.badge}
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <span className="rounded-md bg-secondary px-6 py-2 text-lg font-bold uppercase tracking-wide text-muted-foreground">
                  Agotado
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {catLabel}
              </span>
              <h1 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                {product.name}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                SKU: {product.sku}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {"$"}{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {"$"}{product.originalPrice.toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.longDescription}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-foreground">
                {product.inStock ? "En stock" : "Sin stock"}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuantitySelector disabled={!product.inStock} />
              <Button
                size="lg"
                className="flex-1 gap-2 text-sm uppercase tracking-wide"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar al carrito
              </Button>
            </div>

            {/* Benefits */}
            <div className="mt-2 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">Envío rápido</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">Garantía</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card p-3 text-center">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">Devoluciones</span>
              </div>
            </div>

            {/* Specs table */}
            <div className="mt-2">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-foreground">
                Especificaciones
              </h2>
              <div className="overflow-hidden rounded-lg border border-border">
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                      i % 2 === 0 ? "bg-card" : "bg-muted/30"
                    }`}
                  >
                    <span className="font-medium text-muted-foreground">{spec.label}</span>
                    <span className="text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full bg-primary" />
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wide text-foreground">
                Productos Relacionados
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
    </div>
  )
}
