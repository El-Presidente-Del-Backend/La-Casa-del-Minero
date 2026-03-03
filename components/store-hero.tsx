import Image from "next/image"
import { Button } from "@/components/ui/button"

export function StoreHero() {
  return (
    <section className="relative overflow-hidden bg-card">
      <div className="relative h-[280px] md:h-[360px]">
        <Image
          src="/images/store-banner.jpg"
          alt="Equipos de minería pesada en operación"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4">
          <div className="max-w-lg">
            <span className="inline-block rounded bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
              Lo mejor para minería
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-5xl">
              Equipos y suministros profesionales
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Todo lo que necesitas para tu operación minera con la mejor calidad y precios competitivos.
            </p>
            <Button className="mt-5 uppercase tracking-wide" size="lg">
              Ver catálogo completo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
