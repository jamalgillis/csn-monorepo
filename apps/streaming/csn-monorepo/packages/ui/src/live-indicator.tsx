import type React from "react"
import { cn } from "@/lib/utils"

interface LiveIndicatorProps {
  className?: string
  children?: React.ReactNode
}

export function LiveIndicator({ className, children }: LiveIndicatorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold",
        "bg-green-500 text-black animate-pulse",
        className,
      )}
    >
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
      {children || "LIVE"}
    </div>
  )
}
