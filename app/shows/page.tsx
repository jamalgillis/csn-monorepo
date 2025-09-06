"use client"

import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Filter, Grid, List, Play, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


const sortOptions = ["Popular", "Newest", "A-Z"]

export default function ShowsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("Popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showLiveOnly, setShowLiveOnly] = useState(false)

  // Get shows from database
  const showsData = useQuery(api.sports.getAllShows)

  // Extract categories dynamically from the data
  const categories = useMemo(() => {
    if (!showsData) return ["All"]
    const uniqueCategories = ["All", ...new Set(showsData.map(show => show.category))]
    return uniqueCategories
  }, [showsData])

  const filteredAndSortedShows = useMemo(() => {
    if (!showsData) return []
    
    const filtered = showsData.filter((show) => {
      const matchesSearch =
        show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || show.category === selectedCategory
      const matchesLive = !showLiveOnly || show.status === "live"
      return matchesSearch && matchesCategory && matchesLive
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Popular":
          return Number.parseFloat(b.viewers.replace(/[KM]/g, "")) - Number.parseFloat(a.viewers.replace(/[KM]/g, ""))
        case "Newest":
          return b.episodes - a.episodes
        case "A-Z":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [showsData, searchQuery, selectedCategory, sortBy, showLiveOnly])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-600 text-white animate-pulse">LIVE</Badge>
      case "new":
        return <Badge className="bg-blue-600 text-white">NEW</Badge>
      default:
        return <Badge variant="secondary">AVAILABLE</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sports Shows</h1>
          <p className="text-muted-foreground text-lg">
            Discover all your favorite sports shows, from breaking news to in-depth analysis
          </p>
        </div>

        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border pb-4 mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search shows, topics, or hosts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Live Filter Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={showLiveOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLiveOnly(!showLiveOnly)}
                className={showLiveOnly ? "bg-red-600 text-white animate-pulse" : ""}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                Live Only
              </Button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option}
                    variant={sortBy === option ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortBy(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedShows.length} show{filteredAndSortedShows.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
            {showLiveOnly && " (live only)"}
          </p>
        </div>

        {/* Shows Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedShows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}`}>
                <Card className="group cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden bg-card border-border">
                  <div className="relative aspect-video">
                    <Image src={show.thumbnail || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute top-2 left-2">{getStatusBadge(show.status)}</div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/60 text-white">
                        {show.duration}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {show.title}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500 hidden">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs">{show.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{show.description}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{show.episodes} episodes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{show.viewers}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {show.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {show.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{show.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedShows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}`}>
                <Card className="group cursor-pointer hover:bg-accent/50 transition-all duration-300 p-4">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <Image
                        src={show.thumbnail || "/placeholder.svg"}
                        alt={show.title}
                        fill
                        className="object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {show.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{show.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(show.status)}
                          <div className="flex items-center gap-1 text-yellow-500 hidden">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs">{show.rating}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{show.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {show.duration} • {show.episodes} episodes
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{show.viewers} viewers</span>
                        </div>
                        <div className="flex gap-1">
                          {show.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedShows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No shows found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setShowLiveOnly(false)
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
