import { z } from "zod"

/**
 * z.coerce.number() no sirve aquí: Number("") es 0, así que un precio vacío
 * se guardaría como 0 en vez de fallar. Estos helpers distinguen "vacío" de
 * "inválido" antes de que zod vea el valor.
 */
export const requiredNumber = (msg = "Debe ser un número válido") =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : Number(v)),
    z.number({ required_error: msg, invalid_type_error: msg }).finite(msg).nonnegative(msg)
  )

export const optionalNumber = () =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : Number(v)),
    z.number().finite("Debe ser un número válido").nonnegative("Debe ser un número válido").nullable()
  )

export const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean())

export const optionalText = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().nullable()
)

// Rango Unicode de diacríticos combinantes (U+0300–U+036F), construido desde
// los puntos de código para evitar caracteres combinantes literales en el
// código fuente.
const COMBINING_DIACRITICS = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  "g"
)

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
