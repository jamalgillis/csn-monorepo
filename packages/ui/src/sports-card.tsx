import type React from "react"
import { cn } from "@/lib/utils"

interface SportsCardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
}

export function SportsCard({ className, children, hover = true }: SportsCardProps) {
  return (
    <div
      className={cn("sports-card p-4", hover && "hover:transform hover:scale-[1.02] hover:-translate-y-1", className)}
    >
      {children}
    </div>
  )
}
