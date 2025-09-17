"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  ArrowDownRight,
  Settings,
  RefreshCw,
  Plus,
  Radio,
  Heart,
  User,
  Video,
  Minus,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

// Mock analytics data matching the superdesign mockup
const mockAnalytics = {
  overview: {
    totalViews: "847.2K",
    viewsChange: 15.3,
    engagementRate: "68.4%",
    engagementChange: 8.7,
    liveViewers: 2847,
    liveChange: 24.1,
    contentHours: 1284,
    hoursChange: 12.8
  },
  topContent: [
    { 
      id: "1", 
      title: "Championship Finals Highlights", 
      subtitle: "McLennan vs Vernon",
      sport: "Volleyball", 
      views: "24.7K", 
      viewsChange: 18.5,
      engagement: 92, 
      duration: "15:42", 
      performance: "Trending",
      thumbnail: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=48&h=32&fit=crop"
    },
    { 
      id: "2", 
      title: "Weekly Sports Recap", 
      subtitle: "Episode #8",
      sport: "Multi-Sport", 
      views: "18.2K", 
      viewsChange: 12.3,
      engagement: 78, 
      duration: "22:15", 
      performance: "Growing",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=48&h=32&fit=crop"
    },
    { 
      id: "3", 
      title: "Player Spotlight: Sarah Johnson", 
      subtitle: "McLennan Volleyball",
      sport: "Volleyball", 
      views: "14.6K", 
      viewsChange: -3.2,
      engagement: 65, 
      duration: "18:33", 
      performance: "Stable",
      thumbnail: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=48&h=32&fit=crop"
    }
  ],
  reports: [
    {
      id: "1",
      title: "Monthly Performance",
      subtitle: "September 2025",
      description: "Comprehensive monthly analytics including viewership, engagement, and content performance metrics.",
      generatedAt: "2 hours ago",
      icon: TrendingUp,
      color: "bg-primary/20 text-primary"
    },
    {
      id: "2",
      title: "Audience Insights",
      subtitle: "Q3 2025",
      description: "Detailed audience demographics, behavior patterns, and engagement analysis.",
      generatedAt: "1 day ago",
      icon: Users,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      id: "3",
      title: "Content Analysis",
      subtitle: "Sports Content",
      description: "In-depth analysis of content performance across different sports and formats.",
      generatedAt: "3 days ago",
      icon: Video,
      color: "bg-green-100 text-green-600"
    }
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  const formatNumber = (num: number | string) => {
    if (typeof num === 'string') return num;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-3 w-3" />
    ) : (
      <ArrowDownRight className="h-3 w-3" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  const getTrendBadge = (performance: string) => {
    switch (performance.toLowerCase()) {
      case "trending":
        return (
          <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        );
      case "growing":
        return (
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
            <TrendingUp className="w-3 h-3 mr-1" />
            Growing
          </Badge>
        );
      case "stable":
        return (
          <Badge variant="secondary">
            <Minus className="w-3 h-3 mr-1" />
            Stable
          </Badge>
        );
      default:
        return <Badge variant="secondary">{performance}</Badge>;
    }
  };

  const getSportIcon = (sport: string) => {
    return sport.substring(0, 2).toUpperCase();
  };

  const getEngagementLevel = (engagement: number) => {
    if (engagement >= 85) return { level: "excellent", color: "bg-green-500" };
    if (engagement >= 70) return { level: "good", color: "bg-yellow-500" };
    return { level: "average", color: "bg-gray-400" };
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into your sports content performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Last 30 Days</span>
          </div>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Views */}
        <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-500 to-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              {mockAnalytics.overview.totalViews}
            </div>
            <div className="flex items-center text-xs mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(mockAnalytics.overview.viewsChange)} bg-green-100`}>
                {getTrendIcon(mockAnalytics.overview.viewsChange)}
                <span className="font-medium">+{Math.abs(mockAnalytics.overview.viewsChange)}%</span>
              </div>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-500 to-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              {mockAnalytics.overview.engagementRate}
            </div>
            <div className="flex items-center text-xs mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(mockAnalytics.overview.engagementChange)} bg-green-100`}>
                {getTrendIcon(mockAnalytics.overview.engagementChange)}
                <span className="font-medium">+{Math.abs(mockAnalytics.overview.engagementChange)}%</span>
              </div>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Live Viewers */}
        <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-500 to-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Viewers</CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <Radio className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              {formatNumber(mockAnalytics.overview.liveViewers)}
            </div>
            <div className="flex items-center text-xs mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(mockAnalytics.overview.liveChange)} bg-green-100`}>
                {getTrendIcon(mockAnalytics.overview.liveChange)}
                <span className="font-medium">+{Math.abs(mockAnalytics.overview.liveChange)}%</span>
              </div>
              <span className="text-muted-foreground ml-2">peak today</span>
            </div>
          </CardContent>
        </Card>

        {/* Content Hours */}
        <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-500 to-green-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Hours</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              {formatNumber(mockAnalytics.overview.contentHours)}
            </div>
            <div className="flex items-center text-xs mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(mockAnalytics.overview.hoursChange)} bg-green-100`}>
                {getTrendIcon(mockAnalytics.overview.hoursChange)}
                <span className="font-medium">+{Math.abs(mockAnalytics.overview.hoursChange)}%</span>
              </div>
              <span className="text-muted-foreground ml-2">hours published</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Viewership Trends */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Viewership Trends</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm">Daily</Button>
                <Button variant="ghost" size="sm">Weekly</Button>
                <Button variant="ghost" size="sm">Monthly</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <p>Viewership trends chart would be displayed here</p>
                <p className="text-sm">Integration with Chart.js or similar library</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Content Performance by Sport</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <PieChart className="w-16 h-16 mx-auto mb-4" />
                <p>Sport performance chart would be displayed here</p>
                <p className="text-sm">Doughnut chart showing sport distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Top Performing Content</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnalytics.topContent.map((item) => {
                const engagementInfo = getEngagementLevel(item.engagement);
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded flex items-center justify-center">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                          {getSportIcon(item.sport)}
                        </div>
                        <span className="text-sm">{item.sport}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.views}</div>
                      <div className={`text-xs ${getTrendColor(item.viewsChange)}`}>
                        {item.viewsChange >= 0 ? '+' : ''}{item.viewsChange}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1">
                        <span className="font-medium">{item.engagement}%</span>
                        <span className="text-xs text-muted-foreground ml-1">{engagementInfo.level}</span>
                      </div>
                      <Progress value={item.engagement} className="h-2" />
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{item.duration}</span>
                    </TableCell>
                    <TableCell>
                      {getTrendBadge(item.performance)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reports and Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Audience Demographics */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Audience Demographics</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <p>Demographics chart would be displayed here</p>
                <p className="text-sm">Age and location breakdown visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Heatmap */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Engagement Heatmap</CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span>High</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <p>Engagement heatmap would be displayed here</p>
                <p className="text-sm">7-day x 24-hour activity visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Available Reports</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAnalytics.reports.map((report) => (
            <Card key={report.id} className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.color}`}>
                    <report.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Generated {report.generatedAt}</span>
                  <Button variant="ghost" size="sm" className="text-primary hover:underline">
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}