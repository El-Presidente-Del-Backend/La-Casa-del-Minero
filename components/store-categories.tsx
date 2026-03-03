"use client"

import Image from "next/image"
import { categoryImages, categoryLabels, type Category } from "@/lib/products"

const displayCategories: Category[] = ["Seguridad", "Herramientas", "Iluminacion", "Deteccion"]

export function StoreCategories({
  onCategoryChange,
}: {
  onCategoryChange?: (cat: Category) => void
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-8 w-1.5 rounded-full bg-primary" />
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wide text-foreground">
          Categorías Destacadas
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {displayCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange?.(cat)}
            className="group relative overflow-hidden rounded-lg border border-border"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={categoryImages[cat]}
                alt={categoryLabels[cat]}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                  {categoryLabels[cat]}
                </p>
                <p className="mt-0.5 text-xs text-primary">Ver productos</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
