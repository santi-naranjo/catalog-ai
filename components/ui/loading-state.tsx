import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Loader2, 
  Package, 
  Globe, 
  Target, 
  Activity,
  FileText,
  BarChart3,
  Users
} from "lucide-react"

export type LoadingStateProps = {
  type: 'products' | 'campaigns' | 'connections' | 'published' | 'activity' | 'analytics' | 'users' | 'general'
  title?: string
  description?: string
  showSkeleton?: boolean
  skeletonCount?: number
  className?: string
}

const loadingStateConfig = {
  products: {
    icon: Package,
    defaultTitle: "Loading products",
    defaultDescription: "Fetching your product catalog...",
    skeletonCount: 8
  },
  campaigns: {
    icon: Target,
    defaultTitle: "Loading campaigns",
    defaultDescription: "Getting your marketing campaigns ready...",
    skeletonCount: 6
  },
  connections: {
    icon: Globe,
    defaultTitle: "Loading connections",
    defaultDescription: "Checking your platform connections...",
    skeletonCount: 4
  },
  published: {
    icon: FileText,
    defaultTitle: "Loading published products",
    defaultDescription: "Fetching your published catalog...",
    skeletonCount: 8
  },
  activity: {
    icon: Activity,
    defaultTitle: "Loading activity",
    defaultDescription: "Getting your recent activity...",
    skeletonCount: 5
  },
  analytics: {
    icon: BarChart3,
    defaultTitle: "Loading analytics",
    defaultDescription: "Crunching the numbers...",
    skeletonCount: 4
  },
  users: {
    icon: Users,
    defaultTitle: "Loading team",
    defaultDescription: "Fetching team members...",
    skeletonCount: 6
  },
  general: {
    icon: Loader2,
    defaultTitle: "Loading",
    defaultDescription: "Please wait...",
    skeletonCount: 4
  }
}

export function LoadingState({
  type,
  title,
  description,
  showSkeleton = true,
  skeletonCount,
  className = ""
}: LoadingStateProps) {
  const config = loadingStateConfig[type]
  const IconComponent = config.icon
  const count = skeletonCount || config.skeletonCount

  return (
    <div className={`space-y-6 ${className}`}>
      {showSkeleton ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(count)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <Card className="animate-pulse">
                <CardContent className="p-4 sm:p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center py-12"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6"
              >
                <IconComponent className="h-8 w-8 text-primary" />
              </motion.div>
              
              <h3 className="text-lg font-semibold mb-2">
                {title || config.defaultTitle}
              </h3>
              <p className="text-muted-foreground">
                {description || config.defaultDescription}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export function LoadingSpinner({ 
  size = "default", 
  className = "" 
}: { 
  size?: "sm" | "default" | "lg"
  className?: string 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className={className}
    >
      <Loader2 className={sizeClasses[size]} />
    </motion.div>
  )
} 