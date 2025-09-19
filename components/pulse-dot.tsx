"use client"

import { motion } from "framer-motion"

interface PulseDotProps {
  color?: "emerald" | "red" | "yellow" | "blue"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PulseDot({ color = "emerald", size = "md", className = "" }: PulseDotProps) {
  const colorClasses = {
    emerald: "bg-emerald-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
  }

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`rounded-full ${colorClasses[color]} ${sizeClasses[size]}`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full ${colorClasses[color]} opacity-30`}
        animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  )
}
