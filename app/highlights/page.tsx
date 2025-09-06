"use client"

import { useState, useEffect } from "react"
import { Search, Play, Clock, Eye, Calendar, TrendingUp, Zap } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface Highlight {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  sport: string
  teams: string[]
  date: string
  category: string
  trending?: boolean
}

const highlightsData: Highlight[] = [
  {
    id: "1",
    title: "LeBron's Game-Winning Three Pointer",
    description: "LeBron James hits the clutch three-pointer with 2.3 seconds left to seal the victory for the Lakers",
    thumbnail: "/nba-live-action.png",
    duration: "0:45",
    views: "2.1M",
    sport: "NBA",
    teams: ["Lakers", "Warriors"],
    date: "2024-01-15",
    category: "Game Winners",
    trending: true,
  },
  {
    id: "2",
    title: "Mahomes 50-Yard Touchdown Pass",
    description: "Patrick Mahomes launches a perfect 50-yard touchdown pass to Travis Kelce in the fourth quarter",
    thumbnail: "/nfl-championship-game.png",
    duration: "1:12",
    views: "1.8M",
    sport: "NFL",
    teams: ["Chiefs", "Bills"],
    date: "2024-01-14",
    category: "Touchdowns",
  },
  {
    id: "3",
    title: "Curry's Deep Three from Logo",
    description: "Stephen Curry pulls up from the logo and drains an incredible three-pointer",
    thumbnail: "/golden-state-warriors-logo.png",
    duration: "0:32",
    views: "3.2M",
    sport: "NBA",
    teams: ["Warriors", "Celtics"],
    date: "2024-01-13",
    category: "Three Pointers",
    trending: true,
  },
  {
    id: "4",
    title: "Aaron Judge Home Run Derby",
    description: "Aaron Judge crushes a 450-foot home run in the bottom of the 9th inning",
    thumbnail: "/baseball-home-run.png",
    duration: "0:28",
    views: "892K",
    sport: "MLB",
    teams: ["Yankees", "Red Sox"],
    date: "2024-01-12",
    category: "Home Runs",
  },
  {
    id: "5",
    title: "Giannis Monster Dunk",
    description: "Giannis Antetokounmpo throws down a thunderous dunk over two defenders",
    thumbnail: "/basketball-dunk.png",
    duration: "0:18",
    views: "1.5M",
    sport: "NBA",
    teams: ["Bucks", "Heat"],
    date: "2024-01-11",
    category: "Dunks",
  },
  {
    id: "6",
    title: "Messi's Incredible Free Kick",
    description: "Lionel Messi bends a perfect free kick into the top corner from 25 yards out",
    thumbnail: "/soccer-free-kick-goal.png",
    duration: "0:35",
    views: "4.1M",
    sport: "MLS",
    teams: ["Inter Miami", "LAFC"],
    date: "2024-01-10",
    category: "Goals",
    trending: true,
  },
]

const categories = [
  { id: "all", name: "All Highlights", icon: <Zap className="w-4 h-4" /> },
  { id: "trending", name: "Trending", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "game-winners", name: "Game Winners", icon: <Clock className="w-4 h-4" /> },
  { id: "dunks", name: "Best Dunks", icon: <Zap className="w-4 h-4" /> },
  { id: "touchdowns", name: "Touchdowns", icon: <Zap className="w-4 h-4" /> },
  { id: "goals", name: "Goals", icon: <Zap className="w-4 h-4" /> },
]

export default function HighlightsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredHighlights, setFilteredHighlights] = useState(highlightsData)

  useEffect(() => {
    let filtered = highlightsData

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (highlight) =>
          highlight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          highlight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          highlight.teams.some((team) => team.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by sport
    if (selectedSport !== "all") {
      filtered = filtered.filter((highlight) => highlight.sport === selectedSport)
    }

    // Filter by category
    if (selectedCategory === "trending") {
      filtered = filtered.filter((highlight) => highlight.trending)
    } else if (selectedCategory !== "all") {
      filtered = filtered.filter((highlight) => highlight.category.toLowerCase().replace(" ", "-") === selectedCategory)
    }

    // Sort highlights
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "most-viewed":
          return Number.parseFloat(b.views) - Number.parseFloat(a.views)
        case "trending":
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
        default:
          return 0
      }
    })

    setFilteredHighlights(filtered)
  }, [searchQuery, selectedSport, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <Zap className="w-8 h-8 mr-3 text-yellow-400" />
            Sports Highlights Library
          </h1>
          <p className="text-muted-foreground text-lg">Discover the best moments from your favorite sports and teams</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search highlights, teams, or players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="NBA">NBA</SelectItem>
                  <SelectItem value="NFL">NFL</SelectItem>
                  <SelectItem value="MLB">MLB</SelectItem>
                  <SelectItem value="MLS">MLS</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="most-viewed">Most Viewed</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">Showing {filteredHighlights.length} highlights</p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHighlights.map((highlight) => (
            <div
              key={highlight.id}
              className="sports-card hover:transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={highlight.thumbnail || "/placeholder.svg"}
                    alt={highlight.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </AspectRatio>

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-lg opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 text-black p-3 rounded-full hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                  {highlight.duration}
                </div>

                {/* Trending Badge */}
                {highlight.trending && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {highlight.sport}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {highlight.category}
                  </Badge>
                </div>

                <h3 className="font-semibold mb-2 text-white line-clamp-2">{highlight.title}</h3>

                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{highlight.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {highlight.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(highlight.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">{highlight.teams.join(" vs ")}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredHighlights.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Highlights
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredHighlights.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No highlights found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedSport("all")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
