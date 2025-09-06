"use client"

import { Trophy } from "lucide-react"
import { SportsCard } from "@/components/ui/sports-card"

const mvpCandidates = [
  { name: "Nikola Jokić", odds: "+120" },
  { name: "Luka Dončić", odds: "+180" },
  { name: "Jayson Tatum", odds: "+250" },
  { name: "Giannis", odds: "+300" },
  { name: "Shai Gilgeous-Alexander", odds: "+400" },
]

export function MvpRaceCard() {
  return (
    <SportsCard className="bento-tall">
      <div className="flex items-center mb-3">
        <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
        <span className="text-yellow-400 text-sm font-medium">MVP RACE</span>
      </div>
      <h4 className="font-semibold mb-4">2024 MVP Candidates</h4>
      <div className="space-y-3">
        {mvpCandidates.map((candidate, index) => (
          <div key={candidate.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2 w-4">{index + 1}.</span>
              <span className="text-sm">{candidate.name}</span>
            </div>
            <span className="text-accent text-sm font-semibold">{candidate.odds}</span>
          </div>
        ))}
      </div>
    </SportsCard>
  )
}
