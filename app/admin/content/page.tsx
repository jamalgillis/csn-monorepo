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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Filter,
  Clapperboard,
  List,
  Headphones,
  Upload,
  Download,
  Image,
  X
} from "lucide-react";
import { useState } from "react";

// Mock data matching the superdesign mockup
const mockShows = [
  {
    id: "1",
    title: "Volleyball Highlights",
    description: "Weekly highlights from NJCAA volleyball matches",
    episodes: 12,
    status: "active",
    views: "24.5K",
    lastUpdated: "2 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400&h=160&fit=crop"
  },
  {
    id: "2", 
    title: "Weekly Recap",
    description: "Comprehensive weekly sports recap show",
    episodes: 8,
    status: "active", 
    views: "18.2K",
    lastUpdated: "1 day ago",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=160&fit=crop"
  },
  {
    id: "3",
    title: "Game Day Preview", 
    description: "Pre-game analysis and team previews",
    episodes: 25,
    status: "draft",
    views: "0",
    lastUpdated: "3 days ago",
    thumbnail: "https://images.unsplash.com/photo-1594736797933-d0c1b8146ddb?w=400&h=160&fit=crop"
  },
  {
    id: "4",
    title: "Player Spotlight",
    description: "Featured player interviews and profiles", 
    episodes: 5,
    status: "active",
    views: "15.3K",
    lastUpdated: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=400&h=160&fit=crop"
  }
];

const mockEpisodes = [
  {
    id: "1",
    showId: "1",
    showTitle: "Volleyball Highlights",
    title: "#12: Championship Finals",
    description: "Season finale highlights",
    duration: "15:42",
    views: "2,847",
    status: "published",
    publishedAt: "2 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=100&h=75&fit=crop"
  },
  {
    id: "2",
    showId: "2", 
    showTitle: "Weekly Recap",
    title: "#8: Week in Review",
    description: "Comprehensive weekly recap",
    duration: "22:15",
    views: "-",
    status: "draft",
    publishedAt: "Not published",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=75&fit=crop"
  },
  {
    id: "3",
    showId: "4",
    showTitle: "Player Spotlight", 
    title: "#5: Sarah Johnson Profile",
    description: "McLennan volleyball star",
    duration: "18:33",
    views: "1,924",
    status: "published",
    publishedAt: "1 day ago",
    thumbnail: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=100&h=75&fit=crop"
  }
];

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedShow, setSelectedShow] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);

  const filteredShows = mockShows.filter(show => {
    const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         show.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeFilter === "all" || show.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredEpisodes = mockEpisodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.showTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || episode.status === selectedStatus;
    const matchesShow = selectedShow === "all" || episode.showTitle === selectedShow;
    return matchesSearch && matchesStatus && matchesShow;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "published":
        return (
          <Badge className="bg-green-600 hover:bg-green-600">
            <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="secondary">
            <Edit className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filterOptions = [
    { label: "All Shows", value: "all" },
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Content Management</h2>
          <p className="text-muted-foreground">Manage shows, episodes, and podcast content</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Export Content
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>
                  Create a new show series, episode, or podcast content.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select defaultValue="show">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="show">New Show Series</SelectItem>
                      <SelectItem value="episode">Episode</SelectItem>
                      <SelectItem value="podcast">Podcast Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter content title..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail</Label>
                  <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary transition-colors">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Image className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Drop thumbnail image or click to upload</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCreateModalOpen(false)}>Create Content</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
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
      </div>

      <Tabs defaultValue="shows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shows" className="flex items-center gap-2">
            <Clapperboard className="h-4 w-4" />
            Shows Overview
          </TabsTrigger>
          <TabsTrigger value="episodes" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Episodes Management
          </TabsTrigger>
          <TabsTrigger value="podcasts" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            Podcast Series
          </TabsTrigger>
        </TabsList>

        {/* Shows Overview Tab */}
        <TabsContent value="shows" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium mr-2">Filter by:</span>
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(option.value)}
                  className="rounded-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                <SelectItem value="popular">Sort by: Most Popular</SelectItem>
                <SelectItem value="episodes">Sort by: Episode Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shows Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShows.map((show) => (
              <Card key={show.id} className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="aspect-video relative bg-gradient-to-br from-muted to-accent/20">
                  {show.thumbnail ? (
                    <img 
                      src={show.thumbnail} 
                      alt={show.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Video className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{show.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{show.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{show.episodes} episodes</span>
                    {getStatusBadge(show.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create New Show */}
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create New Show Series</h3>
              <p className="text-muted-foreground mb-4 text-center">Start a new show series with episodes and metadata</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Show
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Episodes Management Tab */}
        <TabsContent value="episodes" className="space-y-6">
          {/* Episodes Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={selectedShow} onValueChange={setSelectedShow}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Shows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shows</SelectItem>
                  <SelectItem value="Volleyball Highlights">Volleyball Highlights</SelectItem>
                  <SelectItem value="Weekly Recap">Weekly Recap</SelectItem>
                  <SelectItem value="Game Day Preview">Game Day Preview</SelectItem>
                  <SelectItem value="Player Spotlight">Player Spotlight</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isEpisodeModalOpen} onOpenChange={setIsEpisodeModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Episode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Episode</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Show</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select show" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volleyball">Volleyball Highlights</SelectItem>
                        <SelectItem value="recap">Weekly Recap</SelectItem>
                        <SelectItem value="preview">Game Day Preview</SelectItem>
                        <SelectItem value="spotlight">Player Spotlight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Episode Title</Label>
                    <Input placeholder="Enter episode title..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Enter episode description..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEpisodeModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsEpisodeModalOpen(false)}>Create Episode</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Episodes Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Episode</TableHead>
                  <TableHead>Show</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEpisodes.map((episode) => (
                  <TableRow key={episode.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-16 rounded">
                          <AvatarImage src={episode.thumbnail} className="object-cover" />
                          <AvatarFallback className="rounded">
                            <Play className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{episode.title}</div>
                          <div className="text-sm text-muted-foreground">{episode.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {episode.showTitle}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{episode.duration}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(episode.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{episode.views}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{episode.publishedAt}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="mr-2 h-4 w-4" />
                            {episode.status === "draft" ? "Publish" : "Re-upload"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Podcasts Tab */}
        <TabsContent value="podcasts" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Headphones className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Podcast Management</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Audio content and podcast series management will be available here
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Podcast Series
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}