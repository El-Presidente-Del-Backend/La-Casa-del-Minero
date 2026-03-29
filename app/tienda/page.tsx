import { getProducts, getCategories } from "@/lib/queries"
import { TiendaClient } from "./tienda-client"

export default async function TiendaPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  return <TiendaClient products={products} categories={categories} />
}
