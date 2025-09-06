import { Header } from "@/components/navigation/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Trophy, TrendingUp, Users, Star, Share2, Bell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function TeamProfilePage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params
  // Mock team data - in real app this would come from API
  const teamData = {
    id: "lakers",
    name: "Los Angeles Lakers",
    city: "Los Angeles",
    conference: "Western Conference",
    division: "Pacific Division",
    logo: "/lakers-logo.png",
    record: { wins: 28, losses: 15 },
    streak: "W3",
    nextGame: {
      opponent: "Golden State Warriors",
      date: "2024-02-15",
      time: "7:30 PM PT",
      location: "Crypto.com Arena",
    },
    stats: {
      ppg: 118.2,
      rpg: 45.1,
      apg: 28.7,
      fgPct: 48.5,
    },
    roster: [
      { name: "LeBron James", position: "SF", number: "23", ppg: 25.2, rpg: 7.8, apg: 8.1 },
      { name: "Anthony Davis", position: "PF/C", number: "3", ppg: 24.1, rpg: 12.1, apg: 3.2 },
      { name: "Russell Westbrook", position: "PG", number: "0", ppg: 18.5, rpg: 7.4, apg: 7.1 },
      { name: "Austin Reaves", position: "SG", number: "15", ppg: 15.1, rpg: 4.3, apg: 5.5 },
      { name: "D'Angelo Russell", position: "PG", number: "1", ppg: 17.8, rpg: 3.1, apg: 6.2 },
    ],
    recentGames: [
      { opponent: "Boston Celtics", result: "W", score: "114-105", date: "Feb 10" },
      { opponent: "Phoenix Suns", result: "W", score: "123-116", date: "Feb 8" },
      { opponent: "Denver Nuggets", result: "W", score: "108-102", date: "Feb 6" },
      { opponent: "Miami Heat", result: "L", score: "98-108", date: "Feb 4" },
    ],
    news: [
      {
        title: "Lakers Extend Winning Streak to Three Games",
        excerpt: "Strong performances from LeBron and AD lead Lakers past Celtics",
        time: "2 hours ago",
      },
      {
        title: "Trade Deadline Approaches: Lakers Eyeing Depth",
        excerpt: "Front office reportedly exploring options to bolster bench",
        time: "1 day ago",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Team Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/20 to-secondary/20 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-card rounded-full flex items-center justify-center border-4 border-primary">
                <Image
                  src="/lakers-logo-purple-and-gold.png"
                  alt={`${teamData.name} logo`}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{teamData.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {teamData.city}
                    </span>
                    <span>{teamData.conference}</span>
                    <span>{teamData.division}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Team Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card className="sports-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {teamData.record.wins}-{teamData.record.losses}
                    </div>
                    <div className="text-sm text-muted-foreground">Record</div>
                  </CardContent>
                </Card>
                <Card className="sports-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">{teamData.streak}</div>
                    <div className="text-sm text-muted-foreground">Streak</div>
                  </CardContent>
                </Card>
                <Card className="sports-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">{teamData.stats.ppg}</div>
                    <div className="text-sm text-muted-foreground">PPG</div>
                  </CardContent>
                </Card>
                <Card className="sports-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-chart-4">{teamData.stats.fgPct}%</div>
                    <div className="text-sm text-muted-foreground">FG%</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="roster" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="roster">Roster</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="roster" className="space-y-4">
                <div className="grid gap-4">
                  {teamData.roster.map((player, index) => (
                    <Card key={index} className="sports-card hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                              #{player.number}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{player.name}</h3>
                              <p className="text-sm text-muted-foreground">{player.position}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="font-semibold text-accent">{player.ppg}</div>
                              <div className="text-xs text-muted-foreground">PPG</div>
                            </div>
                            <div>
                              <div className="font-semibold text-secondary">{player.rpg}</div>
                              <div className="text-xs text-muted-foreground">RPG</div>
                            </div>
                            <div>
                              <div className="font-semibold text-chart-4">{player.apg}</div>
                              <div className="text-xs text-muted-foreground">APG</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <Card className="sports-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Next Game
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">vs {teamData.nextGame.opponent}</span>
                        <Badge className="live-indicator">UPCOMING</Badge>
                      </div>
                      <div className="text-muted-foreground">
                        <p>
                          {teamData.nextGame.date} at {teamData.nextGame.time}
                        </p>
                        <p className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {teamData.nextGame.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="sports-card">
                  <CardHeader>
                    <CardTitle>Recent Games</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamData.recentGames.map((game, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={game.result === "W" ? "default" : "destructive"}
                              className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                              {game.result}
                            </Badge>
                            <span>vs {game.opponent}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{game.score}</div>
                            <div className="text-xs text-muted-foreground">{game.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <Card className="sports-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Team Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Points Per Game</span>
                          <span className="text-sm font-semibold">{teamData.stats.ppg}</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Rebounds Per Game</span>
                          <span className="text-sm font-semibold">{teamData.stats.rpg}</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Assists Per Game</span>
                          <span className="text-sm font-semibold">{teamData.stats.apg}</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Field Goal %</span>
                          <span className="text-sm font-semibold">{teamData.stats.fgPct}%</span>
                        </div>
                        <Progress value={teamData.stats.fgPct} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                {teamData.news.map((article, index) => (
                  <Card key={index} className="sports-card hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{article.excerpt}</p>
                      <p className="text-xs text-muted-foreground">{article.time}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sports-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Season Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-sm">7th in Western Conference</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-chart-4" />
                  <span className="text-sm">3-game winning streak</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-sm">Top 5 in assists</span>
                </div>
              </CardContent>
            </Card>

            <Card className="sports-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/games/lakers-vs-warriors" className="block">
                  <Button className="w-full bg-transparent" variant="outline">
                    Watch Live Game
                  </Button>
                </Link>
                <Button className="w-full bg-transparent" variant="outline">
                  View Full Schedule
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Team Store
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
