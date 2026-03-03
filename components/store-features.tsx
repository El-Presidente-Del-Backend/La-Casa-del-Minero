import { ShieldCheck, Truck, BadgeCheck, CircleDollarSign } from "lucide-react"

const features = [
  {
    icon: BadgeCheck,
    title: "Calidad",
    description: "Productos certificados",
  },
  {
    icon: ShieldCheck,
    title: "Pago seguro",
    description: "Transacciones protegidas",
  },
  {
    icon: Truck,
    title: "Envío rápido",
    description: "Despacho en 24-48hrs",
  },
  {
    icon: CircleDollarSign,
    title: "Mejores precios",
    description: "Precios competitivos del mercado",
  },
]

export function StoreFeatures() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
