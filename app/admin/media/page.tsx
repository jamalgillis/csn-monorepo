"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Upload,
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  FolderPlus,
  Grid,
  List,
  Link,
  Play,
  Expand,
  HardDrive,
  Clock,
  Folder,
  Tag,
  CheckCircle,
  Pause,
  X,
  PauseCircle
} from "lucide-react";
import { useState, useCallback } from "react";

// Mock data matching the superdesign mockup
const mockMediaFiles = [
  {
    id: "1",
    name: "McLennan vs Vernon - Game Action",
    type: "image",
    size: "2.4 MB",
    format: "JPG",
    uploadDate: "2 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=280&h=180&fit=crop",
    tags: ["Volleyball", "Game"],
    status: "ready",
    category: "Game Photos"
  },
  {
    id: "2",
    name: "Volleyball Highlights Reel",
    type: "video",
    size: "245 MB", 
    format: "MP4",
    duration: "15:42",
    uploadDate: "Processing...",
    tags: ["Processing"],
    status: "processing",
    progress: 67,
    category: "Game Footage"
  },
  {
    id: "3",
    name: "Team Photo - McLennan Roster",
    type: "image",
    size: "5.1 MB",
    format: "PNG",
    uploadDate: "1 day ago",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=280&h=180&fit=crop",
    tags: ["Team", "Official"],
    status: "ready",
    category: "Team Photos"
  },
  {
    id: "4",
    name: "Coach Interview - Post Game",
    type: "audio",
    size: "12.3 MB",
    format: "MP3",
    duration: "8:15",
    uploadDate: "3 hours ago",
    tags: ["Interview", "Audio"],
    status: "ready",
    category: "Interviews"
  }
];

const uploadQueue = [
  { id: "u1", name: "new-highlights.mp4", progress: 75, status: "uploading", size: "180 MB" },
  { id: "u2", name: "interview-audio.wav", progress: 100, status: "processing", size: "45 MB" }
];

const mockFolders = [
  { name: "Game Footage", count: 45, icon: Folder },
  { name: "Team Photos", count: 328, icon: Folder },
  { name: "Highlights", count: 23, icon: Folder },
  { name: "Promotional", count: 67, icon: Folder }
];

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSport, setSelectedSport] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUploadQueue, setShowUploadQueue] = useState(false);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);

  const filteredFiles = mockMediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || file.type === selectedType;
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setShowUploadQueue(true);
    console.log("Files dropped:", e.dataTransfer.files);
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-12 w-12" />;
      case "audio": return <Music className="h-12 w-12" />;
      case "image": return <ImageIcon className="h-12 w-12" />;
      default: return <File className="h-12 w-12" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <Badge className="bg-green-600 hover:bg-green-600">
            <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
            Ready
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "ready":
        return <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>;
      case "processing":
        return <div className="absolute top-3 right-3 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full animate-pulse"></div>;
      case "failed":
        return <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>;
      default:
        return null;
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectFiles = () => {
    setShowUploadQueue(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Media Upload & Management</h2>
          <p className="text-muted-foreground">Upload, process, and organize your sports media content</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <HardDrive className="w-4 h-4" />
            <span>Storage: 6.8GB / 10GB</span>
          </div>
          <Button variant="outline" onClick={() => setShowUploadQueue(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Clear Completed
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <ImageIcon className="w-4 h-4 mr-2" />
            Photo Gallery
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Folder className="w-4 h-4 mr-2" />
            Media Organization
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          {/* Upload Zone */}
          <Card 
            className={`border-2 border-dashed min-h-[300px] transition-all duration-300 ${
              isDragOver ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center h-full py-16">
              <Upload className={`h-16 w-16 mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="text-xl font-semibold mb-2">Drop your media files here</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Supports videos, images, and audio files up to 500MB each
              </p>
              <div className="flex items-center gap-4 mb-6">
                <Button onClick={handleSelectFiles}>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
                <span className="text-muted-foreground">or</span>
                <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                      <Link className="mr-2 h-4 w-4" />
                      Upload from URL
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload from URL</DialogTitle>
                      <DialogDescription>
                        Enter a URL to upload media content directly.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="media-url">Media URL</Label>
                        <Input id="media-url" placeholder="https://example.com/video.mp4" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsUrlDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsUrlDialogOpen(false)}>Upload</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                <p>Supported formats: MP4, MOV, AVI, JPG, PNG, GIF, MP3, WAV</p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Queue */}
          {showUploadQueue && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upload Queue</CardTitle>
                  <Button variant="ghost" size="sm">
                    <PauseCircle className="mr-1 h-4 w-4" />
                    Pause All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadQueue.map((upload) => (
                  <div key={upload.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center">
                      <Video className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{upload.name}</h4>
                      <p className="text-sm text-muted-foreground">{upload.size}</p>
                      <div className="mt-2">
                        <Progress value={upload.progress} className="h-2" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {upload.status === "uploading" ? `Uploading... ${upload.progress}%` : upload.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Photo Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Game Photos">Game Photos</SelectItem>
                  <SelectItem value="Team Photos">Team Photos</SelectItem>
                  <SelectItem value="Event Photos">Event Photos</SelectItem>
                  <SelectItem value="Promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {selectedFiles.length} items selected
                  </span>
                  <Button size="sm">
                    <Tag className="mr-1 h-4 w-4" />
                    Add Tags
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Folder className="mr-1 h-4 w-4" />
                    Move to Folder
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Files</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedFiles.length} selected files? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>
                  Clear Selection
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Media Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="aspect-video relative bg-gradient-to-br from-muted to-accent/20">
                  {file.thumbnail ? (
                    <img 
                      src={file.thumbnail} 
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="sm" className="rounded-full w-12 h-12">
                      {file.type === "video" ? (
                        <Play className="w-6 h-6" />
                      ) : (
                        <Expand className="w-6 h-6" />
                      )}
                    </Button>
                  </div>

                  {/* Status Indicator */}
                  {getStatusIndicator(file.status)}

                  {/* Duration for video/audio */}
                  {file.duration && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {file.duration}
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Checkbox 
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => handleFileSelect(file.id)}
                    />
                    <h4 className="font-medium text-sm flex-1 truncate">{file.name}</h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{file.size} • {file.format}</span>
                    <span>{file.uploadDate}</span>
                  </div>
                  
                  {/* Processing Progress */}
                  {file.status === "processing" && file.progress && (
                    <div className="mb-2">
                      <Progress value={file.progress} className="h-1" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 mb-3">
                    {file.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(file.status)}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          {/* Storage Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <Progress value={68} className="h-3" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">6.8 GB used</span>
                  <span className="text-muted-foreground">10 GB total</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">68% of storage used</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Media Count</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="space-y-1 text-sm text-muted-foreground mt-2">
                  <div>Videos: 89</div>
                  <div>Images: 1,095</div>
                  <div>Audio: 63</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Queue</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">3</div>
                <p className="text-sm text-muted-foreground">Items being processed</p>
                <Button className="w-full mt-3" variant="outline" size="sm">
                  View Queue
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Folder Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Folder Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockFolders.map((folder, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                      <Folder className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium flex-1">{folder.name}</span>
                      <span className="text-sm text-muted-foreground">{folder.count} files</span>
                    </div>
                    {index < mockFolders.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}