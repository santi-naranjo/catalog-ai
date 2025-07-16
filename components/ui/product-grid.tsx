import * as React from "react"
import { ProductCard, ProductCardProps } from "@/components/ui/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState } from "@/components/ui/loading-state"
import type { Product } from "../../lib/mock-data"

export type ProductGridProps = {
  products: Product[]
  loading?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onGenerateContent?: (product: Product) => void
  emptyMessage?: string
  searchTerm?: string
  onAddProduct?: () => void
}

export function ProductGrid({
  products,
  loading = false,
  onEdit,
  onDelete,
  onGenerateContent,
  emptyMessage,
  searchTerm = "",
  onAddProduct
}: ProductGridProps) {
  if (loading) {
    return <LoadingState type="products" />
  }

  if (products.length === 0) {
    const emptyType = searchTerm ? "search" : "products"
    return (
      <EmptyState
        type={emptyType}
        title={searchTerm ? "No products found" : undefined}
        description={emptyMessage || (searchTerm ? `No products found matching "${searchTerm}"` : undefined)}
        actionLabel={searchTerm ? "Clear Search" : "Add Product"}
        onAction={searchTerm ? () => window.location.reload() : onAddProduct}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={() => onEdit?.(product)}
          onDelete={() => onDelete?.(product)}
          onGenerateContent={() => onGenerateContent?.(product)}
        />
      ))}
    </div>
  )
} 