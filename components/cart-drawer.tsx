"use client"

import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart/cart-context"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  const buildWhatsAppMessage = () => {
    let msg = "¡Hola! Me gustaría comprar:\n\n"
    items.forEach((item) => {
      msg += `• ${item.quantity}x ${item.product.name} ($${item.product.price.toLocaleString('es-CL')} c/u)\n`
    })
    msg += `\n*Total: $${totalPrice.toLocaleString('es-CL')}*`
    return encodeURIComponent(msg)
  }

  const handleWhatsAppOrder = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`
    window.open(url, "_blank")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">Tu carrito está vacío</p>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Seguir comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <h4 className="text-sm font-semibold leading-snug text-foreground">
                        {item.product.name}
                      </h4>
                      <p className="text-sm font-bold text-primary">
                        ${item.product.price.toLocaleString('es-CL')}
                      </p>

                      {/* Quantity controls */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="flex h-7 w-8 items-center justify-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">${totalPrice.toLocaleString('es-CL')}</span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle className="h-5 w-5" />
                  Comprar por WhatsApp
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={clearCart}>
                  Vaciar carrito
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
