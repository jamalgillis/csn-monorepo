"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/ui/footer"
import { LiveIndicator } from "@/components/ui/live-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Filter, Calendar } from "lucide-react"
import { SportsCard } from "@/components/ui/sports-card"

interface Game {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: "live" | "final" | "upcoming"
  quarter?: string
  timeRemaining?: string
  startTime?: string
  sport: string
  league: string
  viewers?: number
}

const initialGames: Game[] = [
  {
    id: "1",
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    homeScore: 89,
    awayScore: 92,
    status: "live",
    quarter: "Q3",
    timeRemaining: "8:45",
    sport: "Basketball",
    league: "NBA",
    viewers: 45328,
  },
  {
    id: "2",
    homeTeam: "Chiefs",
    awayTeam: "Bills",
    homeScore: 21,
    awayScore: 14,
    status: "live",
    quarter: "Q2",
    timeRemaining: "2:15",
    sport: "Football",
    league: "NFL",
    viewers: 78542,
  },
  {
    id: "3",
    homeTeam: "Celtics",
    awayTeam: "Heat",
    homeScore: 108,
    awayScore: 102,
    status: "final",
    sport: "Basketball",
    league: "NBA",
  },
  {
    id: "4",
    homeTeam: "Cowboys",
    awayTeam: "Eagles",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    startTime: "8:20 PM ET",
    sport: "Football",
    league: "NFL",
  },
  {
    id: "5",
    homeTeam: "Dodgers",
    awayTeam: "Giants",
    homeScore: 7,
    awayScore: 4,
    status: "final",
    sport: "Baseball",
    league: "MLB",
  },
  {
    id: "6",
    homeTeam: "Bruins",
    awayTeam: "Rangers",
    homeScore: 2,
    awayScore: 3,
    status: "live",
    quarter: "3rd",
    timeRemaining: "12:30",
    sport: "Hockey",
    league: "NHL",
    viewers: 23156,
  },
]

export default function LiveScoresPage() {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [selectedSport, setSelectedSport] = useState<string>("all")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const sports = ["all", "Basketball", "Football", "Baseball", "Hockey"]

  // Auto-refresh live scores
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setGames((prevGames) =>
        prevGames.map((game) => {
          if (game.status === "live" && Math.random() > 0.7) {
            const isHome = Math.random() > 0.5
            const points = Math.random() > 0.8 ? 3 : Math.random() > 0.6 ? 2 : 1

            return {
              ...game,
              homeScore: isHome ? game.homeScore + points : game.homeScore,
              awayScore: !isHome ? game.awayScore + points : game.awayScore,
            }
          }
          return game
        }),
      )
      setLastUpdated(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredGames = games.filter((game) => selectedSport === "all" || game.sport === selectedSport)

  const liveGames = filteredGames.filter((game) => game.status === "live")
  const finalGames = filteredGames.filter((game) => game.status === "final")
  const upcomingGames = filteredGames.filter((game) => game.status === "upcoming")

  const refreshScores = () => {
    setLastUpdated(new Date())
    // Simulate score updates
    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.status === "live") {
          return {
            ...game,
            homeScore: game.homeScore + Math.floor(Math.random() * 3),
            awayScore: game.awayScore + Math.floor(Math.random() * 3),
          }
        }
        return game
      }),
    )
  }

  const getStatusBadge = (game: Game) => {
    switch (game.status) {
      case "live":
        return <LiveIndicator className="text-xs" />
      case "final":
        return (
          <Badge variant="secondary" className="text-xs">
            FINAL
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline" className="text-xs">
            {game.startTime}
          </Badge>
        )
      default:
        return null
    }
  }

  const GameCard = ({ game }: { game: Game }) => (
    <SportsCard className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground font-medium">{game.league}</span>
          {getStatusBadge(game)}
        </div>
        {game.viewers && (
          <span className="text-xs text-muted-foreground">{(game.viewers / 1000).toFixed(1)}K viewers</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white">{game.awayTeam}</span>
            <span className="text-xl font-bold text-white">{game.awayScore}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">{game.homeTeam}</span>
            <span className="text-xl font-bold text-white">{game.homeScore}</span>
          </div>
        </div>
      </div>

      {game.status === "live" && game.quarter && game.timeRemaining && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{game.quarter}</span>
            <span>{game.timeRemaining} remaining</span>
          </div>
        </div>
      )}
    </SportsCard>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Scores</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshScores}
              className="flex items-center space-x-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>

            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Auto-refresh {autoRefresh ? "ON" : "OFF"}</span>
            </Button>
          </div>
        </div>

        {/* Sport Filter */}
        <div className="flex items-center space-x-2 mb-8">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex space-x-2">
            {sports.map((sport) => (
              <Button
                key={sport}
                variant={selectedSport === sport ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSport(sport)}
                className="capitalize"
              >
                {sport}
              </Button>
            ))}
          </div>
        </div>

        {/* Live Games Section */}
        {liveGames.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <LiveIndicator className="mr-3" />
              <h2 className="text-xl font-bold text-white">Live Games ({liveGames.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* Final Games Section */}
        {finalGames.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Final Scores ({finalGames.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Games Section */}
        {upcomingGames.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Upcoming Games ({upcomingGames.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No games found for the selected sport.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
