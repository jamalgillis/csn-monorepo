"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Target, Award, Activity, RefreshCw } from "lucide-react"

export default function AdminStatsPage() {
  const leaderData = [
    { name: "LeBron James", team: "Lakers", stat: 25.2, category: "Points" },
    { name: "Nikola Jokic", team: "Nuggets", stat: 12.8, category: "Rebounds" },
    { name: "Chris Paul", team: "Suns", stat: 8.9, category: "Assists" },
    { name: "Stephen Curry", team: "Warriors", stat: 42.8, category: "3P%" },
  ]

  const chartData = [
    { name: "Lakers", wins: 28, losses: 15 },
    { name: "Celtics", wins: 32, losses: 11 },
    { name: "Warriors", wins: 25, losses: 18 },
    { name: "Heat", wins: 22, losses: 21 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistics Management</h1>
          <p className="text-muted-foreground">Update player stats, team records, and league data</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Stats
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leaders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leaders">League Leaders</TabsTrigger>
          <TabsTrigger value="team-stats">Team Stats</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="leaders" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scoring Leader</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25.2</div>
                <p className="text-xs text-muted-foreground">LeBron James</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rebounding Leader</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.8</div>
                <p className="text-xs text-muted-foreground">Nikola Jokic</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assists Leader</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.9</div>
                <p className="text-xs text-muted-foreground">Chris Paul</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">3P% Leader</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.8%</div>
                <p className="text-xs text-muted-foreground">Stephen Curry</p>
              </CardContent>
            </Card>
          </div>

          {/* League Leaders Table */}
          <Card>
            <CardHeader>
              <CardTitle>League Leaders</CardTitle>
              <CardDescription>Update and manage statistical leaders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Select defaultValue="points">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="rebounds">Rebounds</SelectItem>
                    <SelectItem value="assists">Assists</SelectItem>
                    <SelectItem value="steals">Steals</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Search players..." className="max-w-sm" />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Stat</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderData.map((player, index) => (
                    <TableRow key={player.name}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.team}</TableCell>
                      <TableCell className="font-bold">{player.stat}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{player.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-stats" className="space-y-6">
          {/* Team Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Win-loss records across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="wins" fill="hsl(var(--primary))" />
                  <Bar dataKey="losses" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Team Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
              <CardDescription>Comprehensive team performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>PPG</TableHead>
                    <TableHead>RPG</TableHead>
                    <TableHead>APG</TableHead>
                    <TableHead>FG%</TableHead>
                    <TableHead>3P%</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Lakers</TableCell>
                    <TableCell>118.2</TableCell>
                    <TableCell>45.8</TableCell>
                    <TableCell>27.1</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={47.2} className="w-16" />
                        <span className="text-sm">47.2%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={35.8} className="w-16" />
                        <span className="text-sm">35.8%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Celtics</TableCell>
                    <TableCell>120.1</TableCell>
                    <TableCell>44.2</TableCell>
                    <TableCell>25.8</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={48.9} className="w-16" />
                        <span className="text-sm">48.9%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={37.2} className="w-16" />
                        <span className="text-sm">37.2%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Metrics</CardTitle>
              <CardDescription>Manage advanced statistical calculations and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Player Efficiency Rating (PER)</label>
                    <Input placeholder="Update PER calculations" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">True Shooting Percentage</label>
                    <Input placeholder="Update TS% calculations" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Win Shares</label>
                    <Input placeholder="Update win shares" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Box Plus/Minus</label>
                    <Input placeholder="Update BPM calculations" />
                  </div>
                </div>
                <Button>Update Advanced Stats</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
