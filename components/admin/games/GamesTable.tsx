"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Play,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface GameData {
  _id: string;
  homeTeam: { name: string; abbreviation: string };
  awayTeam: { name: string; abbreviation: string };
  sport: string;
  game_date: string;
  venue?: string;
  status: "scheduled" | "in_progress" | "final" | "postponed";
  description?: string;
}

interface GamesTableProps {
  onEditGame?: (gameId: string) => void;
  onGoLive?: (gameId: string) => void;
}

type SortField = "game_date" | "homeTeam" | "awayTeam" | "sport" | "venue" | "status";
type SortDirection = "asc" | "desc";

export function GamesTable({ onEditGame, onGoLive }: GamesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("game_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Fetch games and sports
  const games = useQuery(api.sports.getAllGames) || [];
  const sports = useQuery(api.sports.getAllSports) || [];

  // Delete game mutation
  const deleteGame = useMutation(api.sports.deleteGame);

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let filtered = games.filter((game) => {
      const matchesSearch =
        game.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.venue?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSport = sportFilter === "all" || game.sport === sportFilter;
      const matchesStatus = statusFilter === "all" || game.status === statusFilter;

      return matchesSearch && matchesSport && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "game_date":
          aValue = new Date(a.game_date).getTime();
          bValue = new Date(b.game_date).getTime();
          break;
        case "homeTeam":
          aValue = a.homeTeam.name.toLowerCase();
          bValue = b.homeTeam.name.toLowerCase();
          break;
        case "awayTeam":
          aValue = a.awayTeam.name.toLowerCase();
          bValue = b.awayTeam.name.toLowerCase();
          break;
        case "sport":
          aValue = a.sport.toLowerCase();
          bValue = b.sport.toLowerCase();
          break;
        case "venue":
          aValue = (a.venue || "").toLowerCase();
          bValue = (b.venue || "").toLowerCase();
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          aValue = a.game_date;
          bValue = b.game_date;
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [games, searchTerm, sportFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortDirection === "asc" ?
      <ArrowUp className="w-4 h-4" /> :
      <ArrowDown className="w-4 h-4" />;
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

  const formatGameDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleDeleteGame = async (gameId: string) => {
    if (window.confirm("Are you sure you want to delete this game? This action cannot be undone.")) {
      try {
        await deleteGame({ gameId });
      } catch (error) {
        console.error("Error deleting game:", error);
        alert("Failed to delete game. Please try again.");
      }
    }
  };

  const canGoLive = (game: GameData) => {
    return game.status === "scheduled" && new Date(game.game_date) <= new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Games Schedule
        </CardTitle>
        <CardDescription>
          View and manage all scheduled games with filtering and sorting options
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-1 items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams or venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport._id} value={sport.name}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">Live</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("homeTeam")}
                  >
                    Game
                    {getSortIcon("homeTeam")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("sport")}
                  >
                    Sport
                    {getSortIcon("sport")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("game_date")}
                  >
                    Date & Time
                    {getSortIcon("game_date")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("venue")}
                  >
                    Venue
                    {getSortIcon("venue")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedGames.length > 0 ? (
                filteredAndSortedGames.map((game) => {
                  const { date, time } = formatGameDateTime(game.game_date);
                  return (
                    <TableRow key={game._id}>
                      <TableCell>
                        <div className="font-medium">
                          {game.awayTeam.name} @ {game.homeTeam.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{game.sport}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {date}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {game.venue ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {game.venue}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">TBD</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(game.status)}>
                          {game.status === "in_progress" ? "LIVE" : game.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canGoLive(game) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onGoLive?.(game._id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditGame?.(game._id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGame(game._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-8 h-8" />
                      <p>No games found matching your criteria</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        {filteredAndSortedGames.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedGames.length} of {games.length} games
          </div>
        )}
      </CardContent>
    </Card>
  );
}