"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface ScoreUpdaterProps {
  homeTeam: string
  awayTeam: string
  initialHomeScore: number
  initialAwayScore: number
}

export function ScoreUpdater({ homeTeam, awayTeam, initialHomeScore, initialAwayScore }: ScoreUpdaterProps) {
  const [homeScore, setHomeScore] = useState(initialHomeScore)
  const [awayScore, setAwayScore] = useState(initialAwayScore)
  const [lastUpdated, setLastUpdated] = useState<"home" | "away" | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update scores
      if (Math.random() > 0.7) {
        const isHome = Math.random() > 0.5
        if (isHome) {
          setHomeScore((prev) => prev + (Math.random() > 0.8 ? 3 : 2))
          setLastUpdated("home")
        } else {
          setAwayScore((prev) => prev + (Math.random() > 0.8 ? 3 : 2))
          setLastUpdated("away")
        }

        // Clear the highlight after animation
        setTimeout(() => setLastUpdated(null), 1000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <div className="text-sm font-medium">{homeTeam}</div>
        <Badge
          variant="score"
          className={`text-lg font-bold ${lastUpdated === "home" ? "animate-bounce bg-green-500" : ""}`}
        >
          {homeScore}
        </Badge>
      </div>
      <div className="text-white font-bold">-</div>
      <div className="text-left">
        <div className="text-sm font-medium">{awayTeam}</div>
        <Badge
          variant="score"
          className={`text-lg font-bold ${lastUpdated === "away" ? "animate-bounce bg-green-500" : ""}`}
        >
          {awayScore}
        </Badge>
      </div>
    </div>
  )
}
