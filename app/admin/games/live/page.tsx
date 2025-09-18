"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Radio, 
  Users, 
  Eye, 
  Square, 
  Volume2, 
  VideoIcon, 
  Settings,
  MoreVertical,
  Activity,
  Download,
  Tv
} from "lucide-react";
import { useState, useEffect } from "react";

// Mock live games data matching superdesign mockup
const mockLiveGames = [
  {
    id: "1",
    homeTeam: "McLennan Community College",
    awayTeam: "Vernon College", 
    homeScore: 21,
    awayScore: 18,
    setScore: "2-1",
    sport: "NJCAA Volleyball",
    venue: "McLennan Gymnasium",
    duration: "Set 3 • 15:42",
    viewers: 1247,
    streamQuality: "1080p",
    chatActive: true,
    status: "live"
  },
  {
    id: "2",
    homeTeam: "Temple College", 
    awayTeam: "Cisco College",
    homeScore: 15,
    awayScore: 20,
    setScore: "1-2", 
    sport: "NJCAA Volleyball",
    venue: "Temple College Gymnasium",
    duration: "Set 3 • 08:23",
    viewers: 892,
    streamQuality: "720p", 
    chatActive: true,
    status: "live"
  },
  {
    id: "3",
    homeTeam: "Hill College",
    awayTeam: "Navarro College",
    homeScore: 25,
    awayScore: 23,
    setScore: "2-0",
    sport: "NJCAA Volleyball", 
    venue: "Hill College Gymnasium",
    duration: "Set 3 • 22:15",
    viewers: 654,
    streamQuality: "1080p",
    chatActive: true,
    status: "live"
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

  const totalViewers = games.reduce((total, game) => total + (viewerCounts[game.id] || game.viewers), 0);

  return (
    <div className="space-y-8">
      {/* Header Section matching mockup */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Live Games Control Center</h2>
          <p className="text-muted-foreground">Monitor and control live games in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{games.length} Games Live</span>
          </div>
          <div className="text-sm font-medium">
            <Eye className="w-4 h-4 inline mr-1" />
            <span>{totalViewers.toLocaleString()}</span> watching
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Tv className="w-4 h-4 mr-2" />
            Stream Monitor
          </Button>
        </div>
      </div>

      {/* Live Games Grid matching mockup layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-8">
        {games.map((game) => (
          <Card key={game.id} className="border-2 border-destructive/30 relative overflow-hidden">
            {/* Live border animation from mockup */}
            <div className="absolute inset-0 border-2 border-destructive animate-pulse pointer-events-none rounded-lg"></div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                  <Badge variant="destructive" className="font-mono text-xs animate-pulse">
                    LIVE
                  </Badge>
                  <span className="text-xs text-muted-foreground">{game.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Stream quality indicator */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-1 h-3 rounded-sm ${
                          i < (game.streamQuality === "1080p" ? 5 : 3) 
                            ? "bg-green-500" 
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-green-500">{game.streamQuality}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Game Info */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">{game.homeTeam} vs {game.awayTeam}</h3>
                <p className="text-sm text-muted-foreground">{game.sport} • {game.venue}</p>
              </div>

              {/* Score Display matching mockup */}
              <div className="grid grid-cols-3 items-center gap-4">
                {/* Home Team */}
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {game.homeTeam.split(' ')[0]}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={() => updateScore(game.id, 'home', -1)}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <div className="text-4xl font-mono font-bold w-16 text-center text-primary">
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

                {/* Sets Score */}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">Sets</div>
                  <div className="text-2xl font-bold">{game.setScore}</div>
                </div>

                {/* Away Team */}
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {game.awayTeam.split(' ')[0]}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateScore(game.id, 'away', -1)}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <div className="text-4xl font-mono font-bold w-16 text-center text-secondary">
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
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {(viewerCounts[game.id] || game.viewers).toLocaleString()}
                  </span>
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