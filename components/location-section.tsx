import Image from "next/image"
import { MapPin, Clock, Phone, Mail } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "Av. Irarrázabal 986, Illapel, Chile",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lunes a Viernes: 8:00 - 18:00 | Sábados: 8:00 - 13:00",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+56 9 1234 5678",
  },
  {
    icon: Mail,
    label: "Correo",
    value: "contacto@lacasadelminero.com",
  },
]

export function LocationSection() {
  return (
    <section id="local" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Nuestro Local
          </p>
          <h2 className="font-[var(--font-heading)] text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            Visítanos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Te esperamos en nuestro punto de venta para brindarte atención personalizada
            y mostrarte toda nuestra gama de productos.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Map Embed */}
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4029.827583918953!2d-71.15622662438417!3d-31.626616174165534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x968f2bb93eeb59c1%3A0xd2f58cc7b3a541ae!2sLa%20Casa%20del%20Minero%20SPA!5e1!3m2!1ses!2scl!4v1772489333263!5m2!1ses!2scl"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de La Casa del Minero en el mapa"
              className="w-full"
            />
          </div>

          {/* Contact Info + Store Image */}
          <div className="flex flex-col gap-8">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/images/store-front.jpg"
                alt="Fachada del local de La Casa del Minero"
                width={700}
                height={300}
                className="h-56 w-full object-cover lg:h-64"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-border/20" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-card-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


