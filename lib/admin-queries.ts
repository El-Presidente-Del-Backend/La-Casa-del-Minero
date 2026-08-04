import { cache } from 'react'
import { adminDb } from '@/lib/firebase/admin'
import { PLACEHOLDER_IMAGE } from '@/lib/products'
import type { CategoryRecord } from '@/lib/products'
import type { OrderItem, OrderStatus } from '@/lib/orders'

/**
 * Lecturas del panel de administración. A diferencia de las de `lib/queries.ts`
 * no pasan por unstable_cache: tras crear o editar algo el admin tiene que ver
 * el resultado de inmediato, no la versión de hace hasta 60 segundos.
 */

export type CategoryOption = { id: string; name: string }

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const snapshot = await adminDb.collection('categories').get()

  return snapshot.docs
    .map((doc) => ({ id: doc.id, name: (doc.data().name as string) ?? '' }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export async function getAdminCategories(): Promise<CategoryRecord[]> {
  const snapshot = await adminDb.collection('categories').get()

  return snapshot.docs
    .map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: (data.name as string) ?? '',
        slug: (data.slug as string) ?? '',
        label: (data.label as string) ?? '',
        image_url: (data.imageUrl as string | null) ?? null,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

export type AdminSpec = { label: string; value: string }

export type AdminProduct = {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice: number | null
  categoryId: string | null
  categoryName: string
  imageUrl: string
  badge: string | null
  inStock: boolean
  sku: string
  specs: AdminSpec[]
  /** Milisegundos. 0 si el documento legacy no tiene createdAt. */
  createdAt: number
}

function toAdminProduct(id: string, data: FirebaseFirestore.DocumentData): AdminProduct {
  return {
    id,
    name: (data.name as string) ?? '',
    description: (data.description as string) ?? '',
    longDescription: (data.longDescription as string) ?? '',
    price: (data.price as number) ?? 0,
    originalPrice: (data.originalPrice as number | null) ?? null,
    categoryId: (data.categoryId as string | null) ?? null,
    categoryName: (data.categoryName as string) || '',
    imageUrl: (data.imageUrl as string) || PLACEHOLDER_IMAGE,
    badge: (data.badge as string | null) ?? null,
    inStock: (data.inStock as boolean) ?? true,
    sku: (data.sku as string) ?? '',
    specs: (data.specs as AdminSpec[]) ?? [],
    createdAt: data.createdAt?.toMillis?.() ?? 0,
  }
}

/**
 * Colección completa, ordenada en memoria por createdAt desc (ver
 * lib/queries.ts: orderBy() descartaría documentos legacy sin ese campo).
 * cache() de React deduplica dentro de un mismo render sin persistir entre
 * peticiones, así que no compromete la frescura que el resto del módulo exige.
 */
export const getAdminProducts = cache(async (): Promise<AdminProduct[]> => {
  const snapshot = await adminDb.collection('products').get()

  return snapshot.docs
    .map((doc) => toAdminProduct(doc.id, doc.data()))
    .sort((a, b) => b.createdAt - a.createdAt)
})

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const doc = await adminDb.collection('products').doc(id).get()
  if (!doc.exists) return null
  return toAdminProduct(doc.id, doc.data()!)
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------

export type AdminOrder = {
  id: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  customerUid: string | null
  customerEmail: string | null
  customerName: string
  customerPhone: string | null
  /** Milisegundos. */
  createdAt: number
  updatedAt: number
}

function toAdminOrder(id: string, data: FirebaseFirestore.DocumentData): AdminOrder {
  return {
    id,
    items: (data.items as OrderItem[]) ?? [],
    total: (data.total as number) ?? 0,
    status: (data.status as OrderStatus) ?? 'pendiente',
    customerUid: (data.customerUid as string | null) ?? null,
    customerEmail: (data.customerEmail as string | null) ?? null,
    customerName: (data.customerName as string) || 'Cliente',
    customerPhone: (data.customerPhone as string | null) ?? null,
    createdAt: data.createdAt?.toMillis?.() ?? 0,
    updatedAt: data.updatedAt?.toMillis?.() ?? 0,
  }
}

/** Mismo patrón que getAdminProducts: leer todo, ordenar en memoria por createdAt desc. */
export const getAdminOrders = cache(async (): Promise<AdminOrder[]> => {
  const snapshot = await adminDb.collection('orders').get()

  return snapshot.docs
    .map((doc) => toAdminOrder(doc.id, doc.data()))
    .sort((a, b) => b.createdAt - a.createdAt)
})

export async function getAdminOrderById(id: string): Promise<AdminOrder | null> {
  const doc = await adminDb.collection('orders').doc(id).get()
  if (!doc.exists) return null
  return toAdminOrder(doc.id, doc.data()!)
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export type CategoryDistribution = {
  categoryId: string | null
  label: string
  count: number
  value: number
}

export type ProductAlert = { id: string; name: string; sku: string }

/** `total` es el conteo real; `items` va recortado a MAX_ALERTS_PER_GROUP para la UI. */
export type AlertGroup = { total: number; items: ProductAlert[] }

export type AdminDashboard = {
  totals: {
    products: number
    categories: number
    inStock: number
    outOfStock: number
    inventoryValue: number
    withDiscount: number
    pendingOrders: number
  }
  distribution: CategoryDistribution[]
  latest: AdminProduct[]
  recentOrders: AdminOrder[]
  alerts: {
    outOfStock: AlertGroup
    missingImage: AlertGroup
    missingCategory: AlertGroup
    missingSpecs: AlertGroup
  }
}

const MAX_ALERTS_PER_GROUP = 5

function toAlert(p: AdminProduct): ProductAlert {
  return { id: p.id, name: p.name, sku: p.sku }
}

function toAlertGroup(products: AdminProduct[]): AlertGroup {
  return { total: products.length, items: products.slice(0, MAX_ALERTS_PER_GROUP).map(toAlert) }
}

/**
 * Deriva todo de un único .get() de products + categories: el valor de
 * inventario, la distribución por categoría y las alertas de datos
 * incompletos no son expresables con count() (Firestore no puede consultar
 * campos ausentes ni longitud de array). Con un catálogo de cientos de
 * productos el coste sigue siendo trivial frente a la cuota diaria gratuita.
 */
export async function getAdminDashboard(): Promise<AdminDashboard> {
  const [products, categories, orders] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
    getAdminOrders(),
  ])

  const labelByCategoryId = new Map(categories.map((c) => [c.id, c.label || c.name]))

  const inStock = products.filter((p) => p.inStock).length
  const outOfStock = products.length - inStock
  const inventoryValue = products.reduce((sum, p) => sum + p.price, 0)
  const withDiscount = products.filter(
    (p) => p.originalPrice != null && p.originalPrice > p.price
  ).length

  const distributionMap = new Map<string, CategoryDistribution>()
  for (const p of products) {
    const key = p.categoryId ?? '__none__'
    const label = p.categoryId ? labelByCategoryId.get(p.categoryId) ?? p.categoryName : 'Sin categoría'
    const entry = distributionMap.get(key) ?? { categoryId: p.categoryId, label, count: 0, value: 0 }
    entry.count += 1
    entry.value += p.price
    distributionMap.set(key, entry)
  }
  const distribution = Array.from(distributionMap.values()).sort((a, b) => b.count - a.count)

  const latest = products.slice(0, 5)
  const pendingOrders = orders.filter((o) => o.status === 'pendiente').length
  const recentOrders = orders.slice(0, 5)

  return {
    totals: {
      products: products.length,
      categories: categories.length,
      inStock,
      outOfStock,
      inventoryValue,
      withDiscount,
      pendingOrders,
    },
    distribution,
    latest,
    recentOrders,
    alerts: {
      outOfStock: toAlertGroup(products.filter((p) => !p.inStock)),
      missingImage: toAlertGroup(
        products.filter((p) => !p.imageUrl || p.imageUrl === PLACEHOLDER_IMAGE)
      ),
      missingCategory: toAlertGroup(products.filter((p) => !p.categoryId || !p.categoryName)),
      missingSpecs: toAlertGroup(products.filter((p) => p.specs.length === 0)),
    },
  }
}
