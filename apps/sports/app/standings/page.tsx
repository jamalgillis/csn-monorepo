"use client"

import { useState } from "react"
import { Header } from "@/components/navigation/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const leagues = ["NBA", "NFL", "MLB", "NHL"]

const standingsData = {
  NBA: {
    "Eastern Conference": {
      "Atlantic Division": [
        { team: "Boston Celtics", wins: 42, losses: 12, pct: 0.778, gb: "-", streak: "W3", logo: "🍀" },
        { team: "Miami Heat", wins: 32, losses: 22, pct: 0.593, gb: "10.0", streak: "L1", logo: "🔥" },
        { team: "Philadelphia 76ers", wins: 31, losses: 23, pct: 0.574, gb: "11.0", streak: "W2", logo: "⭐" },
        { team: "Brooklyn Nets", wins: 21, losses: 33, pct: 0.389, gb: "21.0", streak: "L2", logo: "🕸️" },
        { team: "Toronto Raptors", wins: 19, losses: 35, pct: 0.352, gb: "23.0", streak: "W1", logo: "🦖" },
      ],
      "Central Division": [
        { team: "Milwaukee Bucks", wins: 38, losses: 16, pct: 0.704, gb: "-", streak: "W4", logo: "🦌" },
        { team: "Cleveland Cavaliers", wins: 35, losses: 19, pct: 0.648, gb: "3.0", streak: "W1", logo: "⚔️" },
        { team: "Indiana Pacers", wins: 30, losses: 24, pct: 0.556, gb: "8.0", streak: "L1", logo: "🏀" },
        { team: "Chicago Bulls", wins: 25, losses: 29, pct: 0.463, gb: "13.0", streak: "L3", logo: "🐂" },
        { team: "Detroit Pistons", wins: 8, losses: 46, pct: 0.148, gb: "30.0", streak: "L8", logo: "🔧" },
      ],
    },
    "Western Conference": {
      "Pacific Division": [
        { team: "LA Clippers", wins: 36, losses: 18, pct: 0.667, gb: "-", streak: "W2", logo: "📎" },
        { team: "Phoenix Suns", wins: 33, losses: 21, pct: 0.611, gb: "3.0", streak: "W1", logo: "☀️" },
        { team: "Sacramento Kings", wins: 32, losses: 22, pct: 0.593, gb: "4.0", streak: "L2", logo: "👑" },
        { team: "Golden State Warriors", wins: 28, losses: 26, pct: 0.519, gb: "8.0", streak: "W3", logo: "⚡" },
        { team: "LA Lakers", wins: 27, losses: 27, pct: 0.5, gb: "9.0", streak: "L1", logo: "💜" },
      ],
      "Southwest Division": [
        { team: "Oklahoma City Thunder", wins: 40, losses: 14, pct: 0.741, gb: "-", streak: "W5", logo: "⚡" },
        { team: "Dallas Mavericks", wins: 31, losses: 23, pct: 0.574, gb: "9.0", streak: "W2", logo: "🐴" },
        { team: "New Orleans Pelicans", wins: 30, losses: 24, pct: 0.556, gb: "10.0", streak: "L1", logo: "🦢" },
        { team: "Houston Rockets", wins: 24, losses: 30, pct: 0.444, gb: "16.0", streak: "W1", logo: "🚀" },
        { team: "San Antonio Spurs", wins: 11, losses: 43, pct: 0.204, gb: "29.0", streak: "L4", logo: "⚔️" },
      ],
    },
  },
  NFL: {
    AFC: {
      "AFC East": [
        { team: "Buffalo Bills", wins: 11, losses: 6, pct: 0.647, gb: "-", streak: "W2", logo: "🦬" },
        { team: "Miami Dolphins", wins: 9, losses: 8, pct: 0.529, gb: "2.0", streak: "L1", logo: "🐬" },
      ],
    },
    NFC: {
      "NFC East": [
        { team: "Dallas Cowboys", wins: 12, losses: 5, pct: 0.706, gb: "-", streak: "W3", logo: "⭐" },
        { team: "Philadelphia Eagles", wins: 11, losses: 6, pct: 0.647, gb: "1.0", streak: "W1", logo: "🦅" },
      ],
    },
  },
  MLB: {
    "American League": {
      "AL East": [
        { team: "New York Yankees", wins: 82, losses: 80, pct: 0.506, gb: "-", streak: "W1", logo: "🏟️" },
        { team: "Boston Red Sox", wins: 78, losses: 84, pct: 0.481, gb: "4.0", streak: "L2", logo: "🧦" },
      ],
    },
    "National League": {
      "NL East": [
        { team: "Atlanta Braves", wins: 104, losses: 58, pct: 0.642, gb: "-", streak: "W5", logo: "🪓" },
        { team: "Philadelphia Phillies", wins: 90, losses: 72, pct: 0.556, gb: "14.0", streak: "W2", logo: "🔔" },
      ],
    },
  },
  NHL: {
    "Eastern Conference": {
      "Atlantic Division": [
        { team: "Boston Bruins", wins: 47, losses: 20, pct: 0.701, gb: "-", streak: "W3", logo: "🐻" },
        { team: "Toronto Maple Leafs", wins: 46, losses: 21, pct: 0.687, gb: "1.0", streak: "W1", logo: "🍁" },
      ],
    },
    "Western Conference": {
      "Central Division": [
        { team: "Colorado Avalanche", wins: 50, losses: 24, pct: 0.676, gb: "-", streak: "W2", logo: "❄️" },
        { team: "Dallas Stars", wins: 47, losses: 21, pct: 0.691, gb: "3.0", streak: "L1", logo: "⭐" },
      ],
    },
  },
}

export default function StandingsPage() {
  const [selectedLeague, setSelectedLeague] = useState("NBA")
  const [selectedConference, setSelectedConference] = useState("Eastern Conference")

  const currentStandings = standingsData[selectedLeague as keyof typeof standingsData] || {}
  const conferences = Object.keys(currentStandings)
  const selectedConferenceData = currentStandings[selectedConference as keyof typeof currentStandings] || {}

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">League Standings</h1>
          <p className="text-muted-foreground">Current standings and team records across all leagues</p>
        </div>

        {/* League Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {leagues.map((league) => (
            <Button
              key={league}
              variant={selectedLeague === league ? "default" : "outline"}
              onClick={() => {
                setSelectedLeague(league)
                const newStandings = standingsData[league as keyof typeof standingsData] || {}
                const newConferences = Object.keys(newStandings)
                if (newConferences.length > 0) {
                  setSelectedConference(newConferences[0])
                }
              }}
              className="min-w-[80px]"
            >
              {league}
            </Button>
          ))}
        </div>

        {/* Conference Selector */}
        {conferences.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {conferences.map((conference) => (
              <Button
                key={conference}
                variant={selectedConference === conference ? "secondary" : "ghost"}
                onClick={() => setSelectedConference(conference)}
                size="sm"
              >
                {conference}
              </Button>
            ))}
          </div>
        )}

        {/* Standings Tables */}
        <div className="space-y-8">
          {Object.entries(selectedConferenceData).map(([division, teams]) => (
            <Card key={division} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  {division}
                  <Badge variant="outline" className="text-xs">
                    {Array.isArray(teams) ? teams.length : 0} Teams
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Team</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">W</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">L</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">PCT</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">GB</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">STRK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(teams) &&
                        teams.map((team, index) => (
                          <tr key={team.team} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-2">
                              <Link
                                href={`/teams/${team.team.toLowerCase().replace(/\s+/g, "-")}`}
                                className="flex items-center gap-3 hover:text-primary transition-colors"
                              >
                                <span className="text-lg">{team.logo}</span>
                                <div>
                                  <div className="font-medium text-foreground">{team.team}</div>
                                  {index === 0 && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      Division Leader
                                    </Badge>
                                  )}
                                </div>
                              </Link>
                            </td>
                            <td className="text-center py-3 px-2 font-medium text-foreground">{team.wins}</td>
                            <td className="text-center py-3 px-2 font-medium text-foreground">{team.losses}</td>
                            <td className="text-center py-3 px-2 text-muted-foreground">{team.pct.toFixed(3)}</td>
                            <td className="text-center py-3 px-2 text-muted-foreground">{team.gb}</td>
                            <td className="text-center py-3 px-2">
                              <Badge
                                variant={team.streak.startsWith("W") ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {team.streak}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Playoff Information */}
        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Playoff Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Playoff Positions</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-600 hover:bg-green-700">1-6: Guaranteed Playoff</Badge>
                  <Badge variant="secondary">7-10: Play-In Tournament</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Key</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>W/L: Wins/Losses</div>
                  <div>PCT: Win Percentage</div>
                  <div>GB: Games Behind</div>
                  <div>STRK: Current Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
