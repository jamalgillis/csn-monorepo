"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radio,
  Calendar,
  PlayCircle,
  Upload,
  CalendarPlus,
  PlusCircle,
  Newspaper,
  BarChart3,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Fallback dashboard metrics for loading/error states
const fallbackMetrics = {
  liveGames: {
    count: 0,
    description: "No live games",
    status: "offline"
  },
  scheduledThisWeek: {
    count: 0,
    change: "No data available",
    status: "scheduled"
  },
  activeShows: {
    count: 0,
    update: "No data available",
    status: "offline"
  },
  mediaToday: {
    count: 0,
    breakdown: "No data available",
    status: "offline"
  }
};

// Static data removed - now using real Convex data

export default function AdminDashboard() {
  // Fetch real-time admin dashboard metrics from Convex
  const adminMetrics = useQuery(api.admin.getAdminDashboardMetrics);
  const recentActivity = useQuery(api.admin.getRecentAdminActivity, { limit: 10 });
  const systemHealth = useQuery(api.admin.getSystemHealthStatus);

  const isLoading = adminMetrics === undefined || recentActivity === undefined;
  const hasError = adminMetrics === null || recentActivity === null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with CSN today.</p>
        {systemHealth && (
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-muted-foreground">
              System {systemHealth.status} • DB: {systemHealth.checks?.database || 'unknown'}
            </span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading dashboard metrics...</span>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <span className="ml-2 text-destructive">Failed to load dashboard data. Please try refreshing.</span>
        </div>
      )}

      {/* Metrics Cards - Real data from Convex */}
      {adminMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Live Games Card */}
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Live Games Now</h3>
                <div className="flex items-center gap-2">
                  {adminMetrics.liveGames > 0 && (
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  )}
                  <Radio className={`w-4 h-4 ${adminMetrics.liveGames > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                </div>
              </div>
              <div className={`text-3xl font-bold mb-2 ${adminMetrics.liveGames > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {adminMetrics.liveGames}
              </div>
              <p className="text-xs text-muted-foreground">
                {adminMetrics.liveGames > 0 ? `${adminMetrics.liveGames} games in progress` : 'No live games'}
              </p>
            </CardContent>
          </Card>

          {/* Scheduled Games Card */}
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Scheduled Games</h3>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">{adminMetrics.scheduledGames}</div>
              <p className="text-xs text-muted-foreground">
                {adminMetrics.scheduledGames} upcoming games
              </p>
            </CardContent>
          </Card>

          {/* Total Content Card */}
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Content</h3>
                <PlayCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-amber-500 mb-2">{adminMetrics.totalContent}</div>
              <p className="text-xs text-muted-foreground">
                {adminMetrics.publishedContent} published, {adminMetrics.draftContent} drafts
              </p>
            </CardContent>
          </Card>

          {/* Total Users Card */}
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Platform Users</h3>
                <Upload className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">{adminMetrics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Weekly Viewership Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart integration pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Content Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart integration pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button 
            variant="ghost" 
            className="h-auto p-6 flex flex-col items-center justify-center group hover:bg-accent/50"
          >
            <CalendarPlus className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-2">Schedule New Game</h4>
            <p className="text-sm text-muted-foreground text-center">Add a new game to the schedule</p>
          </Button>

          <Button 
            variant="ghost" 
            className="h-auto p-6 flex flex-col items-center justify-center group hover:bg-accent/50"
          >
            <Upload className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-2">Upload Media</h4>
            <p className="text-sm text-muted-foreground text-center">Add photos, videos, or highlights</p>
          </Button>

          <Button 
            variant="ghost" 
            className="h-auto p-6 flex flex-col items-center justify-center group hover:bg-accent/50"
          >
            <PlusCircle className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold mb-2">Create Show Episode</h4>
            <p className="text-sm text-muted-foreground text-center">Add new content to shows</p>
          </Button>
        </div>
      </div>

      {/* Recent Activity Feed - Real data from Convex */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentActivity ? (
            <div className="divide-y">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const getActivityIcon = (type: string) => {
                    switch (type) {
                      case "game_update": return Calendar;
                      case "content_update": return PlayCircle;
                      default: return Clock;
                    }
                  };

                  const getActivityColor = (type: string) => {
                    switch (type) {
                      case "game_update": return "text-blue-500";
                      case "content_update": return "text-amber-500";
                      default: return "text-muted-foreground";
                    }
                  };

                  const ActivityIcon = getActivityIcon(activity.type);
                  const timeAgo = new Date(activity.timestamp).toLocaleString();

                  return (
                    <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <ActivityIcon className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">{timeAgo}</p>
                        </div>
                        {activity.metadata && (
                          <Badge variant="secondary">
                            {activity.metadata.status || activity.type.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading recent activity...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}