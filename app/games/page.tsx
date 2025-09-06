"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "convex/react"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Calendar, Clock, Users, Play, RotateCcw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api } from "../../convex/_generated/api"

interface GameData {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  status: "in_progress" | "scheduled" | "final" | "postponed"
  sport: string
  date: string
  venue: string
  homeTeamLogo?: string
  awayTeamLogo?: string
}

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("status") // Default to status to show live games first

  const gamesData = useQuery(api.sports.getAllGames)

  const games = useMemo(() => {
    if (!gamesData) return []
    
    return gamesData.map((game): GameData => ({
      id: game.id,
      homeTeam: game.homeTeam.name,
      awayTeam: game.awayTeam.name,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      status: game.status,
      sport: game.sport.name,
      date: game.game_date,
      venue: game.venue || "TBD",
      homeTeamLogo: game.homeTeam.logo_url,
      awayTeamLogo: game.awayTeam.logo_url,
    }))
  }, [gamesData])

  const sports = useMemo(() => {
    if (!games.length) return ["all"]
    return ["all", ...Array.from(new Set(games.map((game) => game.sport)))]
  }, [games])
  
  const statuses = ["all", "in_progress", "scheduled", "final"]

  const filteredAndSortedGames = useMemo(() => {
    if (!games.length) return []

    const filtered = games.filter((game) => {
      const matchesSearch =
        game.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.sport.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSport = selectedSport === "all" || game.sport === selectedSport
      const matchesStatus = selectedStatus === "all" || game.status === selectedStatus

      return matchesSearch && matchesSport && matchesStatus
    })

    // Sort games - live games first by default
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "sport":
          return a.sport.localeCompare(b.sport)
        case "status":
        default:
          const statusOrder = { in_progress: 0, scheduled: 1, final: 2, postponed: 3 }
          return statusOrder[a.status] - statusOrder[b.status]
      }
    })

    return filtered
  }, [games, searchQuery, selectedSport, selectedStatus, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSport("all")
    setSelectedStatus("all")
    setSortBy("status")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <Badge variant="destructive" className="animate-pulse">
            LIVE
          </Badge>
        )
      case "scheduled":
        return <Badge variant="secondary">SCHEDULED</Badge>
      case "final":
        return <Badge variant="outline">FINAL</Badge>
      case "postponed":
        return <Badge variant="outline" className="bg-orange-600 text-white">POSTPONED</Badge>
      default:
        return null
    }
  }

  const GameCard = ({ game }: { game: GameData }) => (
    <Link href={`/games/${game.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border-border">
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-2">{game.sport}</div>
                <div className="text-sm opacity-75">{game.venue}</div>
              </div>
            </div>
            <div className="absolute top-2 left-2">{getStatusBadge(game.status)}</div>
            {game.status !== "in_progress" && (
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Image src={game.awayTeamLogo || "/placeholder.svg"} alt={game.awayTeam} width={24} height={24} />
                <span className="font-semibold">{game.awayTeam}</span>
                {game.awayScore !== undefined && (
                  <span className="text-lg font-bold text-primary">{game.awayScore}</span>
                )}
              </div>
              <span className="text-muted-foreground text-sm">@</span>
              <div className="flex items-center gap-2">
                {game.homeScore !== undefined && (
                  <span className="text-lg font-bold text-primary">{game.homeScore}</span>
                )}
                <span className="font-semibold">{game.homeTeam}</span>
                <Image src={game.homeTeamLogo || "/placeholder.svg"} alt={game.homeTeam} width={24} height={24} />
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{game.sport}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(game.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>{game.venue}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Games</h1>
          <p className="text-muted-foreground">
            Discover live games, upcoming matches, and recent results across all sports
          </p>
        </div>

        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border mb-8 pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search games, teams, leagues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport === "all" ? "All Sports" : sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status (Live First)</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedGames.length} game{filteredAndSortedGames.length !== 1 ? "s" : ""}
          </p>
        </div>

        {!gamesData ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Loading games...</p>
            </div>
          </div>
        ) : filteredAndSortedGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No games found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
