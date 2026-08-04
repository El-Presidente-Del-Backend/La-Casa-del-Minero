import { getAdminCategories } from "@/lib/admin-queries"
import { CategoriesManager } from "./categories-manager"

export default async function AdminCategorias() {
  const categories = await getAdminCategories()

  return <CategoriesManager categories={categories} />
}
