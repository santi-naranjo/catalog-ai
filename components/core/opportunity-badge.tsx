"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface OpportunityBadgeProps {
  score: number
  className?: string
}

export function OpportunityBadge({ score, className }: OpportunityBadgeProps) {
  const getVariant = (score: number) => {
    if (score < 40) return "destructive"
    if (score < 70) return "warning"
    return "success"
  }

  const getScoreText = (score: number) => {
    if (score < 40) return "Low"
    if (score < 70) return "Medium"
    return "High"
  }

  return (
    <motion.div
      key={score} // This triggers re-animation when score changes
      initial={{ rotateY: 0 }}
      animate={{ rotateY: 360 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={className}
    >
      <Badge variant={getVariant(score)}>
        {getScoreText(score)} ({score})
      </Badge>
    </motion.div>
  )
} 