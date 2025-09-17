"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, Tv, Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface GameEvent {
  id: string;
  homeTeam: { name: string; abbreviation: string };
  awayTeam: { name: string; abbreviation: string };
  sport: string;
  game_date: string;
  venue?: string;
  status: "scheduled" | "in_progress" | "final" | "postponed";
}

interface ScheduleCalendarProps {
  onDateSelect?: (date: Date) => void;
  onGameSelect?: (game: GameEvent) => void;
  onAddGame?: (date: Date) => void;
}

export function ScheduleCalendar({
  onDateSelect,
  onGameSelect,
  onAddGame
}: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch games from Convex
  const games = useQuery(api.sports.getAllGames) || [];

  // Convert games to date-game mapping for calendar
  const gamesByDate = React.useMemo(() => {
    const gamesMap = new Map<string, GameEvent[]>();

    games.forEach((game) => {
      const gameDate = new Date(game.game_date).toDateString();
      if (!gamesMap.has(gameDate)) {
        gamesMap.set(gameDate, []);
      }
      gamesMap.get(gameDate)?.push({
        id: game._id,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        sport: game.sport,
        game_date: game.game_date,
        venue: game.venue,
        status: game.status
      });
    });

    return gamesMap;
  }, [games]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect?.(date);
    }
  };

  const getSelectedDateGames = () => {
    const dateKey = selectedDate.toDateString();
    return gamesByDate.get(dateKey) || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-destructive text-destructive-foreground";
      case "scheduled":
        return "bg-blue-500 text-white";
      case "final":
        return "bg-green-500 text-white";
      case "postponed":
        return "bg-yellow-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Schedule Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              hasGames: (date) => {
                const dateKey = date.toDateString();
                return gamesByDate.has(dateKey) && gamesByDate.get(dateKey)!.length > 0;
              }
            }}
            modifiersStyles={{
              hasGames: {
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold'
              }
            }}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Days with scheduled games</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Games */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Games on {selectedDate.toLocaleDateString()}
          </CardTitle>
          <Button
            size="sm"
            onClick={() => onAddGame?.(selectedDate)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Game
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getSelectedDateGames().length > 0 ? (
              getSelectedDateGames().map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onGameSelect?.(game)}
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {game.awayTeam.name} @ {game.homeTeam.name}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(game.game_date)}
                      </div>
                      {game.venue && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {game.venue}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{game.sport}</Badge>
                    <Badge className={getStatusColor(game.status)}>
                      {game.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No games scheduled for this date</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => onAddGame?.(selectedDate)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule a Game
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}