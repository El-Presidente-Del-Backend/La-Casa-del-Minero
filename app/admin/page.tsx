import Link from "next/link"
import Image from "next/image"
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ImageOff,
  ListX,
  Package,
  PackageX,
  Plus,
  Store,
  Tag,
  Tags,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/admin/stat-card"
import { CategoryChart } from "@/components/admin/category-chart"
import { getAdminDashboard, type AlertGroup } from "@/lib/admin-queries"

export default async function AdminDashboard() {
  const { totals, distribution, latest, alerts } = await getAdminDashboard()

  const outOfStockPct = totals.products > 0 ? Math.round((totals.outOfStock / totals.products) * 100) : 0

  const alertGroups: { key: string; label: string; icon: LucideIcon; group: AlertGroup }[] = [
    { key: "outOfStock", label: "Sin stock", icon: PackageX, group: alerts.outOfStock },
    { key: "missingImage", label: "Sin imagen", icon: ImageOff, group: alerts.missingImage },
    { key: "missingCategory", label: "Sin categoría", icon: Tag, group: alerts.missingCategory },
    { key: "missingSpecs", label: "Sin specs", icon: ListX, group: alerts.missingSpecs },
  ]
  const firstPending = alertGroups.find((g) => g.group.total > 0)
  const allClear = !firstPending

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
        Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Productos"
          value={totals.products}
          hint={`${totals.withDiscount} con descuento`}
          icon={Package}
          tone="text-blue-500"
        />
        <StatCard label="Categorías" value={totals.categories} icon={Tags} tone="text-green-500" />
        <StatCard
          label="Sin stock"
          value={totals.outOfStock}
          hint={`${outOfStockPct}% del catálogo`}
          icon={AlertTriangle}
          tone="text-yellow-500"
        />
        <StatCard
          label="Valor de inventario"
          value={`$${totals.inventoryValue.toLocaleString("es-CL")}`}
          hint="Precio de catálogo, sin cantidades"
          icon={DollarSign}
          tone="text-primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Productos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart distribution={distribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            {allClear ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                Todo en orden
              </div>
            ) : (
              <Tabs defaultValue={firstPending?.key ?? alertGroups[0].key}>
                <TabsList className="grid w-full grid-cols-4">
                  {alertGroups.map((g) => (
                    <TabsTrigger key={g.key} value={g.key} className="gap-1 px-1 text-xs" title={g.label}>
                      <g.icon className="h-3.5 w-3.5" />
                      {g.group.total > 0 && (
                        <Badge variant="secondary" className="px-1 text-[10px]">
                          {g.group.total}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {alertGroups.map((g) => (
                  <TabsContent key={g.key} value={g.key} className="mt-3">
                    {g.group.total === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">Sin pendientes</p>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {g.group.items.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`/admin/productos/${p.id}/editar`}
                              className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                            >
                              <span className="truncate text-foreground">{p.name}</span>
                              <span className="shrink-0 text-xs text-muted-foreground">{p.sku}</span>
                            </Link>
                          </li>
                        ))}
                        {g.group.total > g.group.items.length && (
                          <li className="px-2 pt-1 text-xs text-muted-foreground">
                            y {g.group.total - g.group.items.length} más
                          </li>
                        )}
                      </ul>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimos productos añadidos</CardTitle>
          </CardHeader>
          <CardContent>
            {latest.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay productos.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {latest.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin/productos/${p.id}/editar`}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.categoryName || "Sin categoría"}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-foreground">
                        ${p.price.toLocaleString("es-CL")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/admin/productos/nuevo">
              <Button className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Nuevo producto
              </Button>
            </Link>
            <Link href="/admin/categorias">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Tags className="h-4 w-4" />
                Nueva categoría
              </Button>
            </Link>
            <Link href="/tienda">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Store className="h-4 w-4" />
                Ver tienda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
