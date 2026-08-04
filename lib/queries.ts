import { unstable_cache } from 'next/cache'
import { adminDb } from '@/lib/firebase/admin'
import { PLACEHOLDER_IMAGE, type CategoryRecord, type Product } from '@/lib/products'

// ---------------------------------------------------------------------------
// Documento de Firestore → Product
// ---------------------------------------------------------------------------

interface ProductDoc {
  name?: string
  description?: string
  longDescription?: string
  price?: number
  originalPrice?: number | null
  categoryId?: string | null
  categoryName?: string
  imageUrl?: string
  badge?: string | null
  inStock?: boolean
  sku?: string
  specs?: { label: string; value: string }[]
  createdAt?: FirebaseFirestore.Timestamp | null
}

interface CategoryDoc {
  name?: string
  slug?: string
  label?: string
  imageUrl?: string | null
}

function toProduct(id: string, doc: ProductDoc): Product {
  return {
    id,
    name: doc.name ?? '',
    description: doc.description ?? '',
    longDescription: doc.longDescription ?? '',
    price: doc.price ?? 0,
    ...(doc.originalPrice != null ? { originalPrice: doc.originalPrice } : {}),
    category: doc.categoryName ?? '',
    image: doc.imageUrl || PLACEHOLDER_IMAGE,
    ...(doc.badge ? { badge: doc.badge } : {}),
    inStock: doc.inStock ?? true,
    sku: doc.sku ?? '',
    specs: doc.specs ?? [],
  }
}

function toCategory(id: string, doc: CategoryDoc): CategoryRecord {
  return {
    id,
    name: doc.name ?? '',
    slug: doc.slug ?? '',
    label: doc.label ?? doc.name ?? '',
    image_url: doc.imageUrl ?? null,
  }
}

/**
 * Se ordena en memoria en lugar de con `orderBy('createdAt')`: Firestore excluye
 * de una consulta ordenada los documentos que no tengan ese campo, y un
 * producto sin `createdAt` desaparecería de la tienda sin dejar rastro.
 */
function byNewest(a: { createdAt: number }, b: { createdAt: number }) {
  return b.createdAt - a.createdAt
}

function createdAtMillis(doc: ProductDoc): number {
  return doc.createdAt?.toMillis() ?? 0
}

// ---------------------------------------------------------------------------
// Lecturas cacheadas
// ---------------------------------------------------------------------------

export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const snapshot = await adminDb.collection('products').get()

      return snapshot.docs
        .map((doc) => {
          const data = doc.data() as ProductDoc
          return { product: toProduct(doc.id, data), createdAt: createdAtMillis(data) }
        })
        .sort(byNewest)
        .map((entry) => entry.product)
    } catch (error) {
      console.error('getProducts error:', error)
      return []
    }
  },
  ['products'],
  { revalidate: 60 }
)

export const getProductById = unstable_cache(
  async (id: string): Promise<Product | undefined> => {
    try {
      const doc = await adminDb.collection('products').doc(id).get()
      if (!doc.exists) return undefined

      return toProduct(doc.id, doc.data() as ProductDoc)
    } catch (error) {
      console.error('getProductById error:', error)
      return undefined
    }
  },
  ['product-by-id'],
  { revalidate: 60 }
)

export const getRelatedProducts = unstable_cache(
  async (productId: string, limit = 4): Promise<Product[]> => {
    try {
      const current = await adminDb.collection('products').doc(productId).get()
      if (!current.exists) return []

      const categoryId = (current.data() as ProductDoc).categoryId
      if (!categoryId) return []

      // Se pide uno de más porque el propio producto entra en el resultado y se
      // descarta después: filtrarlo en la consulta exigiría un índice compuesto.
      const snapshot = await adminDb
        .collection('products')
        .where('categoryId', '==', categoryId)
        .limit(limit + 1)
        .get()

      return snapshot.docs
        .filter((doc) => doc.id !== productId)
        .slice(0, limit)
        .map((doc) => toProduct(doc.id, doc.data() as ProductDoc))
    } catch (error) {
      console.error('getRelatedProducts error:', error)
      return []
    }
  },
  ['related-products'],
  { revalidate: 60 }
)

export const getCategories = unstable_cache(
  async (): Promise<CategoryRecord[]> => {
    try {
      const snapshot = await adminDb.collection('categories').get()

      return snapshot.docs
        .map((doc) => toCategory(doc.id, doc.data() as CategoryDoc))
        .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    } catch (error) {
      console.error('getCategories error:', error)
      return []
    }
  },
  ['categories'],
  { revalidate: 60 }
)
