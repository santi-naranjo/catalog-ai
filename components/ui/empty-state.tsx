import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Package, 
  Globe, 
  Target, 
  Search, 
  Plus, 
  Settings,
  Activity,
  FileText,
  Users,
  BarChart3,
  Upload
} from "lucide-react"

export type EmptyStateProps = {
  type: 'products' | 'campaigns' | 'connections' | 'published' | 'ready-to-publish' | 'search' | 'activity' | 'analytics' | 'users'
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  showIllustration?: boolean
  className?: string
}

const emptyStateConfig = {
  products: {
    icon: Package,
    defaultTitle: "No products yet",
    defaultDescription: "Start building your catalog by adding your first product. AI will help you create compelling descriptions.",
    defaultAction: "Add Product",
    illustration: "📦"
  },
  campaigns: {
    icon: Target,
    defaultTitle: "No campaigns yet",
    defaultDescription: "Create campaigns to generate AI content that matches your brand voice and marketing goals.",
    defaultAction: "Create Campaign",
    illustration: "🎯"
  },
  connections: {
    icon: Globe,
    defaultTitle: "No platform connections",
    defaultDescription: "Connect your e-commerce platforms to publish products and sync inventory automatically.",
    defaultAction: "Configure Connections",
    illustration: "🌐"
  },
  published: {
    icon: FileText,
    defaultTitle: "No published products",
    defaultDescription: "Publish products from your catalog to see them live on your connected platforms.",
    defaultAction: "Publish Products",
    illustration: "📄"
  },
  'ready-to-publish': {
    icon: Upload,
    defaultTitle: "No products ready to publish",
    defaultDescription: "Generate AI content for your products to see them here.",
    defaultAction: "View Catalog",
    illustration: "🚀"
  },
  search: {
    icon: Search,
    defaultTitle: "No results found",
    defaultDescription: "Try adjusting your search terms or browse all products to find what you're looking for.",
    defaultAction: "Clear Search",
    illustration: "🔍"
  },
  activity: {
    icon: Activity,
    defaultTitle: "No recent activity",
    defaultDescription: "Your activity feed will show here once you start publishing products and generating content.",
    defaultAction: "View Products",
    illustration: "📊"
  },
  analytics: {
    icon: BarChart3,
    defaultTitle: "No analytics data",
    defaultDescription: "Analytics will appear here once you start publishing products and generating traffic.",
    defaultAction: "Publish Products",
    illustration: "📈"
  },
  users: {
    icon: Users,
    defaultTitle: "No team members",
    defaultDescription: "Invite team members to collaborate on your product catalog and campaigns.",
    defaultAction: "Invite Users",
    illustration: "👥"
  }
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  showIllustration = true,
  className = ""
}: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <Card className="max-w-md mx-auto border-dashed">
        <CardContent className="pt-8 pb-6">
          {showIllustration && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-6"
            >
              <div className="text-6xl mb-4">{config.illustration}</div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              {title || config.defaultTitle}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {description || config.defaultDescription}
            </p>
            
            {onAction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button onClick={onAction} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {actionLabel || config.defaultAction}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 