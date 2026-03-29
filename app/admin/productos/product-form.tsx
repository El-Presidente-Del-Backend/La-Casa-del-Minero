"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Category = { id: string; name: string }
type Spec = { label: string; value: string }

type ProductData = {
  name?: string
  description?: string
  long_description?: string
  price?: number
  original_price?: number | null
  category_id?: string
  image_url?: string
  badge?: string | null
  in_stock?: boolean
  sku?: string
  specs?: Spec[]
}

export function ProductForm({
  categories,
  defaultValues,
  action,
  submitLabel,
}: {
  categories: Category[]
  defaultValues?: ProductData
  action: (formData: FormData) => void
  submitLabel: string
}) {
  const [specs, setSpecs] = useState<Spec[]>(defaultValues?.specs ?? [{ label: "", value: "" }])

  const addSpec = () => setSpecs([...specs, { label: "", value: "" }])
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" name="sku" defaultValue={defaultValues?.sku} required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción corta *</Label>
        <Input id="description" name="description" defaultValue={defaultValues?.description} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="long_description">Descripción larga</Label>
        <textarea
          id="long_description"
          name="long_description"
          rows={4}
          defaultValue={defaultValues?.long_description}
          className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Precio *</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues?.price} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="original_price">Precio original</Label>
          <Input id="original_price" name="original_price" type="number" step="0.01" defaultValue={defaultValues?.original_price ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category_id">Categoría *</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={defaultValues?.category_id}
            required
            className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Seleccionar...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="image_url">URL de imagen</Label>
          <Input id="image_url" name="image_url" defaultValue={defaultValues?.image_url} placeholder="/images/products/..." />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="badge">Badge</Label>
          <Input id="badge" name="badge" defaultValue={defaultValues?.badge ?? ""} placeholder="Ej: Nuevo, Oferta, Premium" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="in_stock"
          name="in_stock"
          defaultChecked={defaultValues?.in_stock ?? true}
          className="h-4 w-4 rounded border-border"
        />
        <Label htmlFor="in_stock">En stock</Label>
      </div>

      {/* Dynamic specs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Especificaciones</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSpec} className="gap-1 text-xs">
            <Plus className="h-3 w-3" /> Agregar
          </Button>
        </div>
        {specs.map((spec, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              name="spec_label"
              placeholder="Etiqueta"
              defaultValue={spec.label}
              className="flex-1"
            />
            <Input
              name="spec_value"
              placeholder="Valor"
              defaultValue={spec.value}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeSpec(i)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" size="lg" className="self-start">
        {submitLabel}
      </Button>
    </form>
  )
}
