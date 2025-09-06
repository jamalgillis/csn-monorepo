"use client"

import { Header } from "@/components/navigation/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ChevronLeft, ChevronRight, Clock, Tv, Bell } from "lucide-react"
import { useState } from "react"

const scheduleData = {
  today: [
    {
      id: 1,
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      homeScore: 0,
      awayScore: 0,
      time: "8:00 PM ET",
      network: "ESPN",
      status: "upcoming",
      sport: "NBA",
    },
    {
      id: 2,
      homeTeam: "Cowboys",
      awayTeam: "Giants",
      homeScore: 21,
      awayScore: 14,
      time: "Final",
      network: "FOX",
      status: "completed",
      sport: "NFL",
    },
    {
      id: 3,
      homeTeam: "Celtics",
      awayTeam: "Heat",
      homeScore: 89,
      awayScore: 92,
      time: "Q3 4:32",
      network: "TNT",
      status: "live",
      sport: "NBA",
    },
  ],
  upcoming: [
    {
      id: 4,
      homeTeam: "Dodgers",
      awayTeam: "Padres",
      time: "Tomorrow 7:30 PM ET",
      network: "MLB Network",
      status: "upcoming",
      sport: "MLB",
    },
    {
      id: 5,
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      time: "Sunday 4:25 PM ET",
      network: "CBS",
      status: "upcoming",
      sport: "NFL",
    },
  ],
}

export default function SchedulePage() {
  const [selectedSport, setSelectedSport] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const sports = ["all", "NBA", "NFL", "MLB", "NHL"]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-600 text-white animate-pulse">LIVE</Badge>
      case "upcoming":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            UPCOMING
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            FINAL
          </Badge>
        )
      default:
        return null
    }
  }

  const GameCard = ({ game }: { game: any }) => (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {game.sport}
            </Badge>
            {getStatusBadge(game.status)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tv className="w-4 h-4" />
            {game.network}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{game.awayTeam}</span>
              {game.status === "completed" || game.status === "live" ? (
                <span className="text-lg font-bold">{game.awayScore}</span>
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{game.homeTeam}</span>
              {game.status === "completed" || game.status === "live" ? (
                <span className="text-lg font-bold">{game.homeScore}</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {game.time}
          </div>
          {game.status === "upcoming" && (
            <Button size="sm" variant="outline" className="h-8 bg-transparent">
              <Bell className="w-3 h-3 mr-1" />
              Remind
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Sports Schedule</h1>
          <p className="text-muted-foreground text-lg">Stay up to date with all your favorite games</p>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg border border-border">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium text-lg">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Sport Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sports.map((sport) => (
            <Button
              key={sport}
              variant={selectedSport === sport ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSport(sport)}
              className="whitespace-nowrap"
            >
              {sport.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Today's Games */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Today's Games
            <Badge className="bg-red-600 text-white animate-pulse">LIVE</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleData.today.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Upcoming Games */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Upcoming Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleData.upcoming.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
