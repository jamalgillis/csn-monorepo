"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"
import { Header } from "@/components/navigation/header"
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Share,
  Plus,
  Heart,
  Share2,
  Bell,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Tv2,
  Star,
  Calendar,
  Tv,
  Radio,
  ChevronLeft,
  Zap,
  Newspaper,
  Repeat,
  Send,
  Smile,
  ThumbsUp,
  Flame,
  Crown,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ShowDetailPage() {
  const params = useParams()
  const router = useRouter()
  const showId = params.showId as string
  const { user } = useUser()
  
  // Validate showId
  const isValidShowId = showId && showId !== 'undefined' && typeof showId === 'string' && showId.length > 0
  
  // Fetch show details from database
  const showData = useQuery(api.sports.getShowDetails, 
    isValidShowId ? { showId: showId as Id<"content"> } : "skip"
  )
  
  // Get current user from database
  const currentUser = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  )

  // Rating queries and mutations  
  const userRating = useQuery(api.content.getUserRating, 
    currentUser && isValidShowId ? { contentId: showId as Id<"content">, userId: currentUser._id } : "skip"
  )
  const ratingSummary = useQuery(api.content.getContentRatings, 
    isValidShowId ? { contentId: showId as Id<"content"> } : "skip"
  )
  const rateContentMutation = useMutation(api.content.rateContent)
  const removeRatingMutation = useMutation(api.content.removeRating)
  
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeTab, setActiveTab] = useState("episodes")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [viewerCount, setViewerCount] = useState(45234)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "SportsGuru23",
      message: "This trade deadline coverage is incredible! 🔥",
      timestamp: "2:34 PM",
      type: "fan",
      reactions: { fire: 12, thumbsUp: 8 },
    },
    {
      id: 2,
      user: "ESPNInsider",
      message: "Breaking: More trades expected before the deadline",
      timestamp: "2:35 PM",
      type: "verified",
      reactions: { fire: 24, thumbsUp: 15 },
      highlighted: true,
    },
    {
      id: 3,
      user: "ModeratorMike",
      message: "Keep the discussion respectful everyone!",
      timestamp: "2:36 PM",
      type: "moderator",
      reactions: { fire: 0, thumbsUp: 5 },
    },
    {
      id: 4,
      user: "BasketballFan",
      message: "Scott Van Pelt's analysis is always on point",
      timestamp: "2:37 PM",
      type: "fan",
      reactions: { thumbsUp: 18, fire: 6 },
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState(1247)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => Math.max(1000, prev + Math.floor(Math.random() * 200) - 100))
      setOnlineUsers((prev) => Math.max(500, prev + Math.floor(Math.random() * 50) - 25))
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Invalid showId state
  if (!isValidShowId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-muted-foreground mb-4">Invalid Show ID</h1>
            <p className="text-muted-foreground mb-8">The show ID provided is not valid.</p>
            <button 
              onClick={() => router.push('/shows')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Back to Shows
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Loading state
  if (showData === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading show...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show not found
  if (showData === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-muted-foreground mb-4">Show Not Found</h1>
            <p className="text-muted-foreground mb-8">The show you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => router.push('/shows')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
            >
              Back to Shows
            </button>
          </div>
        </main>
      </div>
    )
  }

  const show = showData
  
  const episodes = [
    {
      id: 1,
      title: "Today's SportsCenter",
      description: "Live coverage of today's biggest sports stories",
      thumbnail: "/generic-sports-broadcast.png",
      duration: "6:00 PM",
      isLive: true,
      views: "45K watching",
    },
    {
      id: 2,
      title: "Yesterday's SportsCenter",
      description: "NBA trade deadline recap and NFL playoffs preview",
      thumbnail: "/nba-trade-deadline.png",
      duration: "1:02:15",
      views: "1.2M views",
      progress: 33,
    },
    {
      id: 3,
      title: "Dec 12 - SportsCenter",
      description: "College football championship preview",
      thumbnail: "/college-football-championship.png",
      duration: "58:42",
      views: "890K views",
    },
    {
      id: 4,
      title: "Dec 11 - SportsCenter",
      description: "NBA MVP race and injury updates",
      thumbnail: "/nba-mvp-race.png",
      duration: "1:05:33",
      views: "756K views",
    },
  ]

  const segments = [
    {
      id: 1,
      title: "Top 10 Plays",
      description: "Best plays from this week",
      thumbnail: "/sports-highlights-collage.png",
      duration: "5:23",
      views: "2.1M views",
    },
    {
      id: 2,
      title: "Trade Deadline Special",
      description: "Latest trade rumors and analysis",
      thumbnail: "/nba-trade-deadline.png",
      duration: "12:45",
      views: "890K views",
    },
    {
      id: 3,
      title: "Plays of the Week",
      description: "Weekly highlight compilation",
      thumbnail: "/placeholder-pneoe.png",
      duration: "8:15",
      views: "1.5M views",
    },
    {
      id: 4,
      title: "Breaking News Alert",
      description: "Latest breaking sports news",
      thumbnail: "/placeholder-mwxwc.png",
      duration: "3:42",
      views: "3.2M views",
    },
  ]

  const hosts = [
    {
      id: 1,
      name: "Scott Van Pelt",
      role: "Host",
      description: "Late night SportsCenter anchor and host",
      avatar: "/placeholder-opjy9.png",
      status: "online",
    },
    {
      id: 2,
      name: "Stephen A. Smith",
      role: "Analyst",
      description: "Sports commentator and debate specialist",
      avatar: "/placeholder-f4xl3.png",
      status: "online",
    },
    {
      id: 3,
      name: "Elle Duncan",
      role: "Reporter",
      description: "SportsCenter anchor and NFL reporter",
      avatar: "/placeholder-ooo7w.png",
      status: "away",
    },
    {
      id: 4,
      name: "Mike Greenberg",
      role: "Host",
      description: "Morning show host and sports personality",
      avatar: "/placeholder-zqixp.png",
      status: "busy",
    },
  ]

  const socialPosts = [
    {
      id: 1,
      username: "@sportsaddict92",
      time: "2h",
      content: "Best SportsCenter episode this week! The trade deadline coverage was incredible 🔥",
      avatar: "/sports-fan-avatar.png",
      likes: 245,
      comments: 18,
      retweets: 67,
    },
    {
      id: 2,
      username: "@basketball_guru",
      time: "4h",
      content: "Trade deadline predictions were spot on 👏 Scott Van Pelt knows his stuff",
      avatar: "/basketball-fan-avatar.png",
      likes: 189,
      comments: 22,
      retweets: 41,
    },
    {
      id: 3,
      username: "@espn_viewer",
      time: "6h",
      content: "When is the next First Take crossover episode? Need more Stephen A debates!",
      avatar: "/generic-sports-fan-avatar.png",
      likes: 156,
      comments: 31,
      retweets: 28,
    },
  ]

  // Get similar shows from database query
  const similarShows = showData?.similarShows || []

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        user: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "fan" as const,
        reactions: { fire: 0, thumbsUp: 0 },
      }
      setChatMessages([...chatMessages, message])
      setNewMessage("")
    }
  }

  const handleReaction = (messageId: number, reaction: string) => {
    setChatMessages((messages) =>
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [reaction]: (msg.reactions[reaction as keyof typeof msg.reactions] || 0) + 1,
              },
            }
          : msg,
      ),
    )
  }

  const handleLikeToggle = async () => {
    if (!user || !currentUser || !isValidShowId) {
      // Redirect to sign in if not authenticated or user not in database
      router.push('/sign-in')
      return
    }

    try {
      if (userRating?.rating === "up") {
        // User already liked it, so remove the rating (unlike)
        await removeRatingMutation({ 
          contentId: showId as Id<"content">,
          userId: currentUser._id
        })
      } else {
        // User hasn't liked it or previously disliked it, so like it
        await rateContentMutation({ 
          contentId: showId as Id<"content">, 
          userId: currentUser._id,
          rating: "up" as const 
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Navigation */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground p-0 transition-all hover:-translate-x-1"
            onClick={() => router.push('/shows')}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Shows
          </Button>
        </div>

        {/* Main Video Player Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            <div className={`absolute top-4 left-4 z-20 flex items-center space-x-3 ${show.video_url ? 'hidden' : ''}`}>
              {show.status === 'live' ? (
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  LIVE
                </div>
              ) : (
                <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  UPCOMING
                </div>
              )}
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {viewerCount.toLocaleString()} viewers
              </div>
            </div>

            {/* Video Content */}
            {show.video_url ? (
              <iframe
                src={show.video_url}
                title={show.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
              />
            ) : (
              <img 
                src={show.backdrop_url || show.poster_url || "/placeholder.svg"} 
                alt={show.title} 
                className="w-full h-full object-cover" 
              />
            )}

            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm p-6 ${show.video_url ? 'hidden' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all hover:scale-110"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <span className="text-sm font-medium text-white">{show.title}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <select className="bg-white/20 border border-white/30 rounded px-3 py-1 text-sm text-white backdrop-blur-sm">
                    <option>Auto (720p)</option>
                    <option>1080p</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                  <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white text-sm backdrop-blur-sm">
                    <Maximize className="w-4 h-4 mr-1" />
                    Fullscreen
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  >
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Show Information Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Show Details */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
                  <p className="text-muted-foreground mb-3">{show.description}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-current animate-fade-in"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">4.8/5</span>
                    </div>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{show.category}</span>
                  </div>
                </div>
                {show.status === 'live' && (
                  <div className="border-2 border-red-500 rounded-lg p-2 animate-pulse">
                    <div className="text-center">
                      <div className="text-red-400 font-semibold text-sm">LIVE NOW</div>
                      <div className="text-xs text-muted-foreground">{show.schedule || 'Live'}</div>
                    </div>
                  </div>
                )}
                {show.status !== 'live' && (
                  <div className="border-2 border-gray-500 rounded-lg p-2">
                    <div className="text-center">
                      <div className="text-gray-400 font-semibold text-sm">UPCOMING</div>
                      <div className="text-xs text-muted-foreground">{show.schedule || 'TBA'}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>{show.schedule || 'Live'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tv className="w-4 h-4 text-purple-400" />
                  <span>{show.year || 'Live Content'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-green-400" />
                  <span>{show.status === 'live' ? 'Live Now' : show.category}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-4">
                <Button
                  className={`w-full transition-all duration-300 hover:scale-105 ${
                    isSubscribed
                      ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                      : "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
                  }`}
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? (
                    <>
                      <Star className="w-5 h-5 mr-2" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleLikeToggle}
                    className={`flex items-center justify-center hover:scale-105 transition-all duration-300 ${
                      userRating?.rating === "up"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <Heart 
                      className={`w-4 h-4 mr-1 transition-all duration-300 ${
                        userRating?.rating === "up" ? "fill-current" : ""
                      }`} 
                    />
                    {userRating?.rating === "up" ? "Liked" : "Like"}
                    {ratingSummary && ratingSummary.upRatings > 0 && (
                      <span className="ml-1 text-xs">
                        ({ratingSummary.upRatings})
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>

                <Button variant="secondary" className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-3 text-sm">Show Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span>{show.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={show.status === 'live' ? 'text-green-400' : 'text-gray-400'}>{show.status?.toUpperCase() || 'UPCOMING'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span>{show.year || 'Current'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Show Chat Section */}
        <section className="mb-8 animate-fade-in hidden" style={{ animationDelay: "0.35s" }}>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 border-b border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold">Live Show Chat</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{onlineUsers.toLocaleString()} chatting</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Smile className="w-4 h-4 mr-1" />
                    Emojis
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background/50 to-background">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all hover:bg-muted/50 ${
                    msg.highlighted ? "bg-yellow-500/10 border border-yellow-500/20" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        msg.type === "moderator"
                          ? "bg-green-600 text-white"
                          : msg.type === "verified"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-white"
                      }`}
                    >
                      {msg.type === "moderator" ? (
                        <Shield className="w-4 h-4" />
                      ) : msg.type === "verified" ? (
                        <Crown className="w-4 h-4" />
                      ) : (
                        msg.user[0]
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`font-semibold text-sm ${
                          msg.type === "moderator"
                            ? "text-green-400"
                            : msg.type === "verified"
                              ? "text-blue-400"
                              : "text-foreground"
                        }`}
                      >
                        {msg.user}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm break-words">{msg.message}</p>
                    {Object.keys(msg.reactions).length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        {Object.entries(msg.reactions).map(([reaction, count]) => (
                          <button
                            key={reaction}
                            onClick={() => handleReaction(msg.id, reaction)}
                            className="flex items-center space-x-1 bg-muted hover:bg-muted/80 rounded-full px-2 py-1 text-xs transition-all hover:scale-105"
                          >
                            {reaction === "fire" ? (
                              <Flame className="w-3 h-3 text-orange-400" />
                            ) : (
                              <ThumbsUp className="w-3 h-3 text-blue-400" />
                            )}
                            <span>{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>Someone is typing...</span>
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(chatMessages[chatMessages.length - 1]?.id, "fire")}
                    className="hover:bg-orange-500/20 hover:text-orange-400"
                  >
                    <Flame className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(chatMessages[chatMessages.length - 1]?.id, "thumbsUp")}
                    className="hover:bg-blue-500/20 hover:text-blue-400"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share your thoughts about the show..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleSendMessage} size="sm" className="flex-shrink-0 p-2 min-w-[36px] min-h-[36px]">
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="mb-8 animate-fade-in hidden" style={{ animationDelay: "0.4s" }}>
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {[
                { id: "episodes", label: "Episodes", icon: Tv },
                { id: "highlights", label: "Highlights", icon: Zap },
                { id: "news", label: "News", icon: Newspaper },
                { id: "discussion", label: "Discussion", icon: MessageSquare },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`py-3 px-1 font-medium transition-all duration-300 relative ${
                    activeTab === id
                      ? "text-red-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-400 after:animate-fade-in"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === "episodes" && (
          <div>
            {/* Latest Episodes */}
            <section className="mb-8 animate-fade-in hidden" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-red-400" />
                  Latest Episodes
                </h2>
                <Button variant="ghost" className="text-red-400 hover:text-red-300">
                  See All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="flex-none w-80 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                    >
                      <div className="relative">
                        <img
                          src={episode.thumbnail || "/placeholder.svg"}
                          alt={episode.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                          <Button
                            size="icon"
                            className="bg-white/90 text-black hover:bg-white hover:scale-110 transition-all"
                          >
                            <Play className="w-8 h-8" />
                          </Button>
                        </div>
                        {episode.isLive && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold animate-pulse">
                            🔴 LIVE
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                          {episode.duration}
                        </div>
                        {episode.progress && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 h-1">
                            <div
                              className="bg-red-500 h-full transition-all duration-500"
                              style={{ width: `${episode.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{episode.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{episode.description}</p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-medium ${
                              episode.isLive ? "text-green-400" : episode.progress ? "text-yellow-400" : "text-blue-400"
                            }`}
                          >
                            {episode.isLive ? "Live Now" : episode.progress ? "Continue Watching" : "Watch"}
                          </span>
                          <span className="text-muted-foreground text-xs">{episode.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Popular Segments */}
            <section className="mb-8 animate-fade-in hidden" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3 text-yellow-400" />
                  Popular Segments
                </h2>
                <Button variant="ghost" className="text-red-400 hover:text-red-300">
                  See All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      className="flex-none w-72 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img
                          src={segment.thumbnail || "/placeholder.svg"}
                          alt={segment.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="icon" className="bg-white/90 text-black hover:bg-white">
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {segment.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{segment.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{segment.description}</p>
                        <span className="text-yellow-400 text-xs">{segment.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Show Hosts */}
            <section className="mb-8 animate-fade-in hidden" style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Users className="w-5 h-5 mr-3 text-purple-400" />
                  Show Hosts & Experts
                </h2>
                <Button variant="ghost" className="text-red-400 hover:text-red-300">
                  See All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {hosts.map((host) => (
                    <div
                      key={host.id}
                      className="flex-none w-56 bg-card border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative mb-4">
                        <img
                          src={host.avatar || "/placeholder.svg"}
                          alt={host.name}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background ${
                            host.status === "online"
                              ? "bg-green-500"
                              : host.status === "away"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <h3 className="font-semibold mb-1">{host.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{host.role}</p>
                      <p className="text-muted-foreground text-xs">{host.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Social Discussion */}
            <section className="mb-8 animate-fade-in hidden" style={{ animationDelay: "0.8s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <MessageSquare className="w-5 h-5 mr-3 text-blue-400" />
                  Related Discussion & Social
                </h2>
                <Button variant="ghost" className="text-red-400 hover:text-red-300">
                  See All
                </Button>
              </div>
              <div className="space-y-4">
                {socialPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-card border border-border rounded-lg p-4 hover:bg-card/80 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <img src={post.avatar || "/placeholder.svg"} alt="User" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">{post.username}</span>
                          <span className="text-muted-foreground text-xs">{post.time}</span>
                        </div>
                        <p className="text-sm mb-3">{post.content}</p>
                        <div className="flex items-center space-x-6 text-muted-foreground">
                          <button className="flex items-center space-x-1 text-xs hover:text-red-400 transition-all hover:scale-110">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-xs hover:text-blue-400 transition-all hover:scale-110">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-xs hover:text-green-400 transition-all hover:scale-110">
                            <Repeat className="w-4 h-4" />
                            <span>{post.retweets}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Similar Shows */}
            <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.9s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Tv2 className="w-5 h-5 mr-3 text-orange-400" />
                  Similar Shows You Might Like
                </h2>
                <Button variant="ghost" className="text-red-400 hover:text-red-300">
                  See All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {similarShows.length > 0 ? similarShows.map((similarShow) => (
                    <div
                      key={similarShow._id}
                      className="flex-none w-72 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                      onClick={() => router.push(`/shows/${similarShow._id}`)}
                    >
                      <img
                        src={similarShow.poster_url || similarShow.backdrop_url || "/placeholder.svg"}
                        alt={similarShow.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{similarShow.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{similarShow.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < 4 ? "fill-current" : "opacity-30"}`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">4.0</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/shows/${similarShow._id}`);
                            }}
                          >
                            Watch
                          </Button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex items-center justify-center w-full py-8">
                      <p className="text-muted-foreground">No similar shows available</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
