"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, Ban, Eye, MessageSquare, Shield, Users } from "lucide-react"
import { useState } from "react"

export default function AdminChatPage() {
  const [reports, setReports] = useState([
    {
      id: "1",
      user: "SportsFan123",
      message: "This is inappropriate content",
      reporter: "ModeratorUser",
      timestamp: "2 minutes ago",
      status: "pending",
      severity: "high",
      context: "Lakers vs Warriors chat",
    },
    {
      id: "2",
      user: "BasketballLover",
      message: "Spam message repeated multiple times",
      reporter: "AutoMod",
      timestamp: "5 minutes ago",
      status: "resolved",
      severity: "medium",
      context: "SportsCenter show chat",
    },
  ])

  const [activeChats, setActiveChats] = useState([
    {
      id: "lakers-warriors",
      name: "Lakers vs Warriors",
      type: "game",
      activeUsers: 1247,
      messagesPerMinute: 45,
      moderators: 3,
      status: "active",
    },
    {
      id: "sportscenter",
      name: "SportsCenter Live",
      type: "show",
      activeUsers: 892,
      messagesPerMinute: 28,
      moderators: 2,
      status: "active",
    },
  ])

  const [bannedUsers, setBannedUsers] = useState([
    {
      id: "user1",
      username: "ToxicUser99",
      reason: "Harassment",
      bannedBy: "Admin",
      bannedAt: "1 hour ago",
      duration: "24 hours",
      status: "active",
    },
    {
      id: "user2",
      username: "SpamBot123",
      reason: "Spam",
      bannedBy: "AutoMod",
      bannedAt: "3 hours ago",
      duration: "Permanent",
      status: "active",
    },
  ])

  const handleReportAction = (reportId: string, action: string) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: action } : report)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chat Moderation</h1>
          <p className="text-muted-foreground">Monitor and moderate live chat across the platform</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Auto-Mod Settings
          </Button>
          <Button>
            <AlertTriangle className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Chat Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChats.length}</div>
            <p className="text-xs text-muted-foreground">Currently live</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,139</div>
            <p className="text-xs text-muted-foreground">Across all chats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bannedUsers.length}</div>
            <p className="text-xs text-muted-foreground">Currently banned</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="active-chats">Active Chats</TabsTrigger>
          <TabsTrigger value="banned-users">Banned Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Review and moderate reported messages and users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Search reports..." className="max-w-sm" />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Context</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{report.user[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{report.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{report.message}</TableCell>
                      <TableCell>{report.reporter}</TableCell>
                      <TableCell>{report.context}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.severity === "high"
                              ? "destructive"
                              : report.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {report.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.status === "pending" ? "outline" : "default"}>
                          {report.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "resolved")}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportAction(report.id, "dismissed")}
                          >
                            <Ban className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-chats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Chat Rooms</CardTitle>
              <CardDescription>Monitor live chat activity and assign moderators</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chat Room</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Messages/Min</TableHead>
                    <TableHead>Moderators</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeChats.map((chat) => (
                    <TableRow key={chat.id}>
                      <TableCell className="font-medium">{chat.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{chat.type.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>{chat.activeUsers.toLocaleString()}</TableCell>
                      <TableCell>{chat.messagesPerMinute}</TableCell>
                      <TableCell>{chat.moderators}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500">
                          {chat.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Shield className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banned-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banned Users</CardTitle>
              <CardDescription>Manage user bans and restrictions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Banned By</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Banned At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.reason}</TableCell>
                      <TableCell>{user.bannedBy}</TableCell>
                      <TableCell>{user.duration}</TableCell>
                      <TableCell>{user.bannedAt}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{user.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Unban
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
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <CardDescription>Configure auto-moderation and chat policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profanity Filter</label>
                  <Select defaultValue="strict">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="lenient">Lenient</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Spam Detection</label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rate Limiting</label>
                  <Input placeholder="Messages per minute" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-Ban Threshold</label>
                  <Input placeholder="Number of reports" defaultValue="5" />
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
