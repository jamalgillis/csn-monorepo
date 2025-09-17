"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Chart } from "@/components/ui/chart";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye,
  Clock,
  Play,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useState } from "react";

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalViews: 245680,
    viewsChange: 12.5,
    activeUsers: 18420,
    usersChange: -3.2,
    avgWatchTime: "08:45",
    timeChange: 8.7,
    liveViewers: 3240,
    liveChange: 15.3
  },
  topContent: [
    { id: "1", title: "McLennan vs Vernon Highlights", views: 12540, duration: "12:34", engagement: 87 },
    { id: "2", title: "Coach Martinez Interview", views: 8920, duration: "25:12", engagement: 92 },
    { id: "3", title: "Player Spotlight: Sarah Johnson", views: 7650, duration: "08:45", engagement: 78 },
    { id: "4", title: "Game Analysis: Temple vs Cisco", views: 6430, duration: "15:20", engagement: 81 }
  ],
  viewerDemographics: [
    { category: "18-24", percentage: 35, count: 6447 },
    { category: "25-34", percentage: 28, count: 5158 },
    { category: "35-44", percentage: 22, count: 4052 },
    { category: "45-54", percentage: 10, count: 1842 },
    { category: "55+", percentage: 5, count: 921 }
  ],
  deviceBreakdown: [
    { device: "Mobile", percentage: 45, trend: 5.2 },
    { device: "Desktop", percentage: 35, trend: -2.1 },
    { device: "Tablet", percentage: 15, trend: 1.8 },
    { device: "TV/Smart TV", percentage: 5, trend: 12.5 }
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("views");

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Track performance and viewer insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">24h</SelectItem>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="30days">30 days</SelectItem>
              <SelectItem value="90days">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalViews)}</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(mockAnalytics.overview.viewsChange)}
              <span className={getTrendColor(mockAnalytics.overview.viewsChange)}>
                {Math.abs(mockAnalytics.overview.viewsChange)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.activeUsers)}</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(mockAnalytics.overview.usersChange)}
              <span className={getTrendColor(mockAnalytics.overview.usersChange)}>
                {Math.abs(mockAnalytics.overview.usersChange)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.overview.avgWatchTime}</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(mockAnalytics.overview.timeChange)}
              <span className={getTrendColor(mockAnalytics.overview.timeChange)}>
                {Math.abs(mockAnalytics.overview.timeChange)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Viewers</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.liveViewers)}</div>
            <div className="flex items-center text-xs">
              {getTrendIcon(mockAnalytics.overview.liveChange)}
              <span className={getTrendColor(mockAnalytics.overview.liveChange)}>
                {Math.abs(mockAnalytics.overview.liveChange)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Performing Content */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Most viewed content in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Engagement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAnalytics.topContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">{item.duration}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatNumber(item.views)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={item.engagement} className="w-16" />
                            <span className="text-sm">{item.engagement}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Content Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
                <CardDescription>Performance by content type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Game Highlights</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interviews</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <Progress value={30} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Player Spotlights</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <Progress value={15} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Live Games</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Viewer Demographics</CardTitle>
                <CardDescription>Age distribution of your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.viewerDemographics.map((demo) => (
                    <div key={demo.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{demo.category}</span>
                        <div className="text-sm">
                          <span className="font-medium">{demo.percentage}%</span>
                          <span className="text-muted-foreground ml-1">
                            ({formatNumber(demo.count)})
                          </span>
                        </div>
                      </div>
                      <Progress value={demo.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>How viewers access your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.deviceBreakdown.map((device) => (
                    <div key={device.device} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{device.device}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{device.percentage}%</span>
                          <div className="flex items-center text-xs">
                            {getTrendIcon(device.trend)}
                            <span className={getTrendColor(device.trend)}>
                              {Math.abs(device.trend)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Progress value={device.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Avg Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12:34</div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">+2.3% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23%</div>
                <div className="flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">-1.8% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">67%</div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">+4.1% from last week</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Revenue Analytics</h3>
              <p className="text-muted-foreground mb-6 text-center">
                Revenue tracking will be available once monetization features are enabled
              </p>
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Setup Revenue Tracking
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}