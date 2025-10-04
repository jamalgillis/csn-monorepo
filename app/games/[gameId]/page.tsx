"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { Play, Maximize, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/navigation/header"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"

interface GamePageProps {
  params: Promise<{
    gameId: string
  }>
}

interface GameEvent {
  id: string
  type: "score" | "turnover" | "rebound" | "timeout"
  player: string
  description: string
  time: string
  color: string
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: string
  avatar: string
  userType?: "fan" | "verified" | "moderator"
  reactions?: { emoji: string; count: number }[]
  isHighlighted?: boolean
}

interface PlayerStat {
  name: string
  initials: string
  points: number
  rebounds: number
  assists: number
  blocks?: number
  minutes: number
}

export default function GamePage({ params }: GamePageProps) {
  const [gameId, setGameId] = useState<string | null>(null)
  const router = useRouter()

  // Handle params Promise
  useEffect(() => {
    params.then(({ gameId }) => {
      setGameId(gameId)
    })
  }, [params])

  // Get game data from the games table
  const gameData = useQuery(
    api.sports.getGameById,
    gameId ? { gameId: gameId as Id<"games"> } : "skip"
  )

  // If the game doesn't exist, we could check if it's a content ID
  const contentCheck = useQuery(
    api.content.getContentById,
    gameId && !gameData ? { id: gameId as Id<"content"> } : "skip"
  )

  // If we found content with this ID, redirect to shows page
  useEffect(() => {
    if (contentCheck && contentCheck.type === "show") {
      router.replace(`/shows/${gameId}`)
      return
    }
  }, [contentCheck, gameId, router])

  // Fetch other games for sidebar
  const otherGames = useQuery(
    api.sports.getOtherGames,
    (gameId && gameData) ? { currentGameId: gameId as Id<"games"> } : "skip"
  )

  const [events, setEvents] = useState<GameEvent[]>([
    {
      id: "1",
      type: "score",
      player: "LeBron James",
      description: "3-pointer made (25 PTS)",
      time: "7:42",
      color: "bg-green-500",
    },
    {
      id: "2",
      type: "turnover",
      player: "Stephen Curry",
      description: "Turnover",
      time: "8:15",
      color: "bg-blue-500",
    },
    {
      id: "3",
      type: "rebound",
      player: "Anthony Davis",
      description: "Defensive rebound",
      time: "8:28",
      color: "bg-yellow-500",
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "John",
      message: "LeBron is on fire! 🔥",
      timestamp: "Just now",
      avatar: "J",
      userType: "fan",
      reactions: [
        { emoji: "🔥", count: 12 },
        { emoji: "👑", count: 8 },
      ],
    },
    {
      id: "2",
      user: "Mike",
      message: "Warriors need to step up their defense",
      timestamp: "2 min ago",
      avatar: "M",
      userType: "verified",
    },
    {
      id: "3",
      user: "Sarah",
      message: "What a game! Both teams playing amazing",
      timestamp: "3 min ago",
      avatar: "S",
      userType: "fan",
      isHighlighted: true,
    },
    {
      id: "4",
      user: "ChatModerator",
      message: "Welcome to the live game chat! Keep it respectful 🏀",
      timestamp: "5 min ago",
      avatar: "M",
      userType: "moderator",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(1247)

  const lakersPlayers: PlayerStat[] = [
    { name: "LeBron James", initials: "LJ", points: 25, rebounds: 8, assists: 6, minutes: 42 },
    { name: "Anthony Davis", initials: "AD", points: 18, rebounds: 12, assists: 3, blocks: 3, minutes: 38 },
  ]

  const warriorsPlayers: PlayerStat[] = [
    { name: "Stephen Curry", initials: "SC", points: 22, rebounds: 4, assists: 8, minutes: 40 },
    { name: "Klay Thompson", initials: "KT", points: 16, rebounds: 3, assists: 2, minutes: 35 },
  ]


  // Handle params Promise
  useEffect(() => {
    params.then(({ gameId }) => {
      setGameId(gameId)
    })
  }, [params])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: "You",
        message: newMessage,
        timestamp: "Just now",
        avatar: "Y",
        userType: "fan",
      }
      setChatMessages((prev) => [...prev, message])
      setNewMessage("")
      setIsTyping(false)
    }
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find((r) => r.emoji === emoji)

          if (existingReaction) {
            return {
              ...msg,
              reactions: reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
            }
          } else {
            return {
              ...msg,
              reactions: [...reactions, { emoji, count: 1 }],
            }
          }
        }
        return msg
      }),
    )
  }

  // Show loading state if we're redirecting to a show
  if (contentCheck && contentCheck.type === "show") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Redirecting to show...</p>
        </div>
      </div>
    )
  }

  if (!gameId || !gameData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Game Header */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {gameData.awayTeam.abbreviation}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {gameData.awayTeam.name} vs {gameData.homeTeam.name}
                    </h2>
                    <p className="text-muted-foreground">{gameData.sport} • {gameData.venue}</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {gameData.homeTeam.abbreviation}
                </div>
              </div>

              {/* Live Score */}
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-8 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-medium text-muted-foreground">{gameData.awayTeam.abbreviation}</p>
                      <p className="text-6xl font-bold text-primary">{gameData.awayScore}</p>
                    </div>
                    <div className="text-4xl font-light text-muted-foreground">-</div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-muted-foreground">{gameData.homeTeam.abbreviation}</p>
                      <p className="text-6xl font-bold text-primary animate-pulse">{gameData.homeScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-lg">
                    {gameData.gameState && (
                      <>
                        <span className="font-medium">{gameData.gameState.quarter}</span>
                        <span className="text-muted-foreground">{gameData.gameState.timeLeft}</span>
                      </>
                    )}
                    {gameData.status === "in_progress" && <Badge className="bg-red-600 text-white animate-pulse">• LIVE</Badge>}
                    {gameData.status === "scheduled" && <Badge className="bg-blue-600 text-white">SCHEDULED</Badge>}
                    {gameData.status === "final" && <Badge className="bg-green-600 text-white">FINAL</Badge>}
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {gameData.video_url ? (
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    src={gameData.video_url}
                    style={{
                      border: "none",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%"
                    }}
                    allow="accelerometer; gyroscope; encrypted-media; picture-in-picture; playsinline"
                    allowFullScreen={true}
                    title={`${gameData.awayTeam.name} vs ${gameData.homeTeam.name} Live Stream`}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-2">{gameData.sport}</div>
                    <div className="text-lg mb-2">{gameData.awayTeam.name} vs {gameData.homeTeam.name}</div>
                    <div className="text-sm opacity-75">{gameData.venue}</div>
                    {gameData.status === "scheduled" && (
                      <div className="text-sm mt-2 opacity-75">
                        {new Date(gameData.game_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Chat */}
            <div className="bg-card rounded-lg border border-border overflow-hidden hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Live Chat</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">{onlineUsers.toLocaleString()} online</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Join the conversation with fellow fans!</p>
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/50 to-background">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`animate-fade-in ${message.isHighlighted ? "bg-primary/5 -mx-2 px-2 py-1 rounded-lg border-l-2 border-primary" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Enhanced Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          message.userType === "moderator"
                            ? "bg-red-600 text-white"
                            : message.userType === "verified"
                              ? "bg-blue-600 text-white"
                              : "bg-primary text-white"
                        }`}
                      >
                        {message.avatar}
                        {message.userType === "verified" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px] text-white">✓</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* User Info */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-sm font-medium ${
                              message.userType === "moderator"
                                ? "text-red-500"
                                : message.userType === "verified"
                                  ? "text-blue-500"
                                  : "text-foreground"
                            }`}
                          >
                            {message.user}
                          </span>
                          {message.userType === "moderator" && (
                            <Badge className="bg-red-600 text-white text-[10px] px-1 py-0">MOD</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>

                        {/* Message Content */}
                        <p className="text-sm break-words leading-relaxed">{message.message}</p>

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                onClick={() => handleReaction(message.id, reaction.emoji)}
                                className="flex items-center gap-1 px-2 py-1 bg-muted hover:bg-muted/80 rounded-full text-xs transition-colors"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="text-muted-foreground">{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs">Someone is typing...</span>
                  </div>
                )}
              </div>

              {/* Enhanced Chat Input */}
              <div className="p-4 border-t border-border bg-muted/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value)
                      setIsTyping(e.target.value.length > 0)
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="flex-shrink-0 p-2 min-w-[36px] min-h-[36px] hover:scale-105 transition-transform"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>

                {/* Quick Reactions */}
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground mr-2">Quick:</span>
                  {["🔥", "👑", "💪", "😱", "👏"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setNewMessage((prev) => prev + emoji)
                      }}
                      className="p-1 hover:bg-muted rounded text-sm transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Timeline */}
            <div className="bg-card rounded-lg border border-border p-6 hidden">
              <h3 className="text-lg font-semibold mb-4">Game Timeline</h3>
              <div className="space-y-4">
                <div className="h-2 bg-gradient-to-r from-muted via-accent to-muted rounded-full relative cursor-pointer">
                  <div className="absolute top-[-6px] left-1/4 w-4 h-4 bg-primary border-2 border-background rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="absolute top-[-6px] left-2/4 w-4 h-4 bg-primary border-2 border-background rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="absolute top-[-6px] left-3/4 w-4 h-4 bg-accent border-2 border-background rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
                </div>
                <div className="grid grid-cols-4 text-sm text-muted-foreground">
                  <span>Q1</span>
                  <span>Q2</span>
                  <span className="font-medium text-foreground">Q3</span>
                  <span>Q4</span>
                </div>
              </div>

              {/* Recent Events */}
              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Recent Events</h4>
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-fade-in">
                      <div className={`w-2 h-2 ${event.color} rounded-full`}></div>
                      <span className="text-sm">
                        <strong>{event.player}</strong> {event.description}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Stats Comparison */}
            <div className="bg-card rounded-lg border border-border p-6 hidden">
              <h3 className="text-lg font-semibold mb-6">Team Statistics</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="animate-fade-in">
                    <p className="text-2xl font-bold text-primary">48.2%</p>
                    <p className="text-sm text-muted-foreground">Field Goal %</p>
                  </div>
                  <div className="animate-fade-in">
                    <p className="text-2xl font-bold text-primary">38</p>
                    <p className="text-sm text-muted-foreground">Rebounds</p>
                  </div>
                  <div className="animate-fade-in">
                    <p className="text-2xl font-bold text-primary">22</p>
                    <p className="text-sm text-muted-foreground">Assists</p>
                  </div>
                </div>

                {/* Stat Comparison Bars */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Field Goals</span>
                    <span className="text-sm text-muted-foreground">32/65 - 28/62</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full animate-fade-in" style={{ width: "65%" }}></div>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-secondary h-full rounded-full animate-fade-in" style={{ width: "58%" }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">3-Pointers</span>
                    <span className="text-sm text-muted-foreground">12/28 - 15/35</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full animate-fade-in" style={{ width: "43%" }}></div>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-secondary h-full rounded-full animate-fade-in" style={{ width: "48%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-card rounded-lg border border-border p-6 hidden">
              <h3 className="text-lg font-semibold mb-6">Top Performers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lakers Players */}
                <div>
                  <h4 className="font-medium mb-4 text-primary">Lakers</h4>
                  <div className="space-y-3">
                    {lakersPlayers.map((player) => (
                      <div
                        key={player.name}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {player.initials}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.points} PTS, {player.rebounds} REB, {player.assists} AST
                            {player.blocks && `, ${player.blocks} BLK`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{player.minutes} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warriors Players */}
                <div>
                  <h4 className="font-medium mb-4 text-secondary">Warriors</h4>
                  <div className="space-y-3">
                    {warriorsPlayers.map((player) => (
                      <div
                        key={player.name}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {player.initials}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.points} PTS, {player.rebounds} REB, {player.assists} AST
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{player.minutes} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Starting Lineups - Hidden until database provides lineup data */}
            <div className="bg-card rounded-lg border border-border p-4 hidden">
              <h3 className="text-lg font-semibold mb-4">Starting Lineups</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary mb-2">{gameData.homeTeam.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p>No lineup data available</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-secondary mb-2">{gameData.awayTeam.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p>No lineup data available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Games */}
            {otherGames && otherGames.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="text-lg font-semibold mb-4">Other Games Today</h3>
                <div className="space-y-3">
                  {otherGames.map((game) => (
                    <div 
                      key={game.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/games/${game.id}`}
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {game.awayTeam.abbreviation} vs {game.homeTeam.abbreviation}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {game.status === "in_progress" && game.gameState
                            ? `${game.gameState.quarter} ${game.gameState.timeLeft}`
                            : game.status === "scheduled"
                            ? new Date(game.game_date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                            : game.sport
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        {game.status === "in_progress" ? (
                          <>
                            <p className="text-sm font-bold">{game.awayScore}-{game.homeScore}</p>
                            <Badge className="bg-red-600 text-white text-xs animate-pulse">• LIVE</Badge>
                          </>
                        ) : game.status === "scheduled" ? (
                          <Badge className="bg-blue-600 text-white text-xs">SCHEDULED</Badge>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
