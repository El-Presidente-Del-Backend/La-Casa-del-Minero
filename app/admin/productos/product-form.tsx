"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiImageUpload } from "@/components/admin/multi-image-upload"
import { FieldError } from "@/components/admin/field-error"
import { SubmitButton } from "@/components/admin/submit-button"
import { idleState, type ActionState } from "@/lib/action-state"

type Category = { id: string; name: string }
type Spec = { label: string; value: string }
type SpecRow = Spec & { id: string }

type ProductData = {
  name?: string
  description?: string
  long_description?: string
  price?: number
  original_price?: number | null
  category_id?: string
  image_urls?: string[]
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
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  submitLabel: string
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(action, idleState)

  // Ids estables (no el índice de la fila) para que borrar una fila intermedia
  // no desplace los valores de las siguientes: ver el bug que esto reemplaza
  // en el historial de este archivo.
  const nextId = useRef(0)
  const makeRow = (spec?: Spec): SpecRow => ({
    id: `spec-${nextId.current++}`,
    label: spec?.label ?? "",
    value: spec?.value ?? "",
  })
  const [rows, setRows] = useState<SpecRow[]>(() =>
    defaultValues?.specs?.length ? defaultValues.specs.map((s) => makeRow(s)) : [makeRow()]
  )

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message)
      if (state.redirectTo) router.push(state.redirectTo)
    } else if (state.status === "error") {
      toast.error(state.message)
    }
  }, [state, router])

  const addRow = () => setRows((prev) => [...prev, makeRow()])
  const removeRow = (id: string) =>
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id)
      return next.length ? next : [makeRow()]
    })
  const updateRow = (id: string, field: "label" | "value", value: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const errors = state.fieldErrors

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} aria-invalid={!!errors?.name} required />
          <FieldError messages={errors?.name} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" name="sku" defaultValue={defaultValues?.sku} aria-invalid={!!errors?.sku} required />
          <FieldError messages={errors?.sku} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción corta *</Label>
        <Input
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          aria-invalid={!!errors?.description}
          required
        />
        <FieldError messages={errors?.description} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="long_description">Descripción larga</Label>
        <Textarea
          id="long_description"
          name="long_description"
          rows={4}
          defaultValue={defaultValues?.long_description}
          aria-invalid={!!errors?.long_description}
        />
        <FieldError messages={errors?.long_description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={defaultValues?.price}
            aria-invalid={!!errors?.price}
            required
          />
          <FieldError messages={errors?.price} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="original_price">Precio original</Label>
          <Input
            id="original_price"
            name="original_price"
            type="number"
            step="0.01"
            defaultValue={defaultValues?.original_price ?? ""}
            aria-invalid={!!errors?.original_price}
          />
          <FieldError messages={errors?.original_price} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category_id">Categoría *</Label>
          <Select name="category_id" defaultValue={defaultValues?.category_id}>
            <SelectTrigger id="category_id" className="w-full" aria-invalid={!!errors?.category_id}>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError messages={errors?.category_id} />
        </div>
      </div>

      <MultiImageUpload label="Imágenes del producto" defaultValue={defaultValues?.image_urls} folder="products" />

      <div className="flex flex-col gap-2 sm:w-1/2">
        <Label htmlFor="badge">Badge</Label>
        <Input id="badge" name="badge" defaultValue={defaultValues?.badge ?? ""} placeholder="Ej: Nuevo, Oferta, Premium" />
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

      {/* Especificaciones dinámicas */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Especificaciones</Label>
          <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1 text-xs">
            <Plus className="h-3 w-3" /> Agregar
          </Button>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-2">
            <Input
              name="spec_label"
              placeholder="Etiqueta"
              value={row.label}
              onChange={(e) => updateRow(row.id, "label", e.target.value)}
              className="flex-1"
            />
            <Input
              name="spec_value"
              placeholder="Valor"
              value={row.value}
              onChange={(e) => updateRow(row.id, "value", e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(row.id)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
        <FieldError messages={errors?.specs} />
      </div>

      <SubmitButton size="lg" className="self-start">
        {submitLabel}
      </SubmitButton>
    </form>
  )
}
