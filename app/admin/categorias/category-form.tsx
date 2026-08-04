"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/admin/image-upload"
import { SubmitButton } from "@/components/admin/submit-button"
import { FieldError } from "@/components/admin/field-error"
import { createCategory, updateCategory } from "@/app/actions/admin"
import { idleState } from "@/lib/action-state"
import type { CategoryRecord } from "@/lib/products"

export function CategoryForm({
  category,
  onClose,
}: {
  category?: CategoryRecord
  onClose: () => void
}) {
  const action = category ? updateCategory.bind(null, category.id) : createCategory
  const [state, formAction] = useActionState(action, idleState)

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message)
      onClose()
    } else if (state.status === "error") {
      toast.error(state.message)
    }
    // Se dispara una vez por envío: onClose no debe re-ejecutar el efecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const errors = state.fieldErrors

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          {category ? "Editar Categoría" : "Nueva Categoría"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre interno *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Seguridad"
              defaultValue={category?.name ?? ""}
              aria-invalid={!!errors?.name}
              required
            />
            <FieldError messages={errors?.name} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="label">Nombre visible *</Label>
            <Input
              id="label"
              name="label"
              placeholder="Ej: Seguridad Industrial"
              defaultValue={category?.label ?? ""}
              aria-invalid={!!errors?.label}
              required
            />
            <FieldError messages={errors?.label} />
          </div>
          <ImageUpload label="Imagen de categoría" defaultValue={category?.image_url ?? ""} folder="categories" />
        </div>
        <SubmitButton className="gap-2 self-start" pendingLabel="Guardando...">
          <Check className="h-4 w-4" />
          {category ? "Guardar" : "Crear"}
        </SubmitButton>
      </form>
    </div>
  )
}
