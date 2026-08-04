"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { ComponentProps } from "react"

export function SubmitButton({
  children,
  pendingLabel,
  ...props
}: ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <Spinner className="mr-1.5" />}
      {pending ? pendingLabel ?? "Guardando..." : children}
    </Button>
  )
}
