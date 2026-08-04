"use client"

import { useActionState, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SubmitButton } from "@/components/admin/submit-button"
import { idleState, type ActionState } from "@/lib/action-state"

export function ConfirmDeleteDialog({
  trigger,
  title,
  description,
  action,
  confirmLabel = "Eliminar",
}: {
  trigger: ReactNode
  title: string
  description: string
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  confirmLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(action, idleState)

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message)
      setOpen(false)
    } else if (state.status === "error") {
      toast.error(state.message)
    }
  }, [state])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction}>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
            <SubmitButton variant="destructive" pendingLabel="Eliminando...">
              {confirmLabel}
            </SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
