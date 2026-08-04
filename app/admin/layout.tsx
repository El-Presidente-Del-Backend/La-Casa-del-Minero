import { redirect } from "next/navigation"
import Link from "next/link"
import { Pickaxe, LogOut } from "lucide-react"
import { getCurrentUser } from "@/lib/firebase/session"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { AdminUserMenu } from "@/components/admin/admin-user-menu"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) redirect("/auth/login")
  if (!user.isAdmin) redirect("/tienda")

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - escritorio */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <Pickaxe className="h-6 w-6 text-primary" />
          <span className="font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wider text-foreground">
            Admin
          </span>
        </div>

        <AdminNav />

        <div className="flex flex-col gap-1 border-t border-border p-3">
          <AdminUserMenu email={user.email} />
          <Link
            href="/tienda"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Header - móvil */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <Pickaxe className="h-5 w-5 text-primary" />
            <span className="font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wider text-foreground">
              Admin
            </span>
          </div>
          <AdminMobileNav />
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
