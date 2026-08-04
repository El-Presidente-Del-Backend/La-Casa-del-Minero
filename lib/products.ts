// Types and constants — safe for client and server components

/** Imagen mostrada cuando un producto no tiene una propia. */
export const PLACEHOLDER_IMAGE = '/images/products/placeholder.jpg'

export type Product = {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  category: string
  image: string
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
