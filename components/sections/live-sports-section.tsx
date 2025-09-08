"use client"

import { SportsCarousel } from "@/components/carousel/sports-carousel"
import { StaggerAnimation } from "@/components/interactive/stagger-animation"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export function LiveSportsSection() {
  const todaysGames = useQuery(api.sports.getLiveGames)

  if (!todaysGames) {
    return (
      <StaggerAnimation delay={100}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
            Today's Games
          </h2>
        </div>
        <div className="flex space-x-4 pb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-none w-80 h-48 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </StaggerAnimation>
    )
  }

  const transformedGames = todaysGames.map((game: any) => {
    // Determine badge based on game status
    let badge;
    let subtitle;
    
    if (game.isLive) {
      badge = { text: "LIVE", variant: "live" as const };
      subtitle = `${game.quarter} Quarter - ${game.timeLeft} left`;
    } else if (game.isScheduled) {
      badge = { text: "SCHEDULED", variant: "scheduled" as const };
      subtitle = `${game.gameTime} at ${game.venue}`;
    } else if (game.isFinal) {
      badge = { text: "FINAL", variant: "final" as const };
      subtitle = `Final Score - ${game.sport}`;
    } else {
      badge = { text: "UPCOMING", variant: "scheduled" as const };
      subtitle = `${game.gameTime} - ${game.sport}`;
    }

    return {
      id: game.id,
      title: `${game.awayTeam?.name || game.awayTeam} vs ${game.homeTeam?.name || game.homeTeam}`,
      subtitle,
      image: game.thumbnail,
      badge,
      viewers: game.isLive ? `${(game.viewers / 1000).toFixed(1)}K viewers` : undefined,
      score: (game.isLive || game.isFinal) ? `${game.awayScore} - ${game.homeScore}` : undefined,
      venue: game.venue,
      gameTime: game.gameTime,
      sport: game.sport,
      // Enhanced sports-specific fields
      awayTeam: game.awayTeam?.name || game.awayTeam,
      homeTeam: game.homeTeam?.name || game.homeTeam,
      awayScore: (game.isLive || game.isFinal) ? game.awayScore : undefined,
      homeScore: (game.isLive || game.isFinal) ? game.homeScore : undefined,
      awayTeamLogo: "/placeholder.svg", // Placeholder for now
      homeTeamLogo: "/placeholder.svg", // Placeholder for now
      date: game.gameDate,
      time: game.gameTime,
      league: "Community College", // Default league
      network: undefined, // Not available yet
      status: game.status,
    };
  });

  // Determine title based on what games we have
  const hasLiveGames = todaysGames.some((game: any) => game.isLive);
  const title = hasLiveGames ? "Live Sports" : "Today's Games";
  
  return (
    <StaggerAnimation delay={100}>
      <SportsCarousel
        title={title}
        items={transformedGames}
        icon={<div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />}
      />
    </StaggerAnimation>
  )
}
