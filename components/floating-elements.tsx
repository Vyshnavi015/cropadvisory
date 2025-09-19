"use client"

import { motion } from "framer-motion"
import { Leaf, Cloud, Droplets, Sun } from "lucide-react"

export function FloatingElements() {
  const elements = [
    { Icon: Leaf, color: "text-emerald-400", delay: 0 },
    { Icon: Cloud, color: "text-blue-400", delay: 0.5 },
    { Icon: Droplets, color: "text-cyan-400", delay: 1 },
    { Icon: Sun, color: "text-yellow-400", delay: 1.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-10`}
          initial={{ y: "100vh", x: Math.random() * window.innerWidth, rotate: 0 }}
          animate={{
            y: "-10vh",
            x: Math.random() * window.innerWidth,
            rotate: 360,
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            delay: delay + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
      ))}
    </div>
  )
}
