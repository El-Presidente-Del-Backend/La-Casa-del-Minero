"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  const catLabel = product.category

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Image - clickable */}
      <Link
        href={`/tienda/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <Badge className="absolute left-3 top-3 text-[10px] uppercase tracking-wider">
            {product.badge}
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-md bg-secondary px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Agotado
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
          {catLabel}
        </span>
        <Link href={`/tienda/${product.id}`}>
          <h3 className="text-sm font-semibold leading-snug text-card-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {"$"}{product.price.toLocaleString('es-CL')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {"$"}{product.originalPrice.toLocaleString('es-CL')}
              </span>
            )}
          </div>
          <AddToCartButton product={product} size="sm" className="gap-1.5 text-xs" />
        </div>
      </div>
    </article>
  )
}
