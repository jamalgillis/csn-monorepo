"use client"

import { useState } from "react"
import { Header } from "@/components/navigation/header"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SportsCard } from "@/components/ui/sports-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Trophy, TrendingUp, Users, Target, Search, Filter, BarChart3, Activity, Award, Zap } from "lucide-react"

const leagueLeaders = [
  {
    name: "Luka Dončić",
    team: "DAL",
    stat: "32.4",
    category: "Points Per Game",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Nikola Jokić",
    team: "DEN",
    stat: "12.4",
    category: "Rebounds Per Game",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Tyrese Haliburton",
    team: "IND",
    stat: "10.9",
    category: "Assists Per Game",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Victor Wembanyama",
    team: "SAS",
    stat: "3.6",
    category: "Blocks Per Game",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const teamStats = [
  { team: "Boston Celtics", ppg: 120.6, oppg: 110.2, pace: 99.8, efficiency: 118.5, record: "48-12" },
  { team: "Denver Nuggets", ppg: 115.3, oppg: 108.9, pace: 98.2, efficiency: 116.2, record: "44-16" },
  { team: "Oklahoma City Thunder", ppg: 118.2, oppg: 107.1, pace: 97.5, efficiency: 117.8, record: "43-17" },
  { team: "Dallas Mavericks", ppg: 117.8, oppg: 112.4, pace: 100.1, efficiency: 115.9, record: "41-19" },
  { team: "Los Angeles Lakers", ppg: 114.7, oppg: 113.2, pace: 99.3, efficiency: 112.4, record: "38-22" },
]

const performanceData = [
  { month: "Oct", points: 28.2, assists: 7.8, rebounds: 8.1 },
  { month: "Nov", points: 30.1, assists: 8.2, rebounds: 8.4 },
  { month: "Dec", points: 32.4, assists: 9.1, rebounds: 8.6 },
  { month: "Jan", points: 31.8, assists: 8.9, rebounds: 8.2 },
  { month: "Feb", points: 33.2, assists: 9.4, rebounds: 8.8 },
  { month: "Mar", points: 34.1, assists: 9.7, rebounds: 9.1 },
]

const efficiencyData = [
  { name: "Field Goals", value: 48.2, color: "#ef4444" },
  { name: "Three Pointers", value: 36.8, color: "#3b82f6" },
  { name: "Free Throws", value: 82.1, color: "#eab308" },
  { name: "True Shooting", value: 61.4, color: "#10b981" },
]

const advancedMetrics = [
  { metric: "Player Efficiency Rating", value: 31.2, max: 35, color: "bg-green-500" },
  { metric: "Win Shares", value: 12.8, max: 15, color: "bg-blue-500" },
  { metric: "Box Plus/Minus", value: 8.9, max: 12, color: "bg-yellow-500" },
  { metric: "Value Over Replacement", value: 6.7, max: 8, color: "bg-purple-500" },
]

const chartConfig = {
  points: { label: "Points", color: "#ef4444" },
  assists: { label: "Assists", color: "#3b82f6" },
  rebounds: { label: "Rebounds", color: "#eab308" },
}

const efficiencyChartConfig = {
  "Field Goals": { label: "Field Goals", color: "#ef4444" },
  "Three Pointers": { label: "Three Pointers", color: "#3b82f6" },
  "Free Throws": { label: "Free Throws", color: "#eab308" },
  "True Shooting": { label: "True Shooting", color: "#10b981" },
}

export default function StatsPage() {
  const [selectedSport, setSelectedSport] = useState("nba")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">Sports Statistics Hub</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Comprehensive analytics, player comparisons, and advanced metrics across all major sports
          </p>
        </div>

        {/* Filters Section */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border p-4 -mx-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search players, teams, stats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nba">NBA</SelectItem>
                  <SelectItem value="nfl">NFL</SelectItem>
                  <SelectItem value="mlb">MLB</SelectItem>
                  <SelectItem value="nhl">NHL</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stats</SelectItem>
                  <SelectItem value="offense">Offensive</SelectItem>
                  <SelectItem value="defense">Defensive</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SportsCard className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold">2,847</h3>
            <p className="text-muted-foreground">Active Players</p>
          </SportsCard>

          <SportsCard className="text-center">
            <div className="flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">1,230</h3>
            <p className="text-muted-foreground">Games Played</p>
          </SportsCard>

          <SportsCard className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">98.7M</h3>
            <p className="text-muted-foreground">Total Points</p>
          </SportsCard>

          <SportsCard className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold">156</h3>
            <p className="text-muted-foreground">Records Broken</p>
          </SportsCard>
        </div>

        {/* League Leaders Section */}
        <SportsCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Award className="w-6 h-6 text-yellow-500 mr-3" />
              League Leaders
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leagueLeaders.map((leader, index) => (
              <div
                key={leader.name}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <img
                  src={leader.avatar || "/placeholder.svg"}
                  alt={leader.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{leader.name}</p>
                  <p className="text-sm text-muted-foreground">{leader.team}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {leader.stat}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{leader.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SportsCard>

        {/* Performance Trends Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SportsCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              Season Performance Trends
            </h3>
            <ChartContainer config={chartConfig} className="h-80">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="points" stroke="var(--color-points)" strokeWidth={3} />
                <Line type="monotone" dataKey="assists" stroke="var(--color-assists)" strokeWidth={3} />
                <Line type="monotone" dataKey="rebounds" stroke="var(--color-rebounds)" strokeWidth={3} />
              </LineChart>
            </ChartContainer>
          </SportsCard>

          <SportsCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 text-blue-500 mr-2" />
              Shooting Efficiency
            </h3>
            <ChartContainer config={efficiencyChartConfig} className="h-80">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          </SportsCard>
        </div>

        {/* Advanced Metrics */}
        <SportsCard>
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
            Advanced Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedMetrics.map((metric) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.metric}</span>
                  <span className="text-sm font-bold">{metric.value}</span>
                </div>
                <Progress value={(metric.value / metric.max) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{metric.max}</span>
                </div>
              </div>
            ))}
          </div>
        </SportsCard>

        {/* Team Statistics Table */}
        <SportsCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              Team Statistics
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button variant="outline" size="sm">
                Compare
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>PPG</TableHead>
                <TableHead>OPPG</TableHead>
                <TableHead>Pace</TableHead>
                <TableHead>Efficiency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamStats.map((team) => (
                <TableRow key={team.team} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{team.team}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{team.record}</Badge>
                  </TableCell>
                  <TableCell>{team.ppg}</TableCell>
                  <TableCell>{team.oppg}</TableCell>
                  <TableCell>{team.pace}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{team.efficiency}</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${(team.efficiency / 120) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SportsCard>

        {/* Player Comparison Tool */}
        <SportsCard>
          <h3 className="text-xl font-bold mb-6">Player Comparison Tool</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Player 1</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select player..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luka">Luka Dončić</SelectItem>
                  <SelectItem value="jokic">Nikola Jokić</SelectItem>
                  <SelectItem value="tatum">Jayson Tatum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Player 2</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select player..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luka">Luka Dončić</SelectItem>
                  <SelectItem value="jokic">Nikola Jokić</SelectItem>
                  <SelectItem value="tatum">Jayson Tatum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Compare Players</Button>
            </div>
          </div>
          <div className="text-center text-muted-foreground py-8">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select two players to see detailed comparison</p>
          </div>
        </SportsCard>
      </main>
    </div>
  )
}
