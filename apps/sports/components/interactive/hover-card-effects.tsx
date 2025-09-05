"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface HoverCardEffectsProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function HoverCardEffects({ children, className, glowColor = "red" }: HoverCardEffectsProps) {
  const [isHovered, setIsHovered] = useState(false)

  const glowColors = {
    red: "shadow-red-500/20",
    blue: "shadow-blue-500/20",
    green: "shadow-green-500/20",
    yellow: "shadow-yellow-500/20",
    purple: "shadow-purple-500/20",
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isHovered && "transform -translate-y-2 scale-[1.02]",
        isHovered && `shadow-2xl ${glowColors[glowColor as keyof typeof glowColors]}`,
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}
