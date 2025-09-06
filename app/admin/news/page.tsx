"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Edit, Eye, Plus, AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { useState } from "react"

export default function AdminNewsPage() {
  const [articles, setArticles] = useState([
    {
      id: "lakers-trade",
      title: "Lakers Complete Blockbuster Trade",
      category: "Trade News",
      status: "published",
      isBreaking: true,
      author: "Sports Desk",
      publishedAt: "2 hours ago",
      views: 45230,
      comments: 156,
    },
    {
      id: "mvp-race",
      title: "MVP Race Heating Up",
      category: "Analysis",
      status: "draft",
      isBreaking: false,
      author: "John Smith",
      publishedAt: "Draft",
      views: 0,
      comments: 0,
    },
    {
      id: "injury-report",
      title: "Weekly Injury Report",
      category: "Injury News",
      status: "scheduled",
      isBreaking: false,
      author: "Medical Team",
      publishedAt: "Tomorrow 9:00 AM",
      views: 0,
      comments: 0,
    },
  ])

  const [breakingNews, setBreakingNews] = useState("Lakers complete blockbuster trade with Warriors")

  const toggleBreaking = (articleId: string) => {
    setArticles(
      articles.map((article) => (article.id === articleId ? { ...article, isBreaking: !article.isBreaking } : article)),
    )
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
