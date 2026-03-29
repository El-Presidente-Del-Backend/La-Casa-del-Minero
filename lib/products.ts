// Types and constants — safe for client and server components

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
