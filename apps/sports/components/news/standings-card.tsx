"use client"

import { BarChart3 } from "lucide-react"
import { SportsCard } from "@/components/ui/sports-card"

const standings = [
  { team: "Buffalo Bills", record: "11-3", color: "text-green-400" },
  { team: "Miami Dolphins", record: "8-6", color: "text-white" },
  { team: "New York Jets", record: "7-7", color: "text-white" },
  { team: "New England", record: "4-10", color: "text-red-400" },
]

export function StandingsCard() {
  return (
    <SportsCard className="bento-wide">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
          <span className="text-blue-400 text-sm font-medium">STANDINGS</span>
        </div>
        <span className="text-muted-foreground text-xs">Updated 5 mins ago</span>
      </div>
      <h4 className="font-semibold mb-3">AFC East Updated</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {standings.map((team) => (
          <div key={team.team} className="flex justify-between">
            <span className="truncate mr-2">{team.team}</span>
            <span className={team.color}>{team.record}</span>
          </div>
        ))}
      </div>
    </SportsCard>
  )
}
