"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
  direction?: "up" | "down" | "left" | "right"
}

export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  hover = true,
  direction = "up",
}: AnimatedCardProps) {
  const directionVariants = {
    up: { y: 30, opacity: 0 },
    down: { y: -30, opacity: 0 },
    left: { x: 30, opacity: 0 },
    right: { x: -30, opacity: 0 },
  }

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -5,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={className}
    >
      <Card className="h-full transition-shadow duration-300 hover:shadow-lg border-emerald-200 bg-white/80 backdrop-blur-sm">
        {children}
      </Card>
    </motion.div>
  )
}

interface AnimatedCardHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function AnimatedCardHeader({ title, description, icon, className = "" }: AnimatedCardHeaderProps) {
  return (
    <CardHeader className={className}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center gap-2"
      >
        {icon && (
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
            {icon}
          </motion.div>
        )}
        <CardTitle className="text-emerald-800">{title}</CardTitle>
      </motion.div>
      {description && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
          <CardDescription className="text-emerald-600">{description}</CardDescription>
        </motion.div>
      )}
    </CardHeader>
  )
}

export function AnimatedCardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <CardContent className={className}>{children}</CardContent>
    </motion.div>
  )
}
