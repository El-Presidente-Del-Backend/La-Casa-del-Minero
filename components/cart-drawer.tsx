"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart/cart-context"
import { useUser } from "@/hooks/use-user"
import { createOrder } from "@/app/actions/orders"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const { user } = useUser()

  const [step, setStep] = useState<"cart" | "contact">("cart")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Al cerrar el drawer, la próxima vez que se abra debe partir del carrito,
  // no dejar al cliente a mitad del formulario de contacto de una vez anterior.
  useEffect(() => {
    if (!isOpen) {
      setStep("cart")
      setError(null)
    }
  }, [isOpen])

  const buildWhatsAppMessage = (orderId?: string) => {
    let msg = "¡Hola! Me gustaría comprar:\n\n"
    items.forEach((item) => {
      msg += `• ${item.quantity}x ${item.product.name} ($${item.product.price.toLocaleString("es-CL")} c/u)\n`
    })
    msg += `\n*Total: $${totalPrice.toLocaleString("es-CL")}*`
    if (orderId) msg += `\nReferencia: #${orderId.slice(0, 8)}`
    return encodeURIComponent(msg)
  }

  const submitOrder = async (contact?: { name: string; email: string; phone: string }) => {
    // La ventana se abre síncronamente, antes de cualquier await: si se abre
    // después de esperar la respuesta del servidor, Safari/Chrome suelen
    // bloquearla por no reconocerla ya como parte directa del clic.
    const win = window.open("", "_blank")
    setSubmitting(true)
    setError(null)

    const result = await createOrder({
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      name: contact?.name,
      email: contact?.email,
      phone: contact?.phone,
    })

    setSubmitting(false)

    if (!result.ok) {
      win?.close()
      setError(result.error)
      return
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(result.orderId)}`
    if (win) win.location.href = url
    else window.open(url, "_blank")

    clearCart()
    setStep("cart")
    setIsOpen(false)
  }

  const handleBuyClick = () => {
    if (user) {
      void submitOrder()
    } else {
      setError(null)
      setStep("contact")
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Ingresa tu nombre, email y teléfono para continuar")
      return
    }
    void submitOrder({ name: name.trim(), email: email.trim(), phone: phone.trim() })
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
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">Tu carrito está vacío</p>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Seguir comprando
            </Button>
          </div>
        ) : step === "contact" ? (
          <div className="flex flex-1 flex-col gap-4 px-4 py-4">
            <button
              onClick={() => setStep("cart")}
              className="flex items-center gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Volver al carrito
            </button>
            <p className="text-sm text-muted-foreground">
              Antes de continuar, cuéntanos quién eres para que podamos contactarte.
            </p>
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Nombre</Label>
                <Input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-phone">Teléfono</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
                disabled={submitting}
              >
                <MessageCircle className="h-5 w-5" />
                {submitting ? "Enviando..." : "Continuar a WhatsApp"}
              </Button>
            </form>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product.images[0]}
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
            <div className="border-t border-border px-4 pt-4 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">${totalPrice.toLocaleString('es-CL')}</span>
              </div>

              {error && <p className="mb-2 text-sm text-destructive">{error}</p>}

              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
                  onClick={handleBuyClick}
                  disabled={submitting}
                >
                  <MessageCircle className="h-5 w-5" />
                  {submitting ? "Enviando..." : "Comprar por WhatsApp"}
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
