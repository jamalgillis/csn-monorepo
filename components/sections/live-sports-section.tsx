"use client"

import { SportsCarousel } from "@/components/carousel/sports-carousel"
import { StaggerAnimation } from "@/components/interactive/stagger-animation"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export function LiveSportsSection() {
  const todaysGames = useQuery(api.sports.getAllScheduledAndLiveGames)

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
    const gameDate = new Date(game.game_date);
    const gameTime = gameDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    
    if (game.status === "in_progress") {
      badge = { text: "LIVE", variant: "live" as const };
      subtitle = game.gameState ? `${game.gameState.quarter} - ${game.gameState.timeLeft}` : "Live";
    } else if (game.status === "scheduled") {
      badge = { text: "SCHEDULED", variant: "scheduled" as const };
      subtitle = `${gameTime} at ${game.venue}`;
    } else if (game.status === "final") {
      badge = { text: "FINAL", variant: "final" as const };
      subtitle = `Final Score - ${game.sport}`;
    } else {
      badge = { text: "UPCOMING", variant: "scheduled" as const };
      subtitle = `${gameTime} - ${game.sport}`;
    }

    // Determine image based on sport and teams
    let gameImage = "/placeholder.svg"; // Default fallback
    let homeTeamLogo = "/placeholder.svg";
    let awayTeamLogo = "/placeholder.svg";

    // Sport-specific default images
    if (game.sport === "Volleyball") {
      gameImage = "/basketball-game-winner.png"; // Generic sports action image
    } else if (game.sport === "Basketball") {
      gameImage = "/basketball-player-shooting.png";
    } else {
      gameImage = "/generic-sports-broadcast.png";
    }

    // Team-specific logos and images
    const homeTeamName = game.homeTeam?.name || "";
    const awayTeamName = game.awayTeam?.name || "";
    
    // For McLennan Community College games, use college sports themed image
    if (homeTeamName.includes("McLennan") || awayTeamName.includes("McLennan")) {
      gameImage = "/college-basketball-prospects.png";
    }

    return {
      id: game.id,
      title: `${game.awayTeam?.name || game.awayTeam} vs ${game.homeTeam?.name || game.homeTeam}`,
      subtitle,
      image: gameImage,
      badge,
      viewers: game.status === "in_progress" ? "Live" : undefined,
      score: (game.status === "in_progress" || game.status === "final") ? `${game.awayScore} - ${game.homeScore}` : undefined,
      venue: game.venue,
      gameTime: gameTime,
      sport: game.sport,
      // Enhanced sports-specific fields
      awayTeam: game.awayTeam?.name || game.awayTeam,
      homeTeam: game.homeTeam?.name || game.homeTeam,
      awayScore: (game.status === "in_progress" || game.status === "final") ? game.awayScore : undefined,
      homeScore: (game.status === "in_progress" || game.status === "final") ? game.homeScore : undefined,
      awayTeamLogo: awayTeamLogo,
      homeTeamLogo: homeTeamLogo,
      date: game.game_date,
      time: gameTime,
      league: "NJCAA", // Default league for community college
      network: "CSN", // Centex Sports Network
      status: game.status,
    };
  });

  // Determine title based on what games we have
  const hasLiveGames = todaysGames.some((game: any) => game.status === "in_progress");
  const title = hasLiveGames ? "Live & Scheduled Games" : "Scheduled Games";
  
  return (
    <StaggerAnimation delay={100}>
      <SportsCarousel
        title={title}
        items={transformedGames}
        icon={<div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />}
        routePrefix="/games" // Ensure games route to /games/[gameId]
      />
    </StaggerAnimation>
  )
}
