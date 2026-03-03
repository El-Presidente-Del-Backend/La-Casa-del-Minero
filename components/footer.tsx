import Link from "next/link"
import { Pickaxe } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Pickaxe className="h-6 w-6 text-primary" />
            <span className="font-[var(--font-heading)] text-lg font-bold uppercase tracking-wider text-card-foreground">
              La Casa del Minero
            </span>
          </div>

          {/* Links */}
          <nav aria-label="Enlaces del pie de página">
            <ul className="flex flex-wrap items-center justify-center gap-6">
              <li>
                <Link
                  href="#inicio"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="#conocenos"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Conócenos
                </Link>
              </li>
              <li>
                <Link
                  href="#local"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Nuestro Local
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Tienda Online
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {"© 2026 La Casa del Minero. Todos los derechos reservados."}
          </p>
        </div>
      </div>
    </footer>
  )
}
