"use client"

import { useState } from "react"
import { StoreNavbar } from "@/components/store-navbar"
import { StoreHero } from "@/components/store-hero"
import { StoreFeatures } from "@/components/store-features"
import { StoreCategories } from "@/components/store-categories"
import { ProductGrid } from "@/components/product-grid"
import { StoreFooter } from "@/components/store-footer"
import type { Category } from "@/lib/products"

export default function TiendaPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<Category>("Todos")

  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat)
    scrollToProducts()
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onSearch={setSearch}
      />

      <StoreHero />
      <StoreFeatures />
      <StoreCategories onCategoryChange={handleCategoryChange} />

      {/* Products section */}
      <section id="productos" className="mx-auto max-w-7xl px-4 pb-16">
        <ProductGrid search={search} activeCategory={activeCategory} />
      </section>

      <StoreFooter />
    </div>
  )
}
