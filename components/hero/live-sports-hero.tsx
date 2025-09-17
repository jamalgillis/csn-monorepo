"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Play, Volume2, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

interface HeroContent {
  id: string;
  type: "live_game" | "live_show" | "scheduled_game";
  title: string;
  subtitle: string;
  thumbnail: string;
  isLive: boolean;
  navigationUrl: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  sport?: string;
  quarter?: string;
  timeLeft?: string;
  gameTime?: string;
  venue?: string;
  showTitle?: string;
  host?: string;
  description?: string;
  videoUrl?: string;
}

export function LiveSportsHero() {
  const router = useRouter();
  const heroContent = useQuery(api.sports.getHeroContent);

  const handleHeroClick = () => {
    if (heroContent?.navigationUrl) {
      router.push(heroContent.navigationUrl);
    }
  };

  if (!heroContent) {
    return null;
  }

  const getBannerConfig = () => {
    switch (heroContent.type) {
      case "live_game":
        return {
          bgColor: "bg-red-600",
          indicator: "bg-green-500",
          text: `LIVE: ${heroContent.sport} ${heroContent.awayTeam} vs ${heroContent.homeTeam} - ${heroContent.quarter} ${heroContent.timeLeft}`,
          rightText: `${heroContent.homeTeam} ${heroContent.homeScore} - ${heroContent.awayScore} ${heroContent.awayTeam}`,
        };
      case "live_show":
        return {
          bgColor: "bg-blue-600",
          indicator: "bg-blue-500",
          text: `LIVE SHOW: ${heroContent.showTitle} - ${heroContent.host}`,
          rightText:
            heroContent.description?.substring(0, 50) + "..." || "Live Now",
        };
      case "scheduled_game":
        return {
          bgColor: "bg-gray-600",
          indicator: "bg-gray-500",
          text: `UPCOMING: ${heroContent.sport} ${heroContent.awayTeam} vs ${heroContent.homeTeam} - ${heroContent.gameTime}`,
          rightText: `${heroContent.venue}`,
        };
      default:
        return {
          bgColor: "bg-gray-600",
          indicator: "bg-gray-500",
          text: "CSN Sports",
          rightText: "Live Content",
        };
    }
  };

  const bannerConfig = getBannerConfig();

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 ${bannerConfig.bgColor} text-white py-2 px-4 z-20 hover:opacity-90 transition-opacity`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 ${bannerConfig.indicator} rounded-full animate-pulse shadow-lg`}
            />
            <span className="font-semibold">{bannerConfig.text}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-bold text-white">
              {bannerConfig.rightText}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs transition-colors text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {heroContent.type === "live_show" ? "Join" : "Chat"}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Video Player */}
      <div className="absolute inset-0 pt-12 group">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Team Image */}
          <img
            src={heroContent.thumbnail || "/placeholder-game.jpg"}
            alt={heroContent.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
          />

          {/* Clickable Overlay */}
          <div
            className="absolute inset-0 bg-transparent cursor-pointer z-10"
            onClick={handleHeroClick}
          />

          {/* Video Overlay Content - Hidden */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden">
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-6 transition-all duration-300 hover:scale-110 pointer-events-auto"
                onClick={handleHeroClick}
              >
                <Play className="w-8 h-8 text-white fill-white" />
              </Button>
            </div>
          </div>

          {/* Video Controls Overlay - Hidden */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <Play className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
                <span className="text-white text-sm font-medium">
                  {heroContent.type === "live_show"
                    ? heroContent.showTitle
                    : heroContent.type === "scheduled_game"
                      ? `${heroContent.awayTeam} @ ${heroContent.homeTeam} - Upcoming`
                      : `${heroContent.homeTeam} @ ${heroContent.awayTeam} - Live`}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors text-white"
                >
                  <Maximize className="w-4 h-4 mr-1" />
                  Fullscreen
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors text-white"
                >
                  Quality: HD
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div className="bg-red-600 h-1 rounded-full w-3/4 transition-all duration-300" />
              </div>
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>
                  {heroContent.type === "live_show"
                    ? "0:45:12"
                    : heroContent.type === "scheduled_game"
                      ? "0:00:00"
                      : "2:15:30"}
                </span>
                <span>
                  {heroContent.type === "live_show"
                    ? "Live Show"
                    : heroContent.type === "scheduled_game"
                      ? "Upcoming"
                      : "Live"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
