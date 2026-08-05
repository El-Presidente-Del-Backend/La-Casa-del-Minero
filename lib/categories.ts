// Helpers puros para la jerarquía de categorías (2 niveles: padre → subcategoría).
// Sin dependencias de Firestore: seguros para importar tanto en componentes de
// cliente como de servidor. Operan en memoria sobre la lista ya cargada.

export type CategoryLike = {
  id: string
  name: string
  parentId: string | null
}

/** Una subcategoría es cualquier categoría con un padre asignado. */
export function isSubcategory<T extends CategoryLike>(cat: T): boolean {
  return cat.parentId !== null
}

export function hasChildren<T extends CategoryLike>(categories: T[], id: string): boolean {
  return categories.some((c) => c.parentId === id)
}

export function getChildren<T extends CategoryLike>(categories: T[], parentId: string): T[] {
  return categories
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

/**
 * Árbol de 2 niveles: solo categorías principales (parentId === null) en el
 * nivel superior, cada una con su array de subcategorías. No hay recursión
 * porque la jerarquía está limitada a 2 niveles por diseño.
 */
export function buildCategoryTree<T extends CategoryLike>(
  categories: T[]
): (T & { children: T[] })[] {
  return categories
    .filter((c) => c.parentId === null)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((top) => ({ ...top, children: getChildren(categories, top.id) }))
}
