"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Eye, Plus, Users, Trophy, TrendingUp } from "lucide-react"
import { useState } from "react"

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([
    {
      id: "lakers",
      name: "Los Angeles Lakers",
      league: "NBA",
      conference: "Western",
      division: "Pacific",
      wins: 28,
      losses: 15,
      winPercentage: 0.651,
      players: 15,
      coach: "Darvin Ham",
    },
    {
      id: "warriors",
      name: "Golden State Warriors",
      league: "NBA",
      conference: "Western",
      division: "Pacific",
      wins: 25,
      losses: 18,
      winPercentage: 0.581,
      players: 15,
      coach: "Steve Kerr",
    },
    {
      id: "celtics",
      name: "Boston Celtics",
      league: "NBA",
      conference: "Eastern",
      division: "Atlantic",
      wins: 32,
      losses: 11,
      winPercentage: 0.744,
      players: 15,
      coach: "Joe Mazzulla",
    },
  ])

  const [players, setPlayers] = useState([
    {
      id: "lebron",
      name: "LeBron James",
      team: "Lakers",
      position: "SF",
      number: 23,
      ppg: 25.2,
      rpg: 7.8,
      apg: 6.9,
      status: "active",
    },
    {
      id: "curry",
      name: "Stephen Curry",
      team: "Warriors",
      position: "PG",
      number: 30,
      ppg: 29.1,
      rpg: 6.2,
      apg: 6.3,
      status: "active",
    },
    {
      id: "tatum",
      name: "Jayson Tatum",
      team: "Celtics",
      position: "SF",
      number: 0,
      ppg: 27.8,
      rpg: 8.4,
      apg: 4.1,
      status: "active",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teams & Players</h1>
          <p className="text-muted-foreground">Manage team information, rosters, and player statistics</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </div>
      </div>

      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
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
                <div className="text-2xl font-bold">{teams.length}</div>
                <p className="text-xs text-muted-foreground">Across all leagues</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Players</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{players.length}</div>
                <p className="text-xs text-muted-foreground">Currently registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Win %</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">74.4%</div>
                <p className="text-xs text-muted-foreground">Boston Celtics</p>
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
              <div className="flex items-center space-x-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by league" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leagues</SelectItem>
                    <SelectItem value="nba">NBA</SelectItem>
                    <SelectItem value="nfl">NFL</SelectItem>
                    <SelectItem value="mlb">MLB</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Search teams..." className="max-w-sm" />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>League</TableHead>
                    <TableHead>Conference</TableHead>
                    <TableHead>Record</TableHead>
                    <TableHead>Win %</TableHead>
                    <TableHead>Players</TableHead>
                    <TableHead>Coach</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="font-medium">{team.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.league}</Badge>
                      </TableCell>
                      <TableCell>{team.conference}</TableCell>
                      <TableCell>
                        {team.wins}-{team.losses}
                      </TableCell>
                      <TableCell>{(team.winPercentage * 100).toFixed(1)}%</TableCell>
                      <TableCell>{team.players}</TableCell>
                      <TableCell>{team.coach}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
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
              <div className="flex items-center space-x-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="lakers">Lakers</SelectItem>
                    <SelectItem value="warriors">Warriors</SelectItem>
                    <SelectItem value="celtics">Celtics</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Search players..." className="max-w-sm" />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>PPG</TableHead>
                    <TableHead>RPG</TableHead>
                    <TableHead>APG</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <div className="font-medium">{player.name}</div>
                      </TableCell>
                      <TableCell>{player.team}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{player.position}</Badge>
                      </TableCell>
                      <TableCell>#{player.number}</TableCell>
                      <TableCell>{player.ppg}</TableCell>
                      <TableCell>{player.rpg}</TableCell>
                      <TableCell>{player.apg}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500">
                          {player.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
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

        <TabsContent value="standings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>League Standings</CardTitle>
              <CardDescription>Update and manage league standings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Select defaultValue="nba">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select league" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nba">NBA</SelectItem>
                      <SelectItem value="nfl">NFL</SelectItem>
                      <SelectItem value="mlb">MLB</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Update Standings</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>W</TableHead>
                      <TableHead>L</TableHead>
                      <TableHead>PCT</TableHead>
                      <TableHead>GB</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams
                      .sort((a, b) => b.winPercentage - a.winPercentage)
                      .map((team, index) => (
                        <TableRow key={team.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{team.name}</TableCell>
                          <TableCell>{team.wins}</TableCell>
                          <TableCell>{team.losses}</TableCell>
                          <TableCell>{team.winPercentage.toFixed(3)}</TableCell>
                          <TableCell>{index === 0 ? "-" : "2.5"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
