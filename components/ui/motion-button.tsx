import * as React from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type MotionButtonProps = {
  children: React.ReactNode
  loading?: boolean
  success?: boolean
  error?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  onAnimationComplete?: () => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export function MotionButton({
  children,
  loading = false,
  success = false,
  error = false,
  loadingText,
  successText,
  errorText,
  onAnimationComplete,
  className,
  variant = "default",
  size = "default",
  disabled,
  onClick,
  type = "button",
  ...props
}: MotionButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false)

  const handleClick = () => {
    if (loading || disabled) return
    
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    
    onClick?.()
  }

  const getButtonContent = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText || children}
        </motion.div>
      )
    }
    
    if (success) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          {successText || children}
        </motion.div>
      )
    }
    
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          {errorText || children}
        </motion.div>
      )
    }
    
    return <span className="flex items-center gap-2">{children}</span>
  }

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onAnimationComplete={onAnimationComplete}
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={handleClick}
        type={type}
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          isPressed && "scale-95",
          className
        )}
        {...props}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${loading}-${success}-${error}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {getButtonContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Ripple effect */}
        {isPressed && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-white/20 rounded-full pointer-events-none"
          />
        )}
      </Button>
    </motion.div>
  )
}

// Specialized button variants for common actions
export function SaveButton({ 
  loading, 
  success, 
  error, 
  onSave, 
  ...props 
}: {
  loading?: boolean
  success?: boolean
  error?: boolean
  onSave: () => void
} & Omit<MotionButtonProps, 'children' | 'onClick'>) {
  return (
    <MotionButton
      loading={loading}
      success={success}
      error={error}
      loadingText="Saving..."
      successText="Saved!"
      errorText="Save Failed"
      onClick={onSave}
      variant="default"
      {...props}
    >
      Save
    </MotionButton>
  )
}

export function PublishButton({ 
  loading, 
  success, 
  error, 
  onPublish, 
  ...props 
}: {
  loading?: boolean
  success?: boolean
  error?: boolean
  onPublish: () => void
} & Omit<MotionButtonProps, 'children' | 'onClick'>) {
  return (
    <MotionButton
      loading={loading}
      success={success}
      error={error}
      loadingText="Publishing..."
      successText="Published!"
      errorText="Publish Failed"
      onClick={onPublish}
      variant="default"
      {...props}
    >
      Publish
    </MotionButton>
  )
}

export function GenerateButton({ 
  loading, 
  success, 
  error, 
  onGenerate, 
  ...props 
}: {
  loading?: boolean
  success?: boolean
  error?: boolean
  onGenerate: () => void
} & Omit<MotionButtonProps, 'children' | 'onClick'>) {
  return (
    <MotionButton
      loading={loading}
      success={success}
      error={error}
      loadingText="Generating..."
      successText="Generated!"
      errorText="Generation Failed"
      onClick={onGenerate}
      variant="default"
      {...props}
    >
      Generate
    </MotionButton>
  )
} 