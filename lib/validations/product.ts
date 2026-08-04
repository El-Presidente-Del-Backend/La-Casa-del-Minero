import { z } from "zod"
import { checkbox, optionalNumber, optionalText, requiredNumber } from "./form"

export const MAX_PRODUCT_IMAGES = 6

export const specSchema = z.object({
  label: z.string().trim().min(1, "La etiqueta no puede estar vacía"),
  value: z.string().trim().min(1, "El valor no puede estar vacío"),
})

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(120),
    sku: z.string().trim().min(1, "El SKU es obligatorio").max(60),
    description: z.string().trim().min(1, "La descripción corta es obligatoria").max(300),
    long_description: z.string().trim().max(4000).default(""),
    price: requiredNumber("El precio debe ser un número válido"),
    original_price: optionalNumber(),
    category_id: z.string().trim().min(1, "Selecciona una categoría"),
    image_urls: z
      .array(z.string().trim().min(1))
      .max(MAX_PRODUCT_IMAGES, `Máximo ${MAX_PRODUCT_IMAGES} imágenes`)
      .default([]),
    badge: optionalText,
    in_stock: checkbox,
    specs: z.array(specSchema).default([]),
  })
  .refine((d) => d.original_price == null || d.original_price > d.price, {
    message: "El precio original debe ser mayor que el precio actual",
    path: ["original_price"],
  })

export type ProductInput = z.infer<typeof productSchema>

/**
 * Object.fromEntries(formData) descarta los campos repetidos, así que las
 * specs (spec_label / spec_value) se reconstruyen aparte con getAll(). Filas
 * totalmente vacías se descartan antes de validar; filas a medias sí fallan.
 */
export function productFormToRaw(formData: FormData): unknown {
  const labels = formData.getAll("spec_label") as string[]
  const values = formData.getAll("spec_value") as string[]

  const specs = labels
    .map((label, i) => ({ label: label ?? "", value: values[i] ?? "" }))
    .filter((s) => s.label.trim() !== "" || s.value.trim() !== "")

  return {
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    long_description: formData.get("long_description") ?? "",
    price: formData.get("price"),
    original_price: formData.get("original_price"),
    category_id: formData.get("category_id"),
    image_urls: formData.getAll("image_urls"),
    badge: formData.get("badge"),
    in_stock: formData.get("in_stock"),
    specs,
  }
}
