"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

type Category = {
  id: string
  name: string
  slug: string
  label: string
  image_url: string | null
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name")
    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleCreate = async (formData: FormData) => {
    await createCategory(formData)
    setShowForm(false)
    fetchCategories()
    router.refresh()
  }

  const handleUpdate = async (formData: FormData) => {
    if (!editingId) return
    await updateCategory(editingId, formData)
    setEditingId(null)
    fetchCategories()
    router.refresh()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los productos de esta categoría quedarán sin categoría.`)) return
    await deleteCategory(id)
    fetchCategories()
    router.refresh()
  }

  const editingCategory = categories.find((c) => c.id === editingId)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-foreground">
          Categorías
        </h1>
        <Button className="gap-2" onClick={() => { setShowForm(true); setEditingId(null) }}>
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Create / Edit form */}
      {(showForm || editingId) && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {editingId ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingId(null) }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form action={editingId ? handleUpdate : handleCreate} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nombre interno *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej: Seguridad"
                  defaultValue={editingCategory?.name ?? ""}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="label">Nombre visible *</Label>
                <Input
                  id="label"
                  name="label"
                  placeholder="Ej: Seguridad Industrial"
                  defaultValue={editingCategory?.label ?? ""}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="image_url">URL de imagen</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  placeholder="/images/categories/..."
                  defaultValue={editingCategory?.image_url ?? ""}
                />
              </div>
            </div>
            <Button type="submit" className="gap-2 self-start">
              <Check className="h-4 w-4" />
              {editingId ? "Guardar" : "Crear"}
            </Button>
          </form>
        </div>
      )}

      {/* Categories table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Label</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Imagen</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Cargando...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No hay categorías</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{cat.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{cat.label}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{cat.slug}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{cat.image_url || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingId(cat.id); setShowForm(false) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id, cat.name)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
