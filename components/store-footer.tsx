import Link from "next/link"
import { Pickaxe, Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Envío rápido",
    description: "Despacho en 24-48 horas hábiles a todo el país",
  },
  {
    icon: ShieldCheck,
    title: "Garantía incluida",
    description: "Todos nuestros productos cuentan con garantía",
  },
  {
    icon: CreditCard,
    title: "Pago seguro",
    description: "Múltiples métodos de pago protegidos",
  },
  {
    icon: Headphones,
    title: "Soporte técnico",
    description: "Asesoría especializada en minería",
  },
]

export function StoreFooter() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Features bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{feature.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/tienda" className="inline-flex items-center gap-2">
              <Pickaxe className="h-6 w-6 text-primary" />
              <span className="font-[family-name:var(--font-heading)] text-base font-bold uppercase tracking-wider text-card-foreground">
                La Casa del Minero
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Tu proveedor de confianza en equipos y suministros para la industria minera.
            </p>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-card-foreground">
              Categorías
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {["Seguridad", "Herramientas", "Iluminación", "Detección"].map((cat) => (
                <li key={cat}>
                  <Link
                    href="/tienda"
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-card-foreground">
              Información
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {["Términos y condiciones", "Política de privacidad", "Devoluciones", "Preguntas frecuentes"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-xs text-muted-foreground transition-colors hover:text-primary cursor-pointer">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-card-foreground">
              Contacto
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-xs text-muted-foreground">+56 2 2345 6789</li>
              <li className="text-xs text-muted-foreground">ventas@La Casa del Minero.cl</li>
              <li>
                <Link
                  href="/"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Sitio principal
                </Link>
              </li>
              <li>
                <Link
                  href="/#local"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Nuestro local
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {"© 2026 La Casa del Minero. Todos los derechos reservados."}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Transferencia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
