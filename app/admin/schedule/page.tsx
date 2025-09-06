"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Plus, Edit, Trash2, Search, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminSchedulePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    sport: "",
    date: "",
    time: "",
    venue: "",
    network: "",
    description: "",
  })

  // Mock schedule data
  const scheduleData = [
    {
      id: 1,
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      sport: "NBA",
      date: "2024-01-15",
      time: "20:00",
      venue: "Crypto.com Arena",
      network: "ESPN",
      status: "scheduled",
    },
    {
      id: 2,
      homeTeam: "Chiefs",
      awayTeam: "Bills",
      sport: "NFL",
      date: "2024-01-14",
      time: "18:30",
      venue: "Arrowhead Stadium",
      network: "CBS",
      status: "live",
    },
    {
      id: 3,
      homeTeam: "Celtics",
      awayTeam: "Heat",
      sport: "NBA",
      date: "2024-01-13",
      time: "19:30",
      venue: "TD Garden",
      network: "TNT",
      status: "completed",
    },
    {
      id: 4,
      homeTeam: "Cowboys",
      awayTeam: "Eagles",
      sport: "NFL",
      date: "2024-01-16",
      time: "21:00",
      venue: "AT&T Stadium",
      network: "NBC",
      status: "scheduled",
    },
  ]

  const filteredSchedule = scheduleData.filter((game) => {
    const matchesSearch =
      game.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === "all" || game.sport === selectedSport
    const matchesStatus = selectedStatus === "all" || game.status === selectedStatus
    return matchesSearch && matchesSport && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500"
      case "scheduled":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Scheduling new game:", formData)
    // Here you would typically send the data to your backend
    setIsModalOpen(false)
    setFormData({
      homeTeam: "",
      awayTeam: "",
      sport: "",
      date: "",
      time: "",
      venue: "",
      network: "",
      description: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Manage game schedules, venues, and broadcast information</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Game</DialogTitle>
              <DialogDescription>Add a new game to the schedule with all necessary details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">Home Team</Label>
                  <Input
                    id="homeTeam"
                    value={formData.homeTeam}
                    onChange={(e) => handleInputChange("homeTeam", e.target.value)}
                    placeholder="Enter home team"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeam">Away Team</Label>
                  <Input
                    id="awayTeam"
                    value={formData.awayTeam}
                    onChange={(e) => handleInputChange("awayTeam", e.target.value)}
                    placeholder="Enter away team"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport/League</Label>
                  <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NBA">NBA</SelectItem>
                      <SelectItem value="NFL">NFL</SelectItem>
                      <SelectItem value="MLB">MLB</SelectItem>
                      <SelectItem value="NHL">NHL</SelectItem>
                      <SelectItem value="MLS">MLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network">Broadcast Network</Label>
                  <Select value={formData.network} onValueChange={(value) => handleInputChange("network", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ESPN">ESPN</SelectItem>
                      <SelectItem value="CBS">CBS</SelectItem>
                      <SelectItem value="NBC">NBC</SelectItem>
                      <SelectItem value="FOX">FOX</SelectItem>
                      <SelectItem value="TNT">TNT</SelectItem>
                      <SelectItem value="ABC">ABC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Game Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Game Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                  placeholder="Enter venue name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Add any additional notes or description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Schedule Game
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Games</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently broadcasting</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Games</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Across all sports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Scheduled games</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
          <CardDescription>View and manage all scheduled games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="NBA">NBA</SelectItem>
                  <SelectItem value="NFL">NFL</SelectItem>
                  <SelectItem value="MLB">MLB</SelectItem>
                  <SelectItem value="NHL">NHL</SelectItem>
                  <SelectItem value="MLS">MLS</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedule.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>
                      <div className="font-medium">
                        {game.awayTeam} @ {game.homeTeam}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{game.sport}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{game.date}</div>
                        <div className="text-muted-foreground">{game.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{game.venue}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{game.network}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(game.status)} text-white`}>{game.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
