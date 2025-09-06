"use client"

import { useState } from "react"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Users, Trophy, Newspaper, Play, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock search results data
const mockSearchResults = {
  games: [
    {
      id: "lakers-warriors",
      type: "game",
      title: "Lakers vs Warriors",
      description: "Live NBA game with playoff implications",
      status: "live",
      score: "LAL 98 - GSW 102",
      time: "3rd Quarter",
      date: "2024-01-15",
      sport: "NBA",
      image: "/nba-live-action.png",
    },
    {
      id: "chiefs-bills",
      type: "game",
      title: "Chiefs vs Bills",
      description: "AFC Championship Game",
      status: "upcoming",
      time: "8:00 PM ET",
      date: "2024-01-21",
      sport: "NFL",
      image: "/nfl-championship-game.png",
    },
  ],
  shows: [
    {
      id: "sportscenter",
      type: "show",
      title: "SportsCenter",
      description: "Latest sports news and highlights",
      duration: "60 min",
      rating: 4.8,
      episodes: 1250,
      image: "/generic-sports-broadcast.png",
    },
    {
      id: "nba-tonight",
      type: "show",
      title: "NBA Tonight",
      description: "In-depth NBA analysis and player interviews",
      duration: "30 min",
      rating: 4.6,
      episodes: 180,
      image: "/nba-studio-show.png",
    },
  ],
  news: [
    {
      id: "lakers-trade",
      type: "news",
      title: "Lakers Complete Blockbuster Trade",
      description: "Los Angeles Lakers acquire All-Star forward in multi-team deal",
      author: "Adrian Wojnarowski",
      date: "2024-01-15",
      category: "NBA",
      readTime: "3 min read",
      image: "/nba-trade-deadline.png",
    },
    {
      id: "mvp-race",
      type: "news",
      title: "MVP Race Heating Up",
      description: "Three players emerge as frontrunners for Most Valuable Player award",
      author: "Shams Charania",
      date: "2024-01-14",
      category: "NBA",
      readTime: "5 min read",
      image: "/nba-mvp-race.png",
    },
  ],
  teams: [
    {
      id: "lakers",
      type: "team",
      title: "Los Angeles Lakers",
      description: "NBA team based in Los Angeles, California",
      record: "28-15",
      conference: "Western Conference",
      sport: "NBA",
      image: "/lakers-logo.png",
    },
    {
      id: "warriors",
      type: "team",
      title: "Golden State Warriors",
      description: "NBA team based in San Francisco, California",
      record: "25-18",
      conference: "Western Conference",
      sport: "NBA",
      image: "/golden-state-warriors-logo.png",
    },
  ],
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [sportFilter, setSportFilter] = useState("all")
  const [results, setResults] = useState(mockSearchResults)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate search functionality
  const handleSearch = (query: string) => {
    setIsLoading(true)
    setSearchQuery(query)

    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would filter based on the query
      setResults(mockSearchResults)
      setIsLoading(false)
    }, 500)
  }

  const getAllResults = () => {
    return [...results.games, ...results.shows, ...results.news, ...results.teams]
  }

  const getResultCount = (type: string) => {
    if (type === "all") return getAllResults().length
    return results[type as keyof typeof results]?.length || 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      live: "bg-red-600 text-white animate-pulse",
      upcoming: "bg-blue-600 text-white",
      final: "bg-gray-600 text-white",
    }
    return variants[status as keyof typeof variants] || "bg-gray-600 text-white"
  }

  const renderGameCard = (game: any) => (
    <Link key={game.id} href={`/games/${game.id}`}>
      <Card className="group hover:bg-card/80 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <Badge className={getStatusBadge(game.status)}>
                  {game.status === "live" && <div className="w-2 h-2 bg-white rounded-full mr-1" />}
                  {game.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-foreground font-medium">{game.status === "live" ? game.score : game.time}</span>
                <span className="text-muted-foreground">{formatDate(game.date)}</span>
                <Badge variant="outline">{game.sport}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  const renderShowCard = (show: any) => (
    <Link key={show.id} href={`/shows/${show.id}`}>
      <Card className="group hover:bg-card/80 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={show.image || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {show.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{show.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {show.duration}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Play className="w-3 h-3" />
                  {show.episodes} episodes
                </span>
                <span className="text-yellow-500">★ {show.rating}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  const renderNewsCard = (article: any) => (
    <Link key={article.id} href={`/news/${article.id}`}>
      <Card className="group hover:bg-card/80 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">{article.category}</Badge>
                <span className="text-xs text-muted-foreground">{article.readTime}</span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>By {article.author}</span>
                <span>{formatDate(article.date)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  const renderTeamCard = (team: any) => (
    <Link key={team.id} href={`/teams/${team.id}`}>
      <Card className="group hover:bg-card/80 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={team.image || "/placeholder.svg"} alt={team.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {team.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{team.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-foreground font-medium">{team.record}</span>
                <span className="text-muted-foreground">{team.conference}</span>
                <Badge variant="outline">{team.sport}</Badge>
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
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Search Results</h1>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search games, shows, news, teams..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="NBA">NBA</SelectItem>
                <SelectItem value="NFL">NFL</SelectItem>
                <SelectItem value="MLB">MLB</SelectItem>
                <SelectItem value="NHL">NHL</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All ({getResultCount("all")})
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Games ({getResultCount("games")})
            </TabsTrigger>
            <TabsTrigger value="shows" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Shows ({getResultCount("shows")})
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              News ({getResultCount("news")})
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teams ({getResultCount("teams")})
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4">
                {getAllResults().map((result) => {
                  switch (result.type) {
                    case "game":
                      return renderGameCard(result)
                    case "show":
                      return renderShowCard(result)
                    case "news":
                      return renderNewsCard(result)
                    case "team":
                      return renderTeamCard(result)
                    default:
                      return null
                  }
                })}
              </TabsContent>

              <TabsContent value="games" className="space-y-4">
                {results.games.map(renderGameCard)}
              </TabsContent>

              <TabsContent value="shows" className="space-y-4">
                {results.shows.map(renderShowCard)}
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                {results.news.map(renderNewsCard)}
              </TabsContent>

              <TabsContent value="teams" className="space-y-4">
                {results.teams.map(renderTeamCard)}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Empty State */}
        {!isLoading && getAllResults().length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
