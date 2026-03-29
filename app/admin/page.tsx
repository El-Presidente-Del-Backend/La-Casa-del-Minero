import { Package, Tags, AlertTriangle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: categoryCount },
    { count: outOfStockCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("in_stock", false),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Productos", value: productCount ?? 0, icon: Package, color: "text-blue-500" },
    { label: "Categorías", value: categoryCount ?? 0, icon: Tags, color: "text-green-500" },
    { label: "Sin stock", value: outOfStockCount ?? 0, icon: AlertTriangle, color: "text-yellow-500" },
    { label: "Usuarios", value: userCount ?? 0, icon: Users, color: "text-purple-500" },
  ]

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
        Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
