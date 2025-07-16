import * as React from "react"
import type { Product } from "@/lib/mock-data"
import { ProductCard } from "@/components/core/product-card"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onEnhancementComplete: (productId: string) => void
}

export function ProductGrid({ products, onProductClick, onEnhancementComplete }: ProductGridProps) {
  console.log("PRODUCT GRID")
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
          onEnhancementComplete={onEnhancementComplete}
        />
      ))}
    </div>
  )
} 