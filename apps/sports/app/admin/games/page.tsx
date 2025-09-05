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

export default function AdminGamesPage() {
  const [games, setGames] = useState([
    {
      id: "lakers-warriors",
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      homeScore: 108,
      awayScore: 112,
      status: "live",
      quarter: "Q4",
      timeRemaining: "2:34",
      viewers: 24891,
      network: "ESPN",
      playerUrl: "https://stream.example.com/live/lakers-warriors-2024",
    },
    {
      id: "celtics-heat",
      homeTeam: "Celtics",
      awayTeam: "Heat",
      homeScore: 95,
      awayScore: 89,
      status: "final",
      quarter: "Final",
      timeRemaining: "",
      viewers: 18432,
      network: "TNT",
      playerUrl: "https://stream.example.com/replay/celtics-heat-2024",
    },
    {
      id: "mavs-nuggets",
      homeTeam: "Mavericks",
      awayTeam: "Nuggets",
      homeScore: 0,
      awayScore: 0,
      status: "scheduled",
      quarter: "",
      timeRemaining: "7:30 PM ET",
      viewers: 0,
      network: "NBA TV",
      playerUrl: "",
    },
  ])

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    homeTeam: "",
    awayTeam: "",
    homeScore: 0,
    awayScore: 0,
    status: "",
    quarter: "",
    timeRemaining: "",
    viewers: 0,
    network: "",
    playerUrl: "",
  })

  const updateScore = (gameId: string, team: "home" | "away", newScore: number) => {
    setGames(
      games.map((game) =>
        game.id === gameId ? { ...game, [team === "home" ? "homeScore" : "awayScore"]: newScore } : game,
      ),
    )
  }

  const updateGameStatus = (gameId: string, newStatus: string) => {
    setGames(games.map((game) => (game.id === gameId ? { ...game, status: newStatus } : game)))
  }

  const openEditModal = (game: any) => {
    setEditingGame(game)
    setEditForm({
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      status: game.status,
      quarter: game.quarter,
      timeRemaining: game.timeRemaining,
      viewers: game.viewers,
      network: game.network,
      playerUrl: game.playerUrl || "",
    })
    setEditModalOpen(true)
  }

  const saveGameEdit = () => {
    if (editingGame) {
      setGames(games.map((game) => (game.id === editingGame.id ? { ...game, ...editForm } : game)))
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
          .filter((game) => game.status === "live")
          .map((game) => (
            <Card key={game.id} className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-red-500 animate-pulse">
                    LIVE
                  </Badge>
                  <div className="text-sm text-muted-foreground">{game.network}</div>
                </div>
                <CardTitle className="text-lg">
                  {game.awayTeam} @ {game.homeTeam}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-2xl font-bold">
                  <div className="flex items-center space-x-2">
                    <span>{game.awayTeam}</span>
                    <Input
                      type="number"
                      value={game.awayScore}
                      onChange={(e) => updateScore(game.id, "away", Number.parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={game.homeScore}
                      onChange={(e) => updateScore(game.id, "home", Number.parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                    />
                    <span>{game.homeTeam}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>{game.quarter}</span>
                  <span>{game.timeRemaining}</span>
                  <span>{game.viewers.toLocaleString()} viewers</span>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Square className="h-3 w-3" />
                  </Button>
                  <Link href={`/games/${game.id}`} target="_blank">
                    <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <TableHead>Time</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Viewers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <div className="font-medium">
                      {game.awayTeam} @ {game.homeTeam}
                    </div>
                  </TableCell>
                  <TableCell>{game.status === "scheduled" ? "-" : `${game.awayScore} - ${game.homeScore}`}</TableCell>
                  <TableCell>
                    <Badge
                      variant={game.status === "live" ? "default" : "secondary"}
                      className={game.status === "live" ? "bg-red-500 animate-pulse" : ""}
                    >
                      {game.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {game.status === "live"
                      ? `${game.quarter} ${game.timeRemaining}`
                      : game.status === "scheduled"
                        ? game.timeRemaining
                        : "Final"}
                  </TableCell>
                  <TableCell>{game.network}</TableCell>
                  <TableCell>{game.viewers.toLocaleString()}</TableCell>
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
                      <Select value={game.status} onValueChange={(value) => updateGameStatus(game.id, value)}>
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="final">Final</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              <Label htmlFor="network" className="text-right">
                Network
              </Label>
              <Input
                id="network"
                value={editForm.network}
                onChange={(e) => setEditForm({ ...editForm, network: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="viewers" className="text-right">
                Viewers
              </Label>
              <Input
                id="viewers"
                type="number"
                value={editForm.viewers}
                onChange={(e) => setEditForm({ ...editForm, viewers: Number(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="playerUrl" className="text-right">
                Player URL
              </Label>
              <Input
                id="playerUrl"
                value={editForm.playerUrl}
                onChange={(e) => setEditForm({ ...editForm, playerUrl: e.target.value })}
                className="col-span-3"
                placeholder="https://stream.example.com/..."
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
    </div>
  )
}
