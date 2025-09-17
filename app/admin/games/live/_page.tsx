"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Users, 
  Eye, 
  Play, 
  Square, 
  Volume2, 
  VideoIcon, 
  Settings,
  MoreVertical
} from "lucide-react";
import { useState, useEffect } from "react";

// Mock data for live games
const mockLiveGames = [
  {
    id: "1",
    homeTeam: "McLennan Community College",
    awayTeam: "Vernon College",
    homeScore: 2,
    awayScore: 1,
    sport: "Volleyball",
    status: "live",
    viewers: 1247,
    duration: "1:23:45",
    streamQuality: "1080p",
    chatActive: true
  },
  {
    id: "2", 
    homeTeam: "Temple College",
    awayTeam: "Cisco College", 
    homeScore: 0,
    awayScore: 3,
    sport: "Volleyball",
    status: "live",
    viewers: 892,
    duration: "0:45:12",
    streamQuality: "720p",
    chatActive: true
  }
];

export default function LiveGamesPage() {
  const [games, setGames] = useState(mockLiveGames);
  const [viewerCounts, setViewerCounts] = useState<{[key: string]: number}>({});

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCounts(prev => {
        const newCounts = {...prev};
        games.forEach(game => {
          newCounts[game.id] = game.viewers + Math.floor(Math.random() * 20) - 10;
        });
        return newCounts;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [games]);

  const updateScore = (gameId: string, team: 'home' | 'away', increment: number) => {
    setGames(prev => prev.map(game => {
      if (game.id === gameId) {
        const updated = {...game};
        if (team === 'home') {
          updated.homeScore = Math.max(0, updated.homeScore + increment);
        } else {
          updated.awayScore = Math.max(0, updated.awayScore + increment);
        }
        return updated;
      }
      return game;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Games Management</h1>
          <p className="text-muted-foreground">Monitor and control live game broadcasts</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="animate-pulse">
            <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
            {games.length} LIVE
          </Badge>
        </div>
      </div>

      {/* Live Games Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {games.map((game) => (
          <Card key={game.id} className="border-2 border-destructive/30 relative overflow-hidden">
            {/* Live Border Animation */}
            <div className="absolute inset-0 border-2 border-destructive animate-pulse pointer-events-none rounded-lg"></div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="destructive" className="font-mono text-xs">
                  🔴 LIVE
                </Badge>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm font-medium">
                    {viewerCounts[game.id] || game.viewers}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Game Info */}
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground font-medium">{game.sport}</div>
                <div className="text-sm text-muted-foreground">{game.duration}</div>
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-7 items-center gap-4 py-4">
                {/* Home Team */}
                <div className="col-span-3 text-center">
                  <div className="text-lg font-semibold mb-2">{game.homeTeam}</div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={() => updateScore(game.id, 'home', -1)}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <div className="text-4xl font-mono font-bold w-16 text-center">
                      {game.homeScore}
                    </div>
                    <Button
                      variant="outline"
                      size="sm" 
                      onClick={() => updateScore(game.id, 'home', 1)}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* VS */}
                <div className="col-span-1 text-center">
                  <div className="text-2xl font-bold text-muted-foreground">VS</div>
                </div>

                {/* Away Team */}
                <div className="col-span-3 text-center">
                  <div className="text-lg font-semibold mb-2">{game.awayTeam}</div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateScore(game.id, 'away', -1)}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <div className="text-4xl font-mono font-bold w-16 text-center">
                      {game.awayScore}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateScore(game.id, 'away', 1)} 
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stream Info */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <VideoIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{game.streamQuality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Chat {game.chatActive ? 'Active' : 'Disabled'}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-3 gap-2">
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  End Stream
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MoreVertical className="w-4 h-4" />
                  More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Live Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-destructive" />
            Global Live Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="destructive" className="flex items-center gap-2">
              <Square className="w-4 h-4" />
              Emergency Stop All
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Stream Settings
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Moderate Chat
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}