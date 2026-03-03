"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pickaxe, Search, ShoppingCart, User, Menu, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categories, categoryLabels, type Category } from "@/lib/products"

export function StoreNavbar({
  cartCount = 0,
  activeCategory,
  onCategoryChange,
  onSearch,
}: {
  cartCount?: number
  activeCategory?: Category
  onCategoryChange?: (cat: Category) => void
  onSearch?: (query: string) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-3 w-3" />
            Volver al sitio principal
          </Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mi Cuenta</span>
            </button>
            <button className="relative flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/tienda" className="flex shrink-0 items-center gap-2">
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

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 md:block">
            <div className="relative mx-auto max-w-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                className="h-9 border-border bg-background pl-9 pr-4 text-sm"
              />
            </div>
          </form>

          {/* Mobile search + menu */}
          <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                className="h-9 bg-background pl-9 text-sm"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>

      {/* Category navigation - desktop */}
      <nav className="hidden border-t border-border/60 bg-primary md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onCategoryChange?.(cat)
                router.push("/tienda")
              }}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeCategory === cat
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border md:hidden">
          <div className="flex flex-col px-4 py-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onCategoryChange?.(cat)
                  setMobileOpen(false)
                }}
                className={`px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
