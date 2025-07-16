import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, Wand2, Sparkles } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import type { Product } from "../../lib/mock-data"

export type ProductCardProps = {
  product: Product
  onEdit?: () => void
  onDelete?: () => void
  onGenerateContent?: () => void
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onGenerateContent,
}: ProductCardProps) {
  // Opportunity badge logic (can be moved to a helper)
  const getOpportunityBadge = (score: number) => {
    if (score >= 80) return { label: "Diamond", color: "bg-purple-500", icon: "💎" }
    if (score >= 60) return { label: "Gold", color: "bg-yellow-500", icon: "🥇" }
    if (score >= 40) return { label: "Silver", color: "bg-gray-400", icon: "🥈" }
    if (score >= 20) return { label: "Bronze", color: "bg-orange-600", icon: "🥉" }
    return { label: "Basic", color: "bg-gray-500", icon: "⭐" }
  }
  const badge = getOpportunityBadge(product.opportunity_score)

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        {/* Product Image */}
        <div className="relative mb-4">
          <div className="aspect-square bg-muted rounded-md overflow-hidden">
            {product.master_image_url ? (
              <img 
                src={product.master_image_url} 
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            ) : product.variants && product.variants.length > 0 && product.variants[0].image_url ? (
              <img
                src={product.variants[0].image_url}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Eye className="h-8 w-8" />
              </div>
            )}
          </div>
          {/* Opportunity Badge */}
          <Badge className={`absolute top-2 right-2 ${badge.color} text-white text-xs`}>
            <span className="mr-1">{badge.icon}</span>
            <span className="hidden sm:inline">{badge.label}</span>
          </Badge>
          {/* Score */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {product.opportunity_score}/100
          </div>
        </div>
        {/* Product Info */}
        <div className="space-y-2">
          <h3 
            className="font-semibold text-lg truncate cursor-pointer hover:text-primary transition-colors"
            onClick={onEdit}
            title="Click to edit product"
          >
            {product.product_name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.master_description || "No description"}
          </p>
          {product.base_price && (
            <div className="text-lg font-bold text-green-600">
              ${product.base_price.toFixed(2)}
            </div>
          )}
          
          {/* AI Version Badge */}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              AI v{product.content_version || 1}
            </Badge>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onEdit} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit product</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onGenerateContent} className="h-8 w-8 p-0">
                  <Wand2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate AI content</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onDelete} className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete product</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 