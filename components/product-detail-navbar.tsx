"use client"

import Link from "next/link"
import { Pickaxe, ArrowLeft, ShoppingCart, User } from "lucide-react"

export function ProductDetailNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <Link
            href="/tienda"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" />
            Volver a la tienda
          </Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mi Cuenta</span>
            </button>
            <button className="relative flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Carrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logo bar */}
      <div className="mx-auto max-w-7xl px-4 py-3">
        <Link href="/tienda" className="inline-flex items-center gap-2">
          <Pickaxe className="h-7 w-7 text-primary" />
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase leading-none tracking-wider text-foreground">
              La Casa del Minero
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary">
              Tienda Online
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}
