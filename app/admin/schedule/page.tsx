"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  BarChart3,
  Users,
  Loader2
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Import our new components
import { ScheduleCalendar } from "@/components/admin/games/ScheduleCalendar";
import { GameForm } from "@/components/admin/games/GameForm";
import { GamesTable } from "@/components/admin/games/GamesTable";

export default function AdminSchedulePage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isEditGameOpen, setIsEditGameOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Fetch data from Convex
  const adminMetrics = useQuery(api.admin.getAdminDashboardMetrics);
  const games = useQuery(api.sports.getAllGames) || [];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setActiveTab("calendar");
  };

  const handleAddGame = (date?: Date) => {
    setSelectedDate(date);
    setIsAddGameOpen(true);
  };

  const handleEditGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setIsEditGameOpen(true);
  };

  const handleGoLive = (gameId: string) => {
    // TODO: Implement go live functionality
    console.log("Go live for game:", gameId);
  };

  const handleGameFormSuccess = () => {
    setIsAddGameOpen(false);
    setIsEditGameOpen(false);
    setSelectedGameId("");
    setSelectedDate(undefined);
  };

  const handleGameFormCancel = () => {
    setIsAddGameOpen(false);
    setIsEditGameOpen(false);
    setSelectedGameId("");
    setSelectedDate(undefined);
  };

  // Calculate metrics from real data
  const todaysGames = games.filter(game => {
    const gameDate = new Date(game.game_date);
    const today = new Date();
    return gameDate.toDateString() === today.toDateString();
  });

  const thisWeekGames = games.filter(game => {
    const gameDate = new Date(game.game_date);
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    return gameDate >= today && gameDate <= weekFromNow;
  });

  const liveGames = games.filter(game => game.status === "in_progress");

  const isLoading = adminMetrics === undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">
            Manage game schedules with interactive calendar and comprehensive tools
          </p>
        </div>
        <Button onClick={() => handleAddGame()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Game
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading schedule data...</span>
        </div>
      )}

      {/* Stats Cards - Real data */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{games.length}</div>
              <p className="text-xs text-muted-foreground">All scheduled games</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Games</CardTitle>
              {liveGames.length > 0 && (
                <div className="h-2 w-2 bg-destructive rounded-full animate-pulse" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${liveGames.length > 0 ? 'text-destructive' : ''}`}>
                {liveGames.length}
              </div>
              <p className="text-xs text-muted-foreground">Currently broadcasting</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Games</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysGames.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisWeekGames.length}</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content - Tabs */}
      {!isLoading && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Table View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <ScheduleCalendar
              onDateSelect={handleDateSelect}
              onAddGame={handleAddGame}
            />
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <GamesTable
              onEditGame={handleEditGame}
              onGoLive={handleGoLive}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Add Game Dialog */}
      <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Game</DialogTitle>
            <DialogDescription>
              Add a new game to the schedule with teams, venue, and timing details
            </DialogDescription>
          </DialogHeader>
          <GameForm
            initialDate={selectedDate}
            onSuccess={handleGameFormSuccess}
            onCancel={handleGameFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Game Dialog */}
      <Dialog open={isEditGameOpen} onOpenChange={setIsEditGameOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
            <DialogDescription>
              Update game details and schedule information
            </DialogDescription>
          </DialogHeader>
          <GameForm
            gameId={selectedGameId}
            onSuccess={handleGameFormSuccess}
            onCancel={handleGameFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
