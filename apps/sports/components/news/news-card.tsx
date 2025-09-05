"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SportsCard } from "@/components/ui/sports-card"
import { cn } from "@/lib/utils"

interface NewsCardProps {
  title: string
  content?: string
  category: {
    label: string
    icon: React.ReactNode
    color: string
  }
  timestamp?: string
  size?: "default" | "large" | "wide" | "tall"
  breaking?: boolean
  className?: string
}

export function NewsCard({
  title,
  content,
  category,
  timestamp,
  size = "default",
  breaking = false,
  className,
}: NewsCardProps) {
  const sizeClasses = {
    default: "",
    large: "bento-large",
    wide: "bento-wide",
    tall: "bento-tall",
  }

  return (
    <SportsCard
      className={cn(
        sizeClasses[size],
        breaking && "border-2 animate-pulse",
        breaking && "border-red-500/50",
        className,
      )}
    >
      <div className="flex items-center mb-3">
        {breaking && (
          <Badge variant="destructive" className="mr-2 animate-pulse">
            BREAKING
          </Badge>
        )}
        <div className="flex items-center text-sm">
          {category.icon}
          <span className={cn("font-medium ml-2", category.color)}>{category.label}</span>
        </div>
        {timestamp && <span className="text-muted-foreground text-sm ml-auto">{timestamp}</span>}
      </div>

      <h3 className={cn("font-bold mb-3", size === "large" ? "text-xl" : "text-base")}>{title}</h3>

      {content && <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{content}</p>}

      {size === "large" && <Button className="bg-primary hover:bg-primary/90">Read Full Story</Button>}
    </SportsCard>
  )
}
