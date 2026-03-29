import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/static'
import type { Product, Category } from '@/lib/products'

// ---------------------------------------------------------------------------
// Supabase row → Product transformer
// ---------------------------------------------------------------------------

interface SupabaseProductRow {
  id: string
  name: string
  description: string
  long_description: string
  price: number
  original_price: number | null
  category_id: string
  image_url: string
  badge: string | null
  in_stock: boolean
  sku: string
  categories: { name: string } | null
  product_specs: { label: string; value: string }[]
}

function toProduct(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    price: row.price,
    ...(row.original_price != null ? { originalPrice: row.original_price } : {}),
    category: row.categories?.name ?? "",
    image: row.image_url,
    ...(row.badge != null ? { badge: row.badge } : {}),
    inStock: row.in_stock,
    sku: row.sku,
    specs: row.product_specs ?? [],
  }
}

const PRODUCT_SELECT = `
  *,
  categories(name),
  product_specs(label, value)
` as const

const supabase = createStaticClient()

// ---------------------------------------------------------------------------
// Cached data-fetching functions
// ---------------------------------------------------------------------------

export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)

    if (error) {
      console.error('getProducts error:', error.message)
      return []
    }

    return (data as unknown as SupabaseProductRow[]).map(toProduct)
  },
  ['products'],
  { revalidate: 60 }
)

export const getProductById = unstable_cache(
  async (id: string): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('getProductById error:', error?.message)
      return undefined
    }

    return toProduct(data as unknown as SupabaseProductRow)
  },
  ['product-by-id'],
  { revalidate: 60 }
)

export const getRelatedProducts = unstable_cache(
  async (productId: string, limit = 4): Promise<Product[]> => {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('category_id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      console.error('getRelatedProducts error (lookup):', productError?.message)
      return []
    }

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('category_id', product.category_id)
      .neq('id', productId)
      .limit(limit)

    if (error) {
      console.error('getRelatedProducts error:', error.message)
      return []
    }

    return (data as unknown as SupabaseProductRow[]).map(toProduct)
  },
  ['related-products'],
  { revalidate: 60 }
)

export const getCategories = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, label, image_url')

    if (error) {
      console.error('getCategories error:', error.message)
      return []
    }

    return data
  },
  ['categories'],
  { revalidate: 60 }
)
