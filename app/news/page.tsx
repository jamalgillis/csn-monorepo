"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/navigation/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const newsCategories = [
  { id: "all", name: "All News", color: "bg-gray-500" },
  { id: "breaking", name: "Breaking", color: "bg-red-500" },
  { id: "trade-rumors", name: "Trade Rumors", color: "bg-blue-500" },
  { id: "injury-updates", name: "Injury Updates", color: "bg-red-600" },
  { id: "draft-analysis", name: "Draft Analysis", color: "bg-green-500" },
  { id: "coaching", name: "Coaching", color: "bg-purple-500" },
  { id: "fantasy", name: "Fantasy", color: "bg-cyan-500" },
]

const dummyNews = [
  {
    id: "lakers-trade-rumors",
    title: "Lakers Exploring Trade Options Before Deadline",
    excerpt:
      "Los Angeles Lakers front office reportedly in discussions with multiple teams as the trade deadline approaches.",
    category: "trade-rumors",
    author: "Adrian Wojnarowski",
    publishedAt: "2 hours ago",
    readTime: "3 min read",
    views: "12.5K",
    image: "/nba-trade-deadline.png",
    isBreaking: false,
    isTrending: true,
  },
  {
    id: "injury-report",
    title: "BREAKING: Star Player Suffers Ankle Injury",
    excerpt:
      "Initial reports suggest the injury occurred during practice. Team medical staff is conducting further evaluation.",
    category: "breaking",
    author: "Shams Charania",
    publishedAt: "45 minutes ago",
    readTime: "2 min read",
    views: "25.8K",
    image: "/sports-injury-report.png",
    isBreaking: true,
    isTrending: true,
  },
  {
    id: "draft-prospects",
    title: "Top 10 Draft Prospects to Watch This Season",
    excerpt: "Comprehensive analysis of the most promising college players entering the upcoming draft.",
    category: "draft-analysis",
    author: "Jonathan Givony",
    publishedAt: "4 hours ago",
    readTime: "8 min read",
    views: "8.2K",
    image: "/college-basketball-prospects.png",
    isBreaking: false,
    isTrending: false,
  },
  {
    id: "coaching-changes",
    title: "Coaching Carousel: Three Teams Make Changes",
    excerpt: "Multiple franchises announce coaching staff adjustments as the season progresses.",
    category: "coaching",
    author: "Marc Stein",
    publishedAt: "6 hours ago",
    readTime: "5 min read",
    views: "15.3K",
    image: "/nba-coaching-changes.png",
    isBreaking: false,
    isTrending: false,
  },
  {
    id: "fantasy-waiver",
    title: "Fantasy Waiver Wire: Week 12 Pickups",
    excerpt: "Essential fantasy basketball pickups and drops for the upcoming week of games.",
    category: "fantasy",
    author: "Matthew Berry",
    publishedAt: "8 hours ago",
    readTime: "6 min read",
    views: "9.7K",
    image: "/fantasy-basketball-waiver.png",
    isBreaking: false,
    isTrending: false,
  },
  {
    id: "playoff-race",
    title: "Western Conference Playoff Race Heating Up",
    excerpt:
      "With just weeks remaining, multiple teams are fighting for the final playoff spots in a competitive Western Conference.",
    category: "draft-analysis",
    author: "Zach Lowe",
    publishedAt: "12 hours ago",
    readTime: "7 min read",
    views: "18.9K",
    image: "/nba-playoff-race.png",
    isBreaking: false,
    isTrending: true,
  },
]

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredNews, setFilteredNews] = useState(dummyNews)

  useEffect(() => {
    let filtered = dummyNews

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort articles
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "popular":
          return (
            Number.parseInt(b.views.replace("K", "000").replace(".", "")) -
            Number.parseInt(a.views.replace("K", "000").replace(".", ""))
          )
        case "trending":
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0)
        default:
          return 0
      }
    })

    setFilteredNews(filtered)
  }, [searchQuery, selectedCategory, sortBy])

  const getCategoryInfo = (categoryId: string) => {
    return newsCategories.find((cat) => cat.id === categoryId) || newsCategories[0]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sports News</h1>
          <p className="text-muted-foreground text-lg">Stay updated with the latest sports news and analysis</p>
        </div>

        {/* Filters Section - Sticky */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border mb-8 pb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {newsCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? `${category.color} text-white` : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Newest
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Most Popular
                  </div>
                </SelectItem>
                <SelectItem value="trending">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredNews.length} article{filteredNews.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" && ` in ${getCategoryInfo(selectedCategory).name}`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => {
            const categoryInfo = getCategoryInfo(article.category)

            return (
              <Link key={article.id} href={`/news/${article.id}`}>
                <Card className="sports-card group cursor-pointer h-full">
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {article.isBreaking && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-600 text-white animate-pulse">BREAKING</Badge>
                        </div>
                      )}
                      {article.isTrending && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-yellow-500 text-black">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${categoryInfo.color} text-white text-xs`}>{categoryInfo.name}</Badge>
                      <span className="text-xs text-muted-foreground">{article.publishedAt}</span>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By {article.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSortBy("newest")
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
