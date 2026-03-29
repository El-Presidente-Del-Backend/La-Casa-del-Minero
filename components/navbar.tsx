"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Conócenos", href: "#conocenos" },
  { label: "Nuestro Local", href: "#local" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-2">
          <Image src="/casco.png" alt="La Casa del Minero" width={200} height={85} className="h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Button asChild size="sm" className="gap-2 uppercase tracking-wide">
              <Link href="/tienda">
                Tienda Online
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button asChild className="w-full gap-2 uppercase tracking-wide">
                <Link href="/tienda" onClick={() => setMobileOpen(false)}>
                  Tienda Online
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
