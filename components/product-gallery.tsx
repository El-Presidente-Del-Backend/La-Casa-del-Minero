"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ProductGallery({
  images,
  alt,
  badge,
  inStock,
}: {
  images: string[]
  alt: string
  badge?: string
  inStock: boolean
}) {
  const [active, setActive] = useState(0)
  const src = images[active] ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-lg border border-border bg-card">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {badge && (
          <Badge className="absolute left-4 top-4 text-xs uppercase tracking-wider">
            {badge}
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-md bg-secondary px-6 py-2 text-lg font-bold uppercase tracking-wide text-muted-foreground">
              Agotado
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors",
                i === active ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
