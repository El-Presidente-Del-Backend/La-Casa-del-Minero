"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart/cart-context"
import { toast } from "sonner"
import type { Product } from "@/lib/products"

export function AddToCartButton({
  product,
  quantity = 1,
  size = "sm",
  showLabel = true,
  className,
}: {
  product: Product
  quantity?: number
  size?: "sm" | "lg" | "default"
  showLabel?: boolean
  className?: string
}) {
  const { addItem, setIsOpen } = useCart()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    addItem(product, quantity)
    toast.success(`${product.name} agregado al carrito`)
    setIsOpen(true)
  }

  return (
    <Button
      size={size}
      className={className}
      disabled={!product.inStock}
      onClick={handleClick}
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      {showLabel && <span className="hidden sm:inline">Agregar</span>}
    </Button>
  )
}
