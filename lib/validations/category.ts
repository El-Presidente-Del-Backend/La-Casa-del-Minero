import { z } from "zod"
import { optionalText } from "./form"

export const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre interno debe tener al menos 2 caracteres").max(60),
  label: z.string().trim().min(2, "El nombre visible debe tener al menos 2 caracteres").max(80),
  image_url: z.string().trim().default(""),
  parent_id: optionalText,
})

export type CategoryInput = z.infer<typeof categorySchema>

export function categoryFormToRaw(formData: FormData): unknown {
  const rawParent = formData.get("parent_id")
  return {
    name: formData.get("name"),
    label: formData.get("label"),
    image_url: formData.get("image_url") ?? "",
    // "none" es el sentinel del <Select>: Radix no permite un SelectItem con
    // value="", así que "Ninguna" se representa con este string y se traduce
    // aquí a "" para que optionalText lo convierta en null.
    parent_id: rawParent === "none" ? "" : (rawParent ?? ""),
  }
}
