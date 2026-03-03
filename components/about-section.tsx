import Image from "next/image"
import { ShieldCheck, Truck, Award, Users } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Calidad Garantizada",
    description:
      "Todos nuestros productos cumplen con los estándares internacionales de seguridad y calidad para la industria minera.",
  },
  {
    icon: Truck,
    title: "Entrega Oportuna",
    description:
      "Contamos con logística propia para asegurar que tus suministros lleguen cuando los necesitas, sin demoras.",
  },
  {
    icon: Award,
    title: "Experiencia",
    description:
      "Más de 15 años en el sector nos respaldan. Conocemos las necesidades reales de la operación minera.",
  },
  {
    icon: Users,
    title: "Asesoría Especializada",
    description:
      "Nuestro equipo técnico te guía para elegir los productos adecuados para cada etapa de tu proyecto.",
  },
]

export function AboutSection() {
  return (
    <section id="conocenos" className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Conócenos
          </p>
          <h2 className="font-[var(--font-heading)] text-4xl font-bold uppercase tracking-tight text-card-foreground md:text-5xl">
            Compromiso con la industria
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src="/images/about-mining.jpg"
              alt="Almacén de productos mineros con equipos de seguridad"
              width={700}
              height={500}
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-border/20" />
          </div>

          {/* Text content */}
          <div>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              En <span className="font-semibold text-foreground">La Casa del Minero</span>, nos dedicamos a proveer
              los mejores productos y equipos para la industria minera. Desde herramientas de perforación
              hasta equipos de protección personal, trabajamos con las marcas más reconocidas del sector
              para garantizar la seguridad y eficiencia de cada operación.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Nuestra misión es ser el socio estratégico que toda empresa minera necesita,
              ofreciendo no solo productos de primera línea, sino también el conocimiento técnico
              para sacar el máximo provecho de cada inversión.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary/50"
            >
              <feature.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-[var(--font-heading)] text-lg font-semibold uppercase tracking-wide text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
