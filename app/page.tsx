import { Header } from "@/components/navigation/header";
import { HeroCarousel } from "@/components/hero/hero-carousel";
import { LiveSportsSection } from "@/components/sections/live-sports-section";
import { SportsShowsSection } from "@/components/sections/sports-shows-section";
import { GameHighlightsSection } from "@/components/sections/game-highlights-section";
import { FullGamesSection } from "@/components/sections/full-games-section";
import { GamesCarouselSection } from "@/components/sections/games-carousel-section";
import { SportsNewsSection } from "@/components/sections/sports-news-section";
import { BreakingNewsTicker } from "@/components/interactive/breaking-news-ticker";
import { StaggerAnimation } from "@/components/interactive/stagger-animation";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import {
  Play,
  Tv,
  Newspaper,
  Users,
  Trophy,
  Calendar,
  Activity,
  Video,
  BarChart3,
  Search,
  User,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="hidden">
        <BreakingNewsTicker />
      </div>
      <HeroCarousel />
      <main className="relative z-10 -mt-16 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {false && (
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Explore Platform Features
                </h2>
                <p className="text-muted-foreground">
                  Navigate through different sections of the sports streaming
                  platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Live Content */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Live Content
                  </h3>
                  <Link
                    href="/games/lakers-vs-warriors"
                    className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-primary">
                          Live Game
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Lakers vs Warriors
                        </div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </Link>
                  <Link
                    href="/games"
                    className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-primary">
                          All Games
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Browse Catalog
                        </div>
                      </div>
                    </div>
                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* Shows & Content */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Shows & Content
                  </h3>
                  <Link
                    href="/shows/sportscenter"
                    className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-lg hover:bg-secondary/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <Tv className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium text-secondary">
                          Sports Show
                        </div>
                        <div className="text-sm text-muted-foreground">
                          SportsCenter
                        </div>
                      </div>
                    </div>
                    <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                  <Link
                    href="/shows"
                    className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-lg hover:bg-secondary/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <Tv className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium text-secondary">
                          All Shows
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Browse Catalog
                        </div>
                      </div>
                    </div>
                    <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* News & Articles */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    News & Articles
                  </h3>
                  <Link
                    href="/news/lakers-blockbuster-trade"
                    className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Newspaper className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium text-accent">
                          Breaking News
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Lakers Trade Rumors
                        </div>
                      </div>
                    </div>
                    <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                  <Link
                    href="/news"
                    className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Newspaper className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium text-accent">All News</div>
                        <div className="text-sm text-muted-foreground">
                          Browse Articles
                        </div>
                      </div>
                    </div>
                    <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* Team Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Team Information
                  </h3>
                  <Link
                    href="/teams/lakers"
                    className="flex items-center justify-between p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg hover:bg-chart-4/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-chart-4/20 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-chart-4" />
                      </div>
                      <div>
                        <div className="font-medium text-chart-4">
                          Team Profile
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Lakers Overview
                        </div>
                      </div>
                    </div>
                    <div className="text-chart-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* League Data */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    League Data
                  </h3>
                  <Link
                    href="/standings"
                    className="flex items-center justify-between p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg hover:bg-chart-2/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-chart-2/20 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-chart-2" />
                      </div>
                      <div>
                        <div className="font-medium text-chart-2">
                          Standings
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current Rankings
                        </div>
                      </div>
                    </div>
                    <div className="text-chart-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* Schedule */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Schedule
                  </h3>
                  <Link
                    href="/schedule"
                    className="flex items-center justify-between p-4 bg-chart-3/10 border border-chart-3/20 rounded-lg hover:bg-chart-3/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-chart-3/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-chart-3" />
                      </div>
                      <div>
                        <div className="font-medium text-chart-3">
                          Game Schedule
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Upcoming Games
                        </div>
                      </div>
                    </div>
                    <div className="text-chart-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* Live Scores */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Live Scores
                  </h3>
                  <Link
                    href="/scores"
                    className="flex items-center justify-between p-4 bg-chart-1/10 border border-chart-1/20 rounded-lg hover:bg-chart-1/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-chart-1/20 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-chart-1" />
                      </div>
                      <div>
                        <div className="font-medium text-chart-1">
                          Live Scores
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Real-time Updates
                        </div>
                      </div>
                    </div>
                    <div className="text-chart-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* Sports Highlights */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Highlights
                  </h3>
                  <Link
                    href="/highlights"
                    className="flex items-center justify-between p-4 bg-chart-5/10 border border-chart-5/20 rounded-lg hover:bg-chart-5/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-chart-5/20 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-chart-5" />
                      </div>
                      <div>
                        <div className="font-medium text-chart-5">
                          Sports Highlights
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Best Moments
                        </div>
                      </div>
                    </div>
                    <div className="text-chart-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* Statistics */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Analytics
                  </h3>
                  <Link
                    href="/stats"
                    className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-purple-400">
                          Statistics Hub
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Advanced Analytics
                        </div>
                      </div>
                    </div>
                    <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* Search Results Navigation Card */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Search
                  </h3>
                  <Link
                    href="/search"
                    className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-medium text-emerald-400">
                          Search Results
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Find Content
                        </div>
                      </div>
                    </div>
                    <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>

                {/* User Dashboard Navigation Card */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Personal
                  </h3>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <div className="font-medium text-orange-400">
                          User Dashboard
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Personal Hub
                        </div>
                      </div>
                    </div>
                    <div className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <LiveSportsSection />
          <StaggerAnimation delay={150}>
            <GamesCarouselSection />
          </StaggerAnimation>
          <StaggerAnimation delay={200}>
            <SportsShowsSection />
          </StaggerAnimation>
          <StaggerAnimation delay={300} className="hidden">
            <SportsNewsSection />
          </StaggerAnimation>
          <StaggerAnimation delay={400} className="hidden">
            <GameHighlightsSection />
          </StaggerAnimation>
          <StaggerAnimation delay={500} className="hidden">
            <FullGamesSection />
          </StaggerAnimation>
        </div>
      </main>
      <Footer />
    </div>
  );
}
