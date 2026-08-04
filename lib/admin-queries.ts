import { adminDb } from '@/lib/firebase/admin'
import type { CategoryRecord } from '@/lib/products'

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
