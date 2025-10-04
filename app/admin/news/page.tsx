"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Edit, Eye, Plus, AlertTriangle, TrendingUp, Clock, Trash2, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useContent } from "@/hooks/admin/useAdminQueries"
import { useContentMutations } from "@/hooks/admin/useAdminMutationsV2"

export default function AdminNewsPage() {
  const { content, isLoading } = useContent()
  const { createContent, updateContent, deleteContent } = useContentMutations()

  const [contentDialogOpen, setContentDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [contentForm, setContentForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author_id: "",
    category: "article" as "article" | "news" | "analysis" | "feature",
    tags: [] as string[],
    featured_image_url: "",
    status: "draft" as "draft" | "published" | "scheduled" | "archived",
    published_at: undefined as number | undefined,
    is_featured: false,
    is_breaking: false,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading content...</span>
      </div>
    )
  }

  const handleCreateContent = async () => {
    try {
      await createContent({
        ...contentForm,
        slug: contentForm.slug || contentForm.title.toLowerCase().replace(/\s+/g, "-"),
        published_at: contentForm.status === "published" ? Date.now() : undefined,
      })
      setContentDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to create content:", error)
    }
  }

  const handleUpdateContent = async () => {
    if (!editingContent) return
    try {
      await updateContent({
        contentId: editingContent._id,
        ...contentForm,
      })
      setContentDialogOpen(false)
      setEditingContent(null)
      resetForm()
    } catch (error) {
      console.error("Failed to update content:", error)
    }
  }

  const handleDeleteContent = async (contentId: any) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      await deleteContent(contentId)
    } catch (error) {
      console.error("Failed to delete content:", error)
    }
  }

  const handleToggleBreaking = async (article: any) => {
    try {
      await updateContent({
        contentId: article._id,
        is_breaking: !article.is_breaking,
      })
    } catch (error) {
      console.error("Failed to toggle breaking status:", error)
    }
  }

  const openContentDialog = (article?: any) => {
    if (article) {
      setEditingContent(article)
      setContentForm({
        title: article.title || "",
        slug: article.slug || "",
        content: article.content || "",
        excerpt: article.excerpt || "",
        author_id: article.author_id || "",
        category: article.category || "article",
        tags: article.tags || [],
        featured_image_url: article.featured_image_url || "",
        status: article.status || "draft",
        published_at: article.published_at,
        is_featured: article.is_featured || false,
        is_breaking: article.is_breaking || false,
      })
    } else {
      setEditingContent(null)
      resetForm()
    }
    setContentDialogOpen(true)
  }

  const resetForm = () => {
    setContentForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      author_id: "",
      category: "article",
      tags: [],
      featured_image_url: "",
      status: "draft",
      published_at: undefined,
      is_featured: false,
      is_breaking: false,
    })
  }

  // Filter content
  const filteredContent = content?.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || article.status === statusFilter
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  }) || []

  const publishedToday = content?.filter(c => {
    const today = new Date().setHours(0, 0, 0, 0)
    const publishedDate = c.published_at ? new Date(c.published_at).setHours(0, 0, 0, 0) : 0
    return publishedDate === today
  }).length || 0

  const totalViews = content?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0
  const pendingReview = content?.filter(c => c.status === "draft").length || 0

  const formatPublishedDate = (publishedAt?: number, status?: string) => {
    if (status === "draft") return "Draft"
    if (status === "scheduled" && publishedAt) {
      const date = new Date(publishedAt)
      return `Scheduled: ${date.toLocaleDateString()}`
    }
    if (publishedAt) {
      const date = new Date(publishedAt)
      const now = Date.now()
      const diff = now - publishedAt
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours < 24) return `${hours} hours ago`
      return date.toLocaleDateString()
    }
    return "N/A"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground">Manage articles, breaking news, and content publishing</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
          <Button variant="outline">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Breaking News
          </Button>
        </div>
      </div>

      {/* Breaking News Control */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Breaking News Ticker</span>
          </CardTitle>
          <CardDescription>Manage the breaking news ticker displayed across the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={breakingNews}
            onChange={(e) => setBreakingNews(e.target.value)}
            placeholder="Enter breaking news message..."
            className="min-h-20"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch defaultChecked />
              <span className="text-sm">Active</span>
            </div>
            <Button>Update Ticker</Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234K</div>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>Manage news articles, publishing status, and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Articles</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="trade">Trade News</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="injury">Injury News</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search articles..." className="max-w-sm" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Breaking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="font-medium">{article.title}</div>
                  </TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.status === "published"
                          ? "default"
                          : article.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {article.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{article.publishedAt}</TableCell>
                  <TableCell>{article.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <Switch checked={article.isBreaking} onCheckedChange={() => toggleBreaking(article.id)} />
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
    </div>
  )
}
