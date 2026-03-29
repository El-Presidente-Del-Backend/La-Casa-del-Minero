"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    setLoading(true)
    await deleteProduct(id)
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}
