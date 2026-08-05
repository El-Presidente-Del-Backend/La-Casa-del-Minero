"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, ShoppingCart, User, Menu, X, ArrowLeft, LogOut, LayoutDashboard, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CategoryRecord } from "@/lib/products"
import { buildCategoryTree } from "@/lib/categories"
import { useUser } from "@/hooks/use-user"
import { useCart } from "@/lib/cart/cart-context"
import { signOut } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase/client"
import { destroyServerSession } from "@/lib/firebase/auth-client"

export function StoreNavbar({
  categories,
  activeCategoryId,
  onCategoryChange,
  onSearch,
}: {
  categories: CategoryRecord[]
  activeCategoryId?: string
  onCategoryChange?: (id: string) => void
  onSearch?: (query: string) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [openParentId, setOpenParentId] = useState<string | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<Set<string>>(new Set())
  const router = useRouter()
  const { user, isAdmin, loading } = useUser()
  const { totalItems, setIsOpen: setCartOpen } = useCart()

  const handleLogout = async () => {
    await signOut(getFirebaseAuth())
    await destroyServerSession()
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])
  const openParent = categoryTree.find((c) => c.id === openParentId)

  const toggleMobileExpanded = (id: string) => {
    setExpandedMobile((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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
            {loading ? (
              <span className="h-4 w-16 animate-pulse rounded bg-muted" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Panel admin</span>
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Link>
            )}
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Carrito</span>
              {totalItems > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/tienda" className="flex shrink-0 items-center gap-2">
            <Image src="/casco.png" alt="La Casa del Minero" width={200} height={85} className="h-16 w-auto" />
          </Link>

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

          <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setSearchOpen(!searchOpen)} aria-label="Buscar">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menú">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

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
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4">
          <button
            onClick={() => {
              onCategoryChange?.("todos")
              router.push("/tienda")
            }}
            className={`shrink-0 whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeCategoryId === "todos"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            }`}
          >
            Todos
          </button>
          {categoryTree.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryChange?.(cat.id)
                router.push("/tienda")
                setOpenParentId((prev) => (cat.children.length > 0 ? (prev === cat.id ? null : cat.id) : null))
              }}
              className={`flex shrink-0 items-center gap-1 whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeCategoryId === cat.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              {cat.label}
              {cat.children.length > 0 && (
                <ChevronDown className={`h-3 w-3 transition-transform ${openParentId === cat.id ? "rotate-180" : ""}`} />
              )}
            </button>
          ))}
        </div>

        {/* Subcategorías del padre abierto — fuera del contenedor con scroll
            horizontal para no quedar recortadas por su overflow. */}
        {openParent && openParent.children.length > 0 && (
          <div className="border-t border-primary-foreground/10 bg-primary/95">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-2">
              {openParent.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    onCategoryChange?.(child.id)
                    router.push("/tienda")
                    setOpenParentId(null)
                  }}
                  className={`shrink-0 whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeCategoryId === child.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  }`}
                >
                  {child.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border md:hidden">
          <div className="flex flex-col px-4 py-3">
            <button
              onClick={() => {
                onCategoryChange?.("todos")
                setMobileOpen(false)
              }}
              className={`px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeCategoryId === "todos" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos
            </button>
            {categoryTree.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      onCategoryChange?.(cat.id)
                      setMobileOpen(false)
                    }}
                    className={`flex-1 px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      activeCategoryId === cat.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                  {cat.children.length > 0 && (
                    <button
                      onClick={() => toggleMobileExpanded(cat.id)}
                      aria-label={`Mostrar subcategorías de ${cat.label}`}
                      className="p-2.5 text-muted-foreground"
                    >
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${expandedMobile.has(cat.id) ? "rotate-90" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {cat.children.length > 0 && expandedMobile.has(cat.id) && (
                  <div className="flex flex-col">
                    {cat.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          onCategoryChange?.(child.id)
                          setMobileOpen(false)
                        }}
                        className={`px-3 py-2 pl-8 text-left text-sm transition-colors ${
                          activeCategoryId === child.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
