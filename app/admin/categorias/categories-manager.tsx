"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { deleteCategory } from "@/app/actions/admin"
import { CategoryForm } from "./category-form"
import type { CategoryRecord } from "@/lib/products"

export function CategoriesManager({ categories }: { categories: CategoryRecord[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
  }

  const editingCategory = categories.find((c) => c.id === editingId)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
          Categorías
        </h1>
        <Button
          className="gap-2"
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {(showForm || editingId) && (
        <CategoryForm key={editingId ?? "new"} category={editingCategory} onClose={closeForm} />
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No hay categorías
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      {cat.image_url && (
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="40px" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.label}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(cat.id)
                          setShowForm(false)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDeleteDialog
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`¿Eliminar la categoría "${cat.name}"?`}
                        description="Los productos de esta categoría quedarán sin categoría."
                        action={deleteCategory.bind(null, cat.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
