import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import * as React from "react"
import type { Product } from "@/lib/mock-data"
import { OpportunityBadge } from "./opportunity-badge"

interface ProductCardProps {
  product: Product
  onClick: () => void
  onEnhancementComplete: (productId: string) => void
}

export function ProductCard({ product, onClick, onEnhancementComplete }: ProductCardProps) {
  console.log("JUEPUTA")
  // Use the first variant's image if available
  const mainImage = product.variants && product.variants.length > 0 ? product.variants[0].image_url : undefined;
  const priceDisplay =
    typeof product.base_price === "number"
      ? `$${(product.base_price as number).toFixed(2)}`
      : "-";
  const opportunityScore = typeof product.opportunity_score === 'number' ? product.opportunity_score : 0;
  return (
    <TooltipProvider>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group w-full text-left focus:outline-none",
          "transition-transform duration-150 hover:scale-[1.03]"
        )}
      >
        <Card className="overflow-hidden p-0 shadow-sm group-hover:shadow-lg transition-shadow relative">
          <img
            src={mainImage || "/placeholder.png"}
            alt={product.product_name}
            className="h-40 w-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <OpportunityBadge score={opportunityScore} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{product.opportunity_reason}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{product.product_name}</h3>
            <div className="text-primary font-bold text-xl">{priceDisplay}</div>
            {/* Variants Section - Always visible */}
            <div style={{ border: '1px solid #ccc', padding: 8, marginTop: 8, background: '#f9f9f9', borderRadius: 4 }}>
              <strong>Variants:</strong>
              {product.variants && product.variants.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {product.variants.map((variant) => (
                    <li key={variant.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <span>SKU: <b>{variant.sku}</b></span>
                      {variant.image_url && (
                        <img src={variant.image_url} alt={variant.sku} style={{ width: 40, height: 40, objectFit: 'cover', marginLeft: 8, borderRadius: 4 }} />
                      )}
                      {typeof variant.price_override === 'number' && (
                        <span style={{ marginLeft: 8 }}>Price: ${variant.price_override.toFixed(2)}</span>
                      )}
                      {typeof variant.stock_quantity === 'number' && (
                        <span style={{ marginLeft: 8 }}>Stock: {variant.stock_quantity}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#888', fontSize: 12 }}>No variants</div>
              )}
            </div>
            {/* Localizations Section - Always visible */}
            <div style={{ border: '1px solid #ccc', padding: 8, marginTop: 8, background: '#f9f9f9', borderRadius: 4 }}>
              <strong>Localizations:</strong>
              {product.localizations && product.localizations.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {product.localizations.map((loc) => (
                    <li key={loc.id} style={{ marginBottom: 4 }}>
                      <span>Lang: <b>{loc.language_code}</b></span>
                      {loc.localized_name && (
                        <span style={{ marginLeft: 8 }}>Name: {loc.localized_name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#888', fontSize: 12 }}>No localizations</div>
              )}
            </div>
          </div>
        </Card>
      </button>
    </TooltipProvider>
  )
} 