"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { deleteProduct } from "@/app/actions/admin"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmDeleteDialog
      trigger={
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
      title={`¿Eliminar "${name}"?`}
      description="Esta acción no se puede deshacer."
      action={deleteProduct.bind(null, id)}
    />
  )
}
