import { redirect } from "next/navigation"
import Link from "next/link"
import { Pickaxe, LayoutDashboard, Package, Tags, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Try getUser first (verifies with Supabase), fallback to getSession (reads cookie)
  let userId: string | null = null
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    userId = user.id
  } else {
    const { data: { session } } = await supabase.auth.getSession()
    userId = session?.user?.id ?? null
  }

  if (!userId) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (profile?.role !== "admin") redirect("/tienda")

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <Pickaxe className="h-6 w-6 text-primary" />
          <span className="font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wider text-foreground">
            Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/productos"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Package className="h-4 w-4" />
            Productos
          </Link>
          <Link
            href="/admin/categorias"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Tags className="h-4 w-4" />
            Categorías
          </Link>
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/tienda"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background p-6">
        {children}
      </main>
    </div>
  )
}
