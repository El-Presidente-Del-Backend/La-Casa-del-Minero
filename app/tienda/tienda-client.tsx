"use client"

import { useMemo, useState } from "react"
import { StoreNavbar } from "@/components/store-navbar"
import { StoreHero } from "@/components/store-hero"
import { StoreFeatures } from "@/components/store-features"
import { StoreCategories } from "@/components/store-categories"
import { ProductGrid } from "@/components/product-grid"
import { StoreFooter } from "@/components/store-footer"
import type { Product, CategoryRecord } from "@/lib/products"

export function TiendaClient({
  products,
  categories,
}: {
  products: Product[]
  categories: CategoryRecord[]
}) {
  const [search, setSearch] = useState("")
  const [activeCategoryId, setActiveCategoryId] = useState("todos")

  const topLevelCategories = useMemo(() => categories.filter((c) => c.parentId === null), [categories])

  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id)
    scrollToProducts()
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
        onSearch={setSearch}
      />

      <StoreHero />
      <StoreFeatures />
      <StoreCategories categories={topLevelCategories} onCategoryChange={handleCategoryChange} />

      <section id="productos" className="mx-auto max-w-7xl px-4 pb-16">
        <ProductGrid
          search={search}
          activeCategoryId={activeCategoryId}
          categories={categories}
          products={products}
        />
      </section>

      <StoreFooter />
    </div>
  )
}
