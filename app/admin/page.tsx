import { Package, Tags, AlertTriangle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adminDb } from "@/lib/firebase/admin"

// Las agregaciones count() de Firestore devuelven el total sin descargar los
// documentos, igual que hacía el `head: true` de Supabase.
async function countDocs(query: FirebaseFirestore.Query): Promise<number> {
  const snapshot = await query.count().get()
  return snapshot.data().count
}

export default async function AdminDashboard() {
  const [productCount, categoryCount, outOfStockCount, userCount] = await Promise.all([
    countDocs(adminDb.collection("products")),
    countDocs(adminDb.collection("categories")),
    countDocs(adminDb.collection("products").where("inStock", "==", false)),
    countDocs(adminDb.collection("users")),
  ])

  const stats = [
    { label: "Productos", value: productCount, icon: Package, color: "text-blue-500" },
    { label: "Categorías", value: categoryCount, icon: Tags, color: "text-green-500" },
    { label: "Sin stock", value: outOfStockCount, icon: AlertTriangle, color: "text-yellow-500" },
    { label: "Usuarios", value: userCount, icon: Users, color: "text-purple-500" },
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
