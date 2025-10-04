"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Edit, Eye, Plus, Users, Trophy, TrendingUp, Trash2, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useTeams, usePlayers, useSports } from "@/hooks/admin/useAdminQueries"
import { useTeamMutations, usePlayerMutations } from "@/hooks/admin/useAdminMutationsV2"

export default function AdminTeamsPage() {
  const { teams, isLoading: teamsLoading } = useTeams()
  const { players, isLoading: playersLoading } = usePlayers()
  const { sports, isLoading: sportsLoading } = useSports()
  const teamMutations = useTeamMutations()
  const playerMutations = usePlayerMutations()

  const [teamDialogOpen, setTeamDialogOpen] = useState(false)
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)

  const [teamForm, setTeamForm] = useState({
    name: "",
    slug: "",
    city: "",
    state: "",
    league: "",
    logo_url: "",
  })

  const [playerForm, setPlayerForm] = useState({
    full_name: "",
    team_id: "",
    photo_url: "",
    status: "active" as "active" | "inactive" | "injured",
  })

  const isLoading = teamsLoading || playersLoading || sportsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading teams and players...</span>
      </div>
    )
  }

  const handleCreateTeam = async () => {
    try {
      await teamMutations.createTeam({
        ...teamForm,
        slug: teamForm.slug || teamForm.name.toLowerCase().replace(/\s+/g, "-")
      })
      setTeamDialogOpen(false)
      setTeamForm({ name: "", slug: "", city: "", state: "", league: "", logo_url: "" })
    } catch (error) {
      console.error("Failed to create team:", error)
    }
  }

  const handleUpdateTeam = async () => {
    if (!editingTeam) return
    try {
      await teamMutations.updateTeam({
        teamId: editingTeam._id,
        ...teamForm
      })
      setTeamDialogOpen(false)
      setEditingTeam(null)
      setTeamForm({ name: "", slug: "", city: "", state: "", league: "", logo_url: "" })
    } catch (error) {
      console.error("Failed to update team:", error)
    }
  }

  const handleDeleteTeam = async (teamId: any) => {
    if (!confirm("Are you sure you want to delete this team?")) return
    try {
      await teamMutations.deleteTeam(teamId)
    } catch (error) {
      console.error("Failed to delete team:", error)
    }
  }

  const handleCreatePlayer = async () => {
    try {
      await playerMutations.createPlayer({
        ...playerForm,
        team_id: playerForm.team_id as any
      })
      setPlayerDialogOpen(false)
      setPlayerForm({ full_name: "", team_id: "", photo_url: "", status: "active" })
    } catch (error) {
      console.error("Failed to create player:", error)
    }
  }

  const handleUpdatePlayer = async () => {
    if (!editingPlayer) return
    try {
      await playerMutations.updatePlayer({
        playerId: editingPlayer._id,
        ...playerForm,
        team_id: playerForm.team_id as any
      })
      setPlayerDialogOpen(false)
      setEditingPlayer(null)
      setPlayerForm({ full_name: "", team_id: "", photo_url: "", status: "active" })
    } catch (error) {
      console.error("Failed to update player:", error)
    }
  }

  const handleDeletePlayer = async (playerId: any) => {
    if (!confirm("Are you sure you want to delete this player?")) return
    try {
      await playerMutations.deletePlayer(playerId)
    } catch (error) {
      console.error("Failed to delete player:", error)
    }
  }

  const openTeamDialog = (team?: any) => {
    if (team) {
      setEditingTeam(team)
      setTeamForm({
        name: team.name || "",
        slug: team.slug || "",
        city: team.city || "",
        state: team.state || "",
        league: team.league || "",
        logo_url: team.logo_url || "",
      })
    } else {
      setEditingTeam(null)
      setTeamForm({ name: "", slug: "", city: "", state: "", league: "", logo_url: "" })
    }
    setTeamDialogOpen(true)
  }

  const openPlayerDialog = (player?: any) => {
    if (player) {
      setEditingPlayer(player)
      setPlayerForm({
        full_name: player.full_name || "",
        team_id: player.team_id || "",
        photo_url: player.photo_url || "",
        status: player.status || "active",
      })
    } else {
      setEditingPlayer(null)
      setPlayerForm({ full_name: "", team_id: "", photo_url: "", status: "active" })
    }
    setPlayerDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teams & Players</h1>
          <p className="text-muted-foreground">Manage team information, rosters, and player statistics</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => openTeamDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
          <Button variant="outline" onClick={() => openPlayerDialog()}>
            <Users className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </div>
      </div>

      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-6">
          {/* Team Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Across all leagues</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Players</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{players?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Currently registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sports Offered</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sports?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Available sports</p>
              </CardContent>
            </Card>
          </div>

          {/* Teams Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Teams</CardTitle>
              <CardDescription>Manage team information and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>City/State</TableHead>
                    <TableHead>League</TableHead>
                    <TableHead>Sports</TableHead>
                    <TableHead>Players</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams?.map((team) => (
                    <TableRow key={team._id}>
                      <TableCell>
                        <div className="font-medium">{team.name}</div>
                      </TableCell>
                      <TableCell>
                        {team.city && team.state ? `${team.city}, ${team.state}` : team.city || team.state || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.league || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {team.sports?.map((sport, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {sport}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{team.playerCount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => openTeamDialog(team)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteTeam(team._id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players" className="space-y-6">
          {/* Players Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Players</CardTitle>
              <CardDescription>Manage player information and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players?.map((player) => (
                    <TableRow key={player._id}>
                      <TableCell>
                        <div className="font-medium">{player.full_name}</div>
                      </TableCell>
                      <TableCell>{player.teamName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={player.status === "active" ? "default" : "secondary"}
                          className={player.status === "active" ? "bg-green-500" : ""}
                        >
                          {player.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => openPlayerDialog(player)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeletePlayer(player._id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Team Dialog */}
      <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTeam ? "Edit Team" : "Create Team"}</DialogTitle>
            <DialogDescription>
              {editingTeam ? "Update team information" : "Add a new team to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">City</Label>
              <Input
                id="city"
                value={teamForm.city}
                onChange={(e) => setTeamForm({ ...teamForm, city: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">State</Label>
              <Input
                id="state"
                value={teamForm.state}
                onChange={(e) => setTeamForm({ ...teamForm, state: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="league" className="text-right">League</Label>
              <Input
                id="league"
                value={teamForm.league}
                onChange={(e) => setTeamForm({ ...teamForm, league: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeamDialogOpen(false)}>Cancel</Button>
            <Button onClick={editingTeam ? handleUpdateTeam : handleCreateTeam}>
              {editingTeam ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Player Dialog */}
      <Dialog open={playerDialogOpen} onOpenChange={setPlayerDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPlayer ? "Edit Player" : "Create Player"}</DialogTitle>
            <DialogDescription>
              {editingPlayer ? "Update player information" : "Add a new player to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">Name</Label>
              <Input
                id="full_name"
                value={playerForm.full_name}
                onChange={(e) => setPlayerForm({ ...playerForm, full_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">Team</Label>
              <Select
                value={playerForm.team_id}
                onValueChange={(value) => setPlayerForm({ ...playerForm, team_id: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select
                value={playerForm.status}
                onValueChange={(value: any) => setPlayerForm({ ...playerForm, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="injured">Injured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlayerDialogOpen(false)}>Cancel</Button>
            <Button onClick={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}>
              {editingPlayer ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
