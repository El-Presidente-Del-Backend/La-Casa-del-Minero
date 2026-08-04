import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre interno debe tener al menos 2 caracteres").max(60),
  label: z.string().trim().min(2, "El nombre visible debe tener al menos 2 caracteres").max(80),
  image_url: z.string().trim().default(""),
})

export type CategoryInput = z.infer<typeof categorySchema>

export function categoryFormToRaw(formData: FormData): unknown {
  return {
    name: formData.get("name"),
    label: formData.get("label"),
    image_url: formData.get("image_url") ?? "",
  }
}
