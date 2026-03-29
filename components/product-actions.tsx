"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart/cart-context"
import { toast } from "sonner"
import type { Product } from "@/lib/products"

export function ProductActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const { addItem, setIsOpen } = useCart()

  const handleAddToCart = () => {
    addItem(product, qty)
    toast.success(`${product.name} agregado al carrito`)
    setIsOpen(true)
    setQty(1)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-md border border-border">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-none rounded-l-md"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={!product.inStock || qty <= 1}
          aria-label="Reducir cantidad"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground">
          {qty}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-none rounded-r-md"
          onClick={() => setQty((q) => Math.min(10, q + 1))}
          disabled={!product.inStock || qty >= 10}
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Button
        size="lg"
        className="flex-1 gap-2 text-sm uppercase tracking-wide"
        disabled={!product.inStock}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-4 w-4" />
        Agregar al carrito
      </Button>
    </div>
  )
}
