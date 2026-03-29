"use client"

import Image from "next/image"
import type { CategoryRecord } from "@/lib/products"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function StoreCategories({
  categories,
  onCategoryChange,
}: {
  categories: CategoryRecord[]
  onCategoryChange?: (cat: string) => void
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-8 w-1.5 rounded-full bg-primary" />
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wide text-foreground">
          Categorías Destacadas
        </h2>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {categories.map((cat) => (
            <CarouselItem key={cat.id} className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4">
              <button
                onClick={() => onCategoryChange?.(cat.name)}
                className="group relative w-full overflow-hidden rounded-lg border border-border"
              >
                <div className="relative aspect-[4/3]">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                      {cat.label}
                    </p>
                    <p className="mt-0.5 text-xs text-primary">Ver productos</p>
                  </div>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 hidden md:flex" />
        <CarouselNext className="-right-3 hidden md:flex" />
      </Carousel>
    </section>
  )
}
