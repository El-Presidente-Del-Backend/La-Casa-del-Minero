"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tags } from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
]

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {LINKS.map((link) => {
        // "/admin" con startsWith a secas quedaría activo en todas las rutas
        // del panel, así que necesita comparación exacta.
        const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
