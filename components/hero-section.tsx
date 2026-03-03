import Image from "next/image"
import { ArrowDown } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="inicio" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-mining.jpg"
          alt="Operación minera con maquinaria pesada"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Equipos & Suministros Mineros
        </p>
        <h1 className="font-[var(--font-heading)] text-5xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
          Tu aliado en{" "}
          <span className="text-primary">minería</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Proveemos herramientas, equipos de seguridad y suministros industriales
          de la más alta calidad para operaciones mineras de todos los tamaños.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#conocenos"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Descubre más
          </Link>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 rounded-md border border-border px-8 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-5 w-5 text-muted-foreground" />
      </div>
    </section>
  )
}
