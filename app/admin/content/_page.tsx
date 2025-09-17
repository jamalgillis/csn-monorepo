"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Play, 
  Edit, 
  Eye,
  Clock,
  Video,
  Mic,
  MoreVertical,
  Filter
} from "lucide-react";
import { useState } from "react";

// Mock data for content
const mockShows = [
  {
    id: "1",
    title: "Game Day Highlights",
    description: "Weekly highlights from NJCAA volleyball matches",
    thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400&h=160&fit=crop",
    episodes: 12,
    status: "active",
    views: "24.5K",
    lastUpdated: "2 hours ago"
  },
  {
    id: "2", 
    title: "Coach Conversations",
    description: "In-depth interviews with community college coaches",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=160&fit=crop",
    episodes: 8,
    status: "active", 
    views: "18.2K",
    lastUpdated: "1 day ago"
  },
  {
    id: "3",
    title: "Player Spotlights", 
    description: "Featuring outstanding community college athletes",
    thumbnail: "https://images.unsplash.com/photo-1594736797933-d0c1b8146ddb?w=400&h=160&fit=crop",
    episodes: 15,
    status: "draft",
    views: "0",
    lastUpdated: "3 days ago"
  }
];

const mockEpisodes = [
  {
    id: "1",
    showId: "1",
    showTitle: "Game Day Highlights",
    title: "McLennan vs Vernon - Thrilling 5-Set Match",
    duration: "12:34",
    views: "5.2K",
    status: "published",
    publishedAt: "2024-01-15"
  },
  {
    id: "2",
    showId: "1", 
    showTitle: "Game Day Highlights",
    title: "Temple College's Comeback Victory",
    duration: "8:45",
    views: "3.8K",
    status: "published",
    publishedAt: "2024-01-12"
  },
  {
    id: "3",
    showId: "2",
    showTitle: "Coach Conversations", 
    title: "Interview with Coach Martinez",
    duration: "25:12",
    views: "2.1K",
    status: "scheduled",
    publishedAt: "2024-01-20"
  }
];

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredShows = mockShows.filter(show => {
    const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         show.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || show.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredEpisodes = mockEpisodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.showTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || episode.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "published":
        return <Badge className="bg-green-600">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage shows, episodes, and media content</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="shows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shows" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Shows & Series
          </TabsTrigger>
          <TabsTrigger value="episodes" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Episodes
          </TabsTrigger>
          <TabsTrigger value="podcasts" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Podcasts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shows" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredShows.map((show) => (
              <Card key={show.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={show.thumbnail} 
                    alt={show.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{show.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">{show.description}</p>
                    </div>
                    {getStatusBadge(show.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>{show.episodes} eps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{show.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{show.lastUpdated}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Add Episode
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="episodes" className="space-y-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Episode</TableHead>
                  <TableHead>Show</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEpisodes.map((episode) => (
                  <TableRow key={episode.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-episode.jpg" />
                          <AvatarFallback>
                            <Play className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{episode.title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {episode.showTitle}
                    </TableCell>
                    <TableCell>{episode.duration}</TableCell>
                    <TableCell>{episode.views}</TableCell>
                    <TableCell>{getStatusBadge(episode.status)}</TableCell>
                    <TableCell>{episode.publishedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="podcasts" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Mic className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Podcasts Yet</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Start by creating your first podcast series
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Podcast
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}