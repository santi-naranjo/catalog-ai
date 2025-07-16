"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  User,
  Package,
  Megaphone,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/session/SessionContext"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  onMobileClose?: () => void
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Products",
    icon: Package,
    href: "/products",
  },
  {
    title: "Campaigns",
    icon: Megaphone,
    href: "/campaigns",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar({ isCollapsed, onToggle, onMobileClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useSession()

  const handleNavigation = (href: string) => {
    router.push(href)
    // Close mobile menu if it's open
    if (onMobileClose) {
      onMobileClose()
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3 w-full justify-center">
          <div className="bg-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Catalog AI Logo">
              <rect x="5" y="5" width="30" height="30" rx="8" fill="#6366F1" />
              <circle cx="20" cy="20" r="8" fill="#fff" />
            </svg>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === "/settings" && pathname.startsWith("/settings"))
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed ? "justify-center px-2" : "px-4"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && (
                <span className="ml-3">{item.title}</span>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <SidebarUserInfo />
          )}
          <ThemeToggle />
        </div>
        
        {/* Divider */}
        <div className="border-t" />
        
        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            isCollapsed ? "justify-center px-2" : "px-4"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && (
            <span className="ml-3">Logout</span>
          )}
        </Button>
      </div>
    </div>
  )
}

function SidebarUserInfo() {
  const { user, tenant, profile, loading } = useSession()
  if (loading) {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted" />
        <div className="flex flex-col">
          <span className="text-sm font-medium bg-muted rounded w-20 h-4" />
          <span className="text-xs text-muted-foreground bg-muted rounded w-28 h-3 mt-1" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <User className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{profile?.full_name || user?.email || "-"}</span>
        <span className="text-xs text-muted-foreground">{user?.email || "-"}</span>
        {tenant?.tenant_name && (
          <span className="text-xs text-muted-foreground font-semibold">{tenant.tenant_name}</span>
        )}
      </div>
    </div>
  )
} 