"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Empty className="min-h-[60vh]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangle />
        </EmptyMedia>
        <EmptyTitle>Ocurrió un error</EmptyTitle>
        <EmptyDescription>
          No se pudo cargar esta sección del panel. Puedes intentarlo de nuevo.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={reset}>Reintentar</Button>
      </EmptyContent>
    </Empty>
  )
}
