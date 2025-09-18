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
  List
} from "lucide-react";
import { useState, useCallback } from "react";

// Mock data for media files
const mockMediaFiles = [
  {
    id: "1",
    name: "volleyball-highlights-2024.mp4",
    type: "video",
    size: "125.4 MB",
    uploadDate: "2024-01-15",
    thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=200&h=150&fit=crop",
    duration: "12:34",
    tags: ["volleyball", "highlights", "2024"],
    status: "ready"
  },
  {
    id: "2",
    name: "coach-interview-martinez.mp3",
    type: "audio",
    size: "45.2 MB", 
    uploadDate: "2024-01-14",
    duration: "25:12",
    tags: ["interview", "coach", "audio"],
    status: "processing"
  },
  {
    id: "3",
    name: "team-photo-mclennan.jpg",
    type: "image",
    size: "8.7 MB",
    uploadDate: "2024-01-13",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop",
    dimensions: "3840x2160",
    tags: ["team", "photo", "mclennan"],
    status: "ready"
  },
  {
    id: "4",
    name: "game-stats-export.csv",
    type: "document", 
    size: "2.1 MB",
    uploadDate: "2024-01-12",
    tags: ["stats", "data", "export"],
    status: "ready"
  }
];

const uploadQueue = [
  { id: "u1", name: "new-highlights.mp4", progress: 75, status: "uploading" },
  { id: "u2", name: "interview-audio.wav", progress: 100, status: "processing" }
];

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const filteredFiles = mockMediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || file.type === selectedType;
    return matchesSearch && matchesType;
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
    // Handle file drop logic here
    console.log("Files dropped:", e.dataTransfer.files);
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-5 w-5" />;
      case "audio": return <Music className="h-5 w-5" />;
      case "image": return <ImageIcon className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-600">Ready</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Management</h1>
          <p className="text-muted-foreground">Upload and organize your media files</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="library">Media Library</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>

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
              <h3 className="text-xl font-semibold mb-2">Drop files here to upload</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Supports videos, images, audio files, and documents up to 500MB each
              </p>
              <div className="flex items-center gap-4">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
                <Button variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Select Folder
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadQueue.map((upload) => (
                  <div key={upload.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{upload.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {upload.status === "uploading" ? `${upload.progress}%` : upload.status}
                      </span>
                    </div>
                    <Progress value={upload.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedFiles.length} selected
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
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
                  <Separator orientation="vertical" className="h-6" />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Media Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted">
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
                    <div className="absolute top-2 left-2">
                      <Checkbox 
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => handleFileSelect(file.id)}
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(file.status)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate mb-1">{file.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{file.size}</span>
                        <span>{file.uploadDate}</span>
                      </div>
                      {file.duration && (
                        <div>Duration: {file.duration}</div>
                      )}
                      {file.dimensions && (
                        <div>{file.dimensions}</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1">
                        {file.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {filteredFiles.map((file, index) => (
                    <div key={file.id}>
                      <div className="flex items-center gap-4 p-4">
                        <Checkbox 
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => handleFileSelect(file.id)}
                        />
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            {file.thumbnail ? (
                              <img 
                                src={file.thumbnail} 
                                alt={file.name}
                                className="w-12 h-8 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium truncate">{file.name}</h3>
                            <div className="text-sm text-muted-foreground">
                              {file.size} • {file.uploadDate}
                              {file.duration && ` • ${file.duration}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(file.status)}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {index < filteredFiles.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="folders" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderPlus className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Folders Created</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Organize your media files by creating folders
              </p>
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create First Folder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}