"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/navigation/header"
import {
  Heart,
  Bookmark,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  TrendingUp,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
}

export default async function NewsArticlePage({ params }: { params: Promise<{ articleId: string }> }) {
  const { articleId } = await params
  const [readingProgress, setReadingProgress] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(247)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  // Mock article data
  const article = {
    id: articleId,
    title: "Lakers Complete Blockbuster Trade to Acquire All-Star Guard in Multi-Team Deal",
    subtitle:
      "In a stunning move that reshapes the Western Conference playoff race, the Los Angeles Lakers have acquired three-time All-Star guard Marcus Thompson in a complex three-team trade involving the Miami Heat and Denver Nuggets.",
    category: "NBA",
    timestamp: "2 hours ago",
    author: {
      name: "Mike Chen",
      title: "Senior NBA Reporter",
      bio: "Mike has covered the NBA for over 15 years, specializing in trade analysis and salary cap mechanics. Follow him for the latest Lakers news and Western Conference updates.",
      avatar: "/placeholder.svg?height=64&width=64&text=MC",
    },
    heroImage: "/nba-trade-deadline.png",
    content: `
      <p>The trade, which was finalized late Tuesday evening, sends Thompson to Los Angeles in exchange for a package that includes two future first-round picks, guard Austin Reaves, and center Christian Wood. The deal also involves a complex web of additional players and draft considerations across all three teams.</p>

      <blockquote class="border-l-4 border-primary bg-muted p-6 my-8 italic text-lg">
        "This is a franchise-altering move that immediately makes us championship contenders. Marcus brings exactly what we need - elite scoring, veteran leadership, and playoff experience."
        <footer class="text-muted-foreground mt-2">- Rob Pelinka, Lakers General Manager</footer>
      </blockquote>

      <p>Thompson, 28, averaged 24.8 points, 6.2 assists, and 4.1 rebounds per game this season while shooting 38.7% from three-point range. His addition to a Lakers roster already featuring LeBron James and Anthony Davis creates one of the most formidable "Big Three" combinations in the NBA.</p>

      <div class="my-8 bg-muted rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-4">Trade Breakdown</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <h4 class="font-semibold text-purple-600 mb-2">Lakers Receive</h4>
            <ul class="text-sm space-y-1">
              <li>Marcus Thompson (G)</li>
              <li>2025 2nd Round Pick</li>
            </ul>
          </div>
          <div class="text-center">
            <h4 class="font-semibold text-yellow-600 mb-2">Heat Receive</h4>
            <ul class="text-sm space-y-1">
              <li>Austin Reaves (G)</li>
              <li>2025 1st Round Pick</li>
              <li>Cash Considerations</li>
            </ul>
          </div>
          <div class="text-center">
            <h4 class="font-semibold text-blue-600 mb-2">Nuggets Receive</h4>
            <ul class="text-sm space-y-1">
              <li>Christian Wood (C)</li>
              <li>2026 1st Round Pick</li>
              <li>Trade Exception</li>
            </ul>
          </div>
        </div>
      </div>

      <p>The move comes as the Lakers sit currently in 8th place in the Western Conference with a 32-28 record. General Manager Rob Pelinka had been under pressure to make a significant move before the trade deadline, and this deal addresses the team's long-standing need for reliable perimeter scoring and playmaking.</p>

      <p>Thompson is expected to make his Lakers debut on Friday night against the Phoenix Suns at Crypto.com Arena. The team has already updated their depth chart to feature Thompson as the starting shooting guard alongside Russell Westbrook in the backcourt.</p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Impact on Championship Odds</h2>
      
      <p>Sportsbooks immediately adjusted the Lakers' championship odds following the trade announcement. The team moved from +1200 to +650, representing the largest single-day movement for any team this season. NBA analysts are calling it the most significant midseason acquisition since the Chris Paul trade to Phoenix in 2020.</p>

      <div class="bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-900/20 dark:to-yellow-900/20 p-6 rounded-lg my-8">
        <h3 class="text-lg font-semibold mb-3">What This Means for the Lakers</h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-start space-x-2">
            <span class="text-green-600 mt-0.5">✓</span>
            <span>Immediate upgrade in perimeter shooting and shot creation</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-green-600 mt-0.5">✓</span>
            <span>Veteran leadership and playoff experience</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-green-600 mt-0.5">✓</span>
            <span>Better spacing for LeBron James and Anthony Davis</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-yellow-600 mt-0.5">⚠</span>
            <span>Loss of future draft capital limits flexibility</span>
          </li>
        </ul>
      </div>

      <p>The trade represents a clear "win-now" mentality from the Lakers organization, as they look to maximize the remaining years of LeBron James' career. At 39, James has publicly stated his desire to compete for championships, and this move demonstrates the franchise's commitment to that goal.</p>
    `,
  }

  const comments: Comment[] = [
    {
      id: "1",
      author: "LakersNation24",
      avatar: "/placeholder.svg?height=40&width=40&text=LN",
      content:
        "This is exactly what we needed! Thompson's shooting will open up so much space for LeBron and AD. Finally, a championship-caliber roster!",
      timestamp: "1 hour ago",
      likes: 12,
      replies: [
        {
          id: "1-1",
          author: "HeatFan305",
          avatar: "/placeholder.svg?height=32&width=32&text=HF",
          content: "We're gonna miss Thompson but Reaves is a solid pickup for us. Good trade for both teams.",
          timestamp: "45 min ago",
          likes: 5,
        },
      ],
    },
    {
      id: "2",
      author: "NBAAnalyst",
      avatar: "/placeholder.svg?height=40&width=40&text=NA",
      content:
        "Great analysis in the article. The salary cap implications are fascinating - Lakers are now committed to luxury tax but it's worth it for a championship window.",
      timestamp: "2 hours ago",
      likes: 8,
    },
  ]

  const trendingStories = [
    {
      title: "Warriors Consider Major Roster Shakeup Before Deadline",
      image: "/placeholder.svg?height=64&width=64&text=Warriors",
      reads: "2.1k",
    },
    {
      title: "Rookie of the Year Race Heats Up in Final Months",
      image: "/placeholder.svg?height=64&width=64&text=ROY",
      reads: "1.8k",
    },
    {
      title: "NBA All-Star Voting Results: First Update Released",
      image: "/placeholder.svg?height=64&width=64&text=ASG",
      reads: "1.5k",
    },
  ]

  const liveScores = [
    { home: "Lakers", away: "Suns", homeScore: 108, awayScore: 112, quarter: "4th Quarter", time: "2:34" },
    { home: "Warriors", away: "Nets", homeScore: 125, awayScore: 118, quarter: "Final", time: "W" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector("article")
      if (article) {
        const articleHeight = article.offsetHeight
        const windowHeight = window.innerHeight
        const scrollTop = window.pageYOffset
        const articleTop = article.offsetTop

        const progress = Math.min(100, Math.max(0, ((scrollTop - articleTop + windowHeight / 2) / articleHeight) * 100))

        setReadingProgress(progress)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const title = article.title

    switch (platform) {
      case "copy":
        await navigator.clipboard.writeText(url)
        // Show toast notification
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
    }
  }

  const toggleCommentExpansion = (commentId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white py-2 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8 font-semibold">🔴 BREAKING:</span>
          <span className="mx-8">Lakers complete blockbuster trade for All-Star guard</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Warriors sign veteran center to 2-year deal</span>
          <span className="mx-8">•</span>
          <span className="mx-8">NBA announces new playoff format changes</span>
        </div>
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-2">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="destructive" className="bg-red-600">
                  BREAKING
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {article.category} • {article.timestamp}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{article.subtitle}</p>

              {/* Hero Image */}
              <div className="relative mb-8 overflow-hidden rounded-lg">
                <img
                  src={article.heroImage || "/placeholder.svg"}
                  alt="Lakers trade announcement"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded">
                  <p className="text-sm">Lakers players celebrate the blockbuster trade announcement</p>
                </div>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="flex items-center justify-between mb-8 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Share this story:</span>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleShare("facebook")} className="bg-blue-600 hover:bg-blue-700">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleShare("twitter")} className="bg-sky-500 hover:bg-sky-600">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleShare("copy")} variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? "text-red-600" : "text-muted-foreground"}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={isBookmarked ? "text-blue-600" : "text-muted-foreground"}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Author Bio */}
            <div className="border-t border-border pt-8 mt-8">
              <div className="flex items-start space-x-4 p-6 bg-muted rounded-lg">
                <img
                  src={article.author.avatar || "/placeholder.svg"}
                  alt={article.author.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{article.author.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{article.author.title}</p>
                  <p className="text-sm mb-3">{article.author.bio}</p>
                  <div className="flex space-x-3">
                    <Button variant="ghost" size="sm">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-border pt-8 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Comments ({comments.length + 1})</h2>
                <Button onClick={() => setShowCommentForm(!showCommentForm)}>Add Comment</Button>
              </div>

              {/* Comment Form */}
              {showCommentForm && (
                <div className="mb-8 p-4 border border-border rounded-lg">
                  <textarea
                    placeholder="Share your thoughts on this trade..."
                    className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm">
                        Photo
                      </Button>
                      <Button variant="ghost" size="sm">
                        Link
                      </Button>
                    </div>
                    <Button size="sm">Post Comment</Button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <img
                      src={comment.avatar || "/placeholder.svg"}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{comment.author}</h4>
                        <span className="text-muted-foreground text-sm">• {comment.timestamp}</span>
                      </div>
                      <p className="text-sm mb-3">{comment.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Heart className="w-4 h-4 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          Reply
                        </Button>
                        {comment.replies && comment.replies.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => toggleCommentExpansion(comment.id)}
                          >
                            {expandedComments.has(comment.id) ? (
                              <>
                                Hide replies <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Show replies ({comment.replies.length}) <ChevronDown className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Threaded Replies */}
                      {comment.replies && expandedComments.has(comment.id) && (
                        <div className="ml-6 mt-4 border-l-2 border-border pl-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <img
                                src={reply.avatar || "/placeholder.svg"}
                                alt={reply.author}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h5 className="font-medium text-sm">{reply.author}</h5>
                                  <span className="text-muted-foreground text-xs">• {reply.timestamp}</span>
                                </div>
                                <p className="text-sm mb-2">{reply.content}</p>
                                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {reply.likes}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Live Scores Widget */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-red-600" />
                  Live Scores
                </h3>
                <div className="space-y-3">
                  {liveScores.map((game, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded">
                      <div className="text-sm">
                        <div className="font-medium">
                          {game.home} vs {game.away}
                        </div>
                        <div className="text-muted-foreground">{game.quarter}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-bold">
                          {game.homeScore}-{game.awayScore}
                        </div>
                        <div className="text-muted-foreground">{game.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-primary">
                  View all games →
                </Button>
              </div>

              {/* Trending Stories */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {trendingStories.map((story, index) => (
                    <article key={index} className="flex space-x-3 group cursor-pointer">
                      <img
                        src={story.image || "/placeholder.svg"}
                        alt="Trending story"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {story.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{story.reads} reads</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-6">
                <h3 className="font-semibold mb-2">Stay Updated</h3>
                <p className="text-sm opacity-90 mb-4">
                  Get the latest Lakers news and trade analysis delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 rounded-lg bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <Button className="w-full bg-white text-primary hover:bg-gray-100">Subscribe</Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
