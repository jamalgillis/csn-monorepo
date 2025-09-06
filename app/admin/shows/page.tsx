"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Edit, Eye, Plus, Calendar, Users } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function AdminShowsPage() {
  const [shows, setShows] = useState([
    {
      id: "sportscenter",
      title: "SportsCenter",
      category: "News & Analysis",
      status: "live",
      viewers: 15420,
      nextEpisode: "Today 6:00 PM",
      totalEpisodes: 245,
      rating: 4.8,
      playerUrl: "https://stream.example.com/live/sportscenter",
    },
    {
      id: "nba-tonight",
      title: "NBA Tonight",
      category: "Analysis",
      status: "scheduled",
      viewers: 0,
      nextEpisode: "Today 8:00 PM",
      totalEpisodes: 82,
      rating: 4.6,
      playerUrl: "https://stream.example.com/scheduled/nba-tonight",
    },
    {
      id: "first-take",
      title: "First Take",
      category: "Talk Show",
      status: "offline",
      viewers: 0,
      nextEpisode: "Tomorrow 10:00 AM",
      totalEpisodes: 156,
      rating: 4.2,
      playerUrl: "",
    },
  ])

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingShow, setEditingShow] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    nextEpisode: "",
    totalEpisodes: 0,
    rating: 0,
    playerUrl: "",
  })

  const toggleLiveStatus = (showId: string) => {
    setShows(
      shows.map((show) =>
        show.id === showId ? { ...show, status: show.status === "live" ? "offline" : "live" } : show,
      ),
    )
  }

  const openEditModal = (show: any) => {
    setEditingShow(show)
    setEditForm({
      title: show.title,
      category: show.category,
      nextEpisode: show.nextEpisode,
      totalEpisodes: show.totalEpisodes,
      rating: show.rating,
      playerUrl: show.playerUrl || "",
    })
    setEditModalOpen(true)
  }

  const saveShowEdit = () => {
    if (editingShow) {
      setShows(shows.map((show) => (show.id === editingShow.id ? { ...show, ...editForm } : show)))
      setEditModalOpen(false)
      setEditingShow(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shows Management</h1>
          <p className="text-muted-foreground">Manage shows, episodes, and live broadcasts</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Show
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Live Shows Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {shows
          .filter((show) => show.status === "live")
          .map((show) => (
            <Card key={show.id} className="border-secondary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-red-500 animate-pulse">
                    LIVE
                  </Badge>
                  <div className="text-sm text-muted-foreground">{show.category}</div>
                </div>
                <CardTitle className="text-lg">{show.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{show.viewers.toLocaleString()} viewers</span>
                  </div>
                  <div className="text-sm text-muted-foreground">⭐ {show.rating}</div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* All Shows Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Shows</CardTitle>
          <CardDescription>Manage show schedules, episodes, and broadcast settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="news">News & Analysis</SelectItem>
                <SelectItem value="talk">Talk Show</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search shows..." className="max-w-sm" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Show</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Episode</TableHead>
                <TableHead>Episodes</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Live Toggle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shows.map((show) => (
                <TableRow key={show.id}>
                  <TableCell>
                    <div className="font-medium">{show.title}</div>
                  </TableCell>
                  <TableCell>{show.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={show.status === "live" ? "default" : "secondary"}
                      className={show.status === "live" ? "bg-red-500 animate-pulse" : ""}
                    >
                      {show.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{show.nextEpisode}</TableCell>
                  <TableCell>{show.totalEpisodes}</TableCell>
                  <TableCell>⭐ {show.rating}</TableCell>
                  <TableCell>
                    <Switch checked={show.status === "live"} onCheckedChange={() => toggleLiveStatus(show.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(show)}>
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

      {/* Edit Modal for Shows */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Show</DialogTitle>
            <DialogDescription>Make changes to the show details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextEpisode" className="text-right">
                Next Episode
              </Label>
              <Input
                id="nextEpisode"
                value={editForm.nextEpisode}
                onChange={(e) => setEditForm({ ...editForm, nextEpisode: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalEpisodes" className="text-right">
                Total Episodes
              </Label>
              <Input
                id="totalEpisodes"
                type="number"
                value={editForm.totalEpisodes}
                onChange={(e) => setEditForm({ ...editForm, totalEpisodes: Number(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editForm.rating}
                onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) || 0 })}
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
            <Button type="submit" onClick={saveShowEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
