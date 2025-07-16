import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type GradientAccentProps = {
  children: React.ReactNode
  variant?: "primary" | "success" | "warning" | "error" | "purple" | "blue" | "green" | "orange"
  direction?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl"
  animated?: boolean
  className?: string
  background?: boolean
}

const gradientVariants = {
  primary: "from-primary via-primary/80 to-primary/60",
  success: "from-green-500 via-emerald-500 to-teal-500",
  warning: "from-yellow-500 via-orange-500 to-red-500",
  error: "from-red-500 via-pink-500 to-rose-500",
  purple: "from-purple-500 via-violet-500 to-indigo-500",
  blue: "from-blue-500 via-cyan-500 to-sky-500",
  green: "from-green-400 via-emerald-400 to-teal-400",
  orange: "from-orange-400 via-amber-400 to-yellow-400"
}

export function GradientAccent({
  children,
  variant = "primary",
  direction = "to-r",
  animated = false,
  className,
  background = false
}: GradientAccentProps) {
  const gradientClass = `bg-gradient-${direction} ${gradientVariants[variant]}`
  
  if (background) {
    return (
      <div className={cn("relative", className)}>
        <motion.div
          className={cn(
            "absolute inset-0 rounded-lg",
            gradientClass,
            animated && "animate-pulse"
          )}
          initial={animated ? { opacity: 0.3 } : {}}
          animate={animated ? { opacity: [0.3, 0.7, 0.3] } : {}}
          transition={animated ? { duration: 2, repeat: Infinity } : {}}
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-r rounded-lg p-1",
        gradientClass,
        className
      )}
      whileHover={animated ? { scale: 1.02 } : {}}
      whileTap={animated ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  )
}

export function GradientText({
  children,
  variant = "primary",
  className
}: {
  children: React.ReactNode
  variant?: keyof typeof gradientVariants
  className?: string
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradientVariants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function AnimatedGradient({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn(
        "bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-size-200",
        className
      )}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {children}
    </motion.div>
  )
}

export function GradientBorder({
  children,
  variant = "primary",
  className
}: {
  children: React.ReactNode
  variant?: keyof typeof gradientVariants
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn("absolute inset-0 rounded-lg p-[1px]", `bg-gradient-to-r ${gradientVariants[variant]}`)}>
        <div className="bg-background rounded-lg h-full w-full">
          {children}
        </div>
      </div>
    </div>
  )
} 