"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Play, Pause, Square, Edit, Eye, Plus, RefreshCw } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Id } from "../../../convex/_generated/dataModel"

interface GameWithDetails {
  id: Id<"games">  // Changed from _id to id to match Convex response
  homeTeam: {
    name: string
    abbreviation: string
  }
  awayTeam: {
    name: string
    abbreviation: string
  }
  homeScore: number
  awayScore: number
  status: "scheduled" | "in_progress" | "final" | "postponed"
  sport: string
  venue: string
  game_date: string  // Changed from gameDate to game_date to match Convex response
  gameState?: {
    quarter: string
    timeLeft: string
  } | null
}

export default function AdminGamesPage() {
  // Fetch real games data from Convex
  const gamesData = useQuery(api.sports.getAllGames)
  const updateGameStateMutation = useMutation(api.sports.updateGameState)
  const updateGameStatusMutation = useMutation(api.sports.updateGameState)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<GameWithDetails | null>(null)
  const [scoreUpdates, setScoreUpdates] = useState<{[key: string]: {home: number, away: number}}>({})
  const [volleyballModalOpen, setVolleyballModalOpen] = useState(false)
  const [currentVolleyballGame, setCurrentVolleyballGame] = useState<GameWithDetails | null>(null)
  const [volleyballState, setVolleyballState] = useState({
    currentSet: 1,
    setScores: { home: 0, away: 0 },
    setsWon: { home: 0, away: 0 }
  })
  const [editForm, setEditForm] = useState({
    homeTeam: "",
    awayTeam: "",
    homeScore: 0,
    awayScore: 0,
    status: "",
    sport: "",
    venue: ""
  })

  // Loading state
  if (!gamesData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading games...</span>
      </div>
    )
  }

  const games = gamesData

  const updateScore = async (gameId: Id<"games">, team: "home" | "away", newScore: number) => {
    const game = games.find(g => g.id === gameId)
    if (!game) return

    const currentScores = scoreUpdates[gameId] || { home: game.homeScore, away: game.awayScore }
    const updatedScores = { ...currentScores, [team]: newScore }
    setScoreUpdates({ ...scoreUpdates, [gameId]: updatedScores })

    // Update game state in database
    try {
      await updateGameStateMutation({
        gameId,
        eventType: "score_update",
        scoreInfo: {
          home_score: updatedScores.home,
          away_score: updatedScores.away
        },
        description: `Score updated: ${updatedScores.away} - ${updatedScores.home}`
      })
    } catch (error) {
      console.error("Failed to update score:", error)
    }
  }

  const updateGameStatus = async (gameId: Id<"games">, newStatus: "scheduled" | "in_progress" | "final" | "postponed") => {
    // Defensive check: Ensure gameId is valid
    if (!gameId) {
      console.error("updateGameStatus called with invalid gameId:", gameId)
      return
    }

    try {
      const updatePayload = {
        gameId,
        eventType: "status_change",
        description: `Game status updated to ${newStatus}`,
        metadata: { 
          oldStatus: games.find(g => g.id === gameId)?.status,
          newStatus 
        }
      }
      
      // Debug logging to verify payload
      console.log("Updating game status with payload:", updatePayload)
      
      await updateGameStatusMutation(updatePayload)
    } catch (error) {
      console.error("Failed to update game status:", error)
    }
  }

  const openEditModal = (game: GameWithDetails) => {
    setEditingGame(game)
    setEditForm({
      homeTeam: typeof game.homeTeam === 'string' ? game.homeTeam : game.homeTeam?.name || game.homeTeam?.abbreviation || '',
      awayTeam: typeof game.awayTeam === 'string' ? game.awayTeam : game.awayTeam?.name || game.awayTeam?.abbreviation || '',
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      status: game.status,
      sport: game.sport || "",
      venue: game.venue
    })
    setEditModalOpen(true)
  }

  const saveGameEdit = () => {
    if (editingGame) {
      // For now, just close the modal since we'd need additional mutations
      // to update team names, venues, etc.
      setEditModalOpen(false)
      setEditingGame(null)
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Games Control</h1>
          <p className="text-muted-foreground">Manage live games, scores, and broadcasts</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Game
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Games Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {games
          .filter((game) => game.status === "in_progress")
          .map((game, index) => {
            const displayScores = scoreUpdates[game.id] || { home: game.homeScore, away: game.awayScore }
            return (
              <Card key={`live-${game.id}-${index}`} className="border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-red-500 animate-pulse">
                      LIVE
                    </Badge>
                    <div className="text-sm text-muted-foreground">{game.sport}</div>
                  </div>
                  <CardTitle className="text-lg">
                    {typeof game.awayTeam === 'string' ? game.awayTeam : game.awayTeam?.name || game.awayTeam?.abbreviation} @ {typeof game.homeTeam === 'string' ? game.homeTeam : game.homeTeam?.name || game.homeTeam?.abbreviation}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-2xl font-bold">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-normal">{typeof game.awayTeam === 'string' ? game.awayTeam : game.awayTeam?.name || game.awayTeam?.abbreviation}</span>
                      <Input
                        type="number"
                        value={displayScores.away}
                        onChange={(e) => updateScore(game.id, "away", Number.parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={displayScores.home}
                        onChange={(e) => updateScore(game.id, "home", Number.parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <span className="text-sm font-normal">{typeof game.homeTeam === 'string' ? game.homeTeam : game.homeTeam?.name || game.homeTeam?.abbreviation}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>{game.gameState?.quarter || "Live"}</span>
                    <span>{game.gameState?.timeLeft || game.sport}</span>
                    <span>{game.venue}</span>
                  </div>

                  <div className="flex space-x-2">
                    {(game.sport && typeof game.sport === 'string' && game.sport.toLowerCase() === "volleyball") ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setCurrentVolleyballGame(game)
                          setVolleyballState({
                            currentSet: 1,
                            setScores: { home: displayScores.home, away: displayScores.away },
                            setsWon: { home: 0, away: 0 }
                          })
                          setVolleyballModalOpen(true)
                        }}
                      >
                        Set Controls
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Square className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <Link href={`/games/${game.id}`} target="_blank">
                      <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>

      {/* All Games Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Games</CardTitle>
          <CardDescription>Manage all scheduled, live, and completed games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search games..." className="max-w-sm" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time/Date</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game, index) => {
                const displayScores = scoreUpdates[game.id] || { home: game.homeScore, away: game.awayScore }
                return (
                  <TableRow key={`table-${game.id}-${index}`}>
                    <TableCell>
                      <div className="font-medium">
                        {typeof game.awayTeam === 'string' ? game.awayTeam : game.awayTeam?.name || game.awayTeam?.abbreviation} @ {typeof game.homeTeam === 'string' ? game.homeTeam : game.homeTeam?.name || game.homeTeam?.abbreviation}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {game.sport}
                      </div>
                    </TableCell>
                    <TableCell>
                      {game.status === "scheduled" ? "-" : `${displayScores.away} - ${displayScores.home}`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={game.status === "in_progress" ? "default" : "secondary"}
                        className={game.status === "in_progress" ? "bg-red-500 animate-pulse" : ""}
                      >
                        {game.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {game.status === "in_progress"
                        ? `${game.gameState?.quarter || "Live"} ${game.gameState?.timeLeft || ""}`
                        : game.status === "scheduled"
                          ? new Date(game.gameDate).toLocaleDateString()
                          : "Final"}
                    </TableCell>
                    <TableCell>{game.sport}</TableCell>
                    <TableCell>{game.venue}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(game)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Link href={`/games/${game.id}`} target="_blank">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Select 
                          value={game.status} 
                          onValueChange={(value: "scheduled" | "in_progress" | "final" | "postponed") => 
                            updateGameStatus(game.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="in_progress">Live</SelectItem>
                            <SelectItem value="final">Final</SelectItem>
                            <SelectItem value="postponed">Postponed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
            <DialogDescription>Make changes to the game details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="awayTeam" className="text-right">
                Away Team
              </Label>
              <Input
                id="awayTeam"
                value={editForm.awayTeam}
                onChange={(e) => setEditForm({ ...editForm, awayTeam: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="homeTeam" className="text-right">
                Home Team
              </Label>
              <Input
                id="homeTeam"
                value={editForm.homeTeam}
                onChange={(e) => setEditForm({ ...editForm, homeTeam: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="awayScore" className="text-right">
                Away Score
              </Label>
              <Input
                id="awayScore"
                type="number"
                value={editForm.awayScore}
                onChange={(e) => setEditForm({ ...editForm, awayScore: Number(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="homeScore" className="text-right">
                Home Score
              </Label>
              <Input
                id="homeScore"
                type="number"
                value={editForm.homeScore}
                onChange={(e) => setEditForm({ ...editForm, homeScore: Number(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sport" className="text-right">
                Sport
              </Label>
              <Input
                id="sport"
                value={editForm.sport}
                onChange={(e) => setEditForm({ ...editForm, sport: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="venue" className="text-right">
                Venue
              </Label>
              <Input
                id="venue"
                value={editForm.venue}
                onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveGameEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Volleyball Set Control Modal */}
      <Dialog open={volleyballModalOpen} onOpenChange={setVolleyballModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Volleyball Set Control</DialogTitle>
            <DialogDescription>
              {currentVolleyballGame && 
                `Manage sets for ${currentVolleyballGame.awayTeam} @ ${currentVolleyballGame.homeTeam}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Current Set Display */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Set {volleyballState.currentSet}</h3>
              <div className="flex items-center justify-center space-x-8 text-2xl font-bold">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{currentVolleyballGame?.awayTeam}</div>
                  <div>{volleyballState.setScores.away}</div>
                </div>
                <div>-</div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">{currentVolleyballGame?.homeTeam}</div>
                  <div>{volleyballState.setScores.home}</div>
                </div>
              </div>
            </div>

            {/* Score Controls */}
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <Label>Away Score</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setVolleyballState(prev => ({
                      ...prev,
                      setScores: { ...prev.setScores, away: Math.max(0, prev.setScores.away - 1) }
                    }))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={volleyballState.setScores.away}
                    onChange={(e) => setVolleyballState(prev => ({
                      ...prev,
                      setScores: { ...prev.setScores, away: Number(e.target.value) || 0 }
                    }))}
                    className="w-16 text-center"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setVolleyballState(prev => ({
                      ...prev,
                      setScores: { ...prev.setScores, away: prev.setScores.away + 1 }
                    }))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <Label>Home Score</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setVolleyballState(prev => ({
                      ...prev,
                      setScores: { ...prev.setScores, home: Math.max(0, prev.setScores.home - 1) }
                    }))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={volleyballState.setScores.home}
                    onChange={(e) => setVolleyballState(prev => ({
                      ...prev,
                      setScores: { ...prev.setScores, home: Number(e.target.value) || 0 }
                    }))}
                    className="w-16 text-center"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setVolleyballState(prev => ({
                      ...prev,
                      setScores: { ...prev.setScores, home: prev.setScores.home + 1 }
                    }))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Set Management */}
            <div className="flex justify-center space-x-4">
              <Button 
                variant="default"
                onClick={async () => {
                  if (!currentVolleyballGame) return
                  
                  try {
                    await updateGameStateMutation({
                      gameId: currentVolleyballGame._id,
                      eventType: "set_complete",
                      periodInfo: {
                        period_number: volleyballState.currentSet,
                        time_remaining: undefined,
                        is_overtime: false
                      },
                      scoreInfo: {
                        home_score: volleyballState.setScores.home,
                        away_score: volleyballState.setScores.away,
                        details: {
                          sets_won_home: volleyballState.setsWon.home,
                          sets_won_away: volleyballState.setsWon.away,
                          current_set_score: volleyballState.setScores
                        }
                      },
                      description: `Set ${volleyballState.currentSet} - ${volleyballState.setScores.away}-${volleyballState.setScores.home}`
                    })
                    
                    // Move to next set
                    setVolleyballState(prev => ({
                      currentSet: prev.currentSet + 1,
                      setScores: { home: 0, away: 0 },
                      setsWon: prev.setsWon
                    }))
                  } catch (error) {
                    console.error("Failed to complete set:", error)
                  }
                }}
              >
                Complete Set {volleyballState.currentSet}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setVolleyballState(prev => ({
                  ...prev,
                  currentSet: Math.max(1, prev.currentSet - 1),
                  setScores: { home: 0, away: 0 }
                }))}
              >
                Previous Set
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setVolleyballState(prev => ({
                  ...prev,
                  currentSet: prev.currentSet + 1,
                  setScores: { home: 0, away: 0 }
                }))}
              >
                Next Set
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVolleyballModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
