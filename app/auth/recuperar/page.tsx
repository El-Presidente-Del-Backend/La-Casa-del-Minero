"use client"

import { useState } from "react"
import Link from "next/link"
import { Pickaxe, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function RecuperarPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/tienda" className="mx-auto mb-4 flex items-center gap-2">
              <Pickaxe className="h-8 w-8 text-primary" />
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wider text-foreground">
                La Casa del Minero
              </span>
            </Link>
            <CardTitle className="text-xl">Correo enviado</CardTitle>
            <CardDescription>
              Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Volver a iniciar sesión
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/tienda" className="mx-auto mb-4 flex items-center gap-2">
            <Pickaxe className="h-8 w-8 text-primary" />
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wider text-foreground">
              La Casa del Minero
            </span>
          </Link>
          <CardTitle className="text-xl">Recuperar Contraseña</CardTitle>
          <CardDescription>Te enviaremos un enlace para restablecer tu contraseña</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
            <Link href="/auth/login" className="text-center text-sm text-primary hover:underline">
              Volver a iniciar sesión
            </Link>
            <Link href="/tienda" className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" />
              Volver a la tienda
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
