// Types and constants — safe for client and server components

/** Imagen mostrada cuando un producto no tiene una propia. */
export const PLACEHOLDER_IMAGE = '/images/products/placeholder.jpg'

/**
 * Resuelve el array de imágenes de un producto con compatibilidad hacia atrás:
 * los documentos creados antes de soportar múltiples imágenes solo tienen
 * `imageUrl` (string). No hay migración de datos — esto permite que sigan
 * funcionando hasta que se editen y queden con `images` propio.
 */
export function resolveProductImages(images?: string[], legacyImageUrl?: string | null): string[] {
  if (images && images.length > 0) return images
  if (legacyImageUrl) return [legacyImageUrl]
  return [PLACEHOLDER_IMAGE]
}

export type Product = {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  badge?: string
  inStock: boolean
  sku: string
  specs: { label: string; value: string }[]
}

export type CategoryRecord = {
  id: string
  name: string
  slug: string
  label: string
  image_url: string | null
}
