"use client";

import React from "react";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import Image from "next/image";

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export function GamesCarouselSection() {
  const gamesData = useQuery(api.sports.getAllGames);

  const cards = React.useMemo(() => {
    if (!gamesData) return [];

    return gamesData.map((game, index) => {
      const gameDate = new Date(game.game_date);
      const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      const formatDate = (date: Date) => {
        return date.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      };

      const getStatusColor = (status: string) => {
        switch (status) {
          case "in_progress":
            return "bg-red-500 text-white";
          case "scheduled":
            return "bg-blue-500 text-white";
          case "final":
            return "bg-green-500 text-white";
          case "postponed":
            return "bg-yellow-500 text-white";
          default:
            return "bg-gray-500 text-white";
        }
      };

      const getStatusText = (status: string) => {
        switch (status) {
          case "in_progress":
            return "LIVE";
          case "scheduled":
            return "UPCOMING";
          case "final":
            return "FINAL";
          case "postponed":
            return "POSTPONED";
          default:
            return status.toUpperCase();
        }
      };

      return {
        src: `https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80`,
        title: `${game.awayTeam.name} vs ${game.homeTeam.name}`,
        category: game.sport,
        content: (
          <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
            <div className="flex flex-col space-y-6">
              {/* Game Status */}
              <div className="flex justify-between items-start">
                <Badge
                  className={`${getStatusColor(game.status)} font-semibold px-3 py-1`}
                >
                  {getStatusText(game.status)}
                </Badge>
                <div className="text-right">
                  <div className="flex items-center text-neutral-700 dark:text-neutral-300 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(gameDate)}
                  </div>
                  <div className="flex items-center text-neutral-700 dark:text-neutral-300 text-sm mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(gameDate)}
                  </div>
                </div>
              </div>

              {/* Teams Display */}
              <div className="flex items-center justify-between">
                {/* Away Team */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {game.awayTeam.name}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {game.awayTeam.city}, {game.awayTeam.state}
                    </div>
                  </div>
                  {game.awayScore !== undefined && (
                    <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                      {game.awayScore}
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="text-xl font-bold text-neutral-600 dark:text-neutral-400 mx-4">
                  VS
                </div>

                {/* Home Team */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {game.homeTeam.name}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {game.homeTeam.city}, {game.homeTeam.state}
                    </div>
                  </div>
                  {game.homeScore !== undefined && (
                    <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                      {game.homeScore}
                    </div>
                  )}
                </div>
              </div>

              {/* Venue */}
              {game.venue && (
                <div className="flex items-center justify-center text-neutral-600 dark:text-neutral-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {game.venue}
                </div>
              )}

              {/* Description */}
              {game.description && (
                <div className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {game.description}
                </div>
              )}

              {/* League Info */}
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className="bg-white dark:bg-neutral-700"
                >
                  {game.homeTeam.league}
                </Badge>
              </div>
            </div>
          </div>
        ),
      };
    });
  }, [gamesData]);

  if (!gamesData || gamesData.length === 0) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              No Games Available
            </h2>
            <p className="text-neutral-400">
              Check back later for upcoming games and matches.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    // <div className="w-full py-20">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-8">
    //       Live Games & Matches
    //     </h2>
    //     <Carousel items={cards.map((card, index) => (
    //       <div key={`card-${index}`} className="card h-96 md:h-[40rem] rounded-3xl bg-gray-100 dark:bg-neutral-900 w-56 md:w-96 overflow-hidden flex flex-col relative">
    //         <div className="absolute inset-0">
    //           <Image
    //             src={card.src}
    //             alt={card.title}
    //             fill
    //             className="object-cover"
    //           />
    //           <div className="absolute inset-0 bg-black/40" />
    //         </div>
    //         <div className="relative z-10 p-6 flex flex-col justify-end h-full">
    //           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
    //             <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
    //             <Badge className="bg-white/20 text-white border-white/30">
    //               {card.category}
    //             </Badge>
    //           </div>
    //         </div>
    //       </div>
    //     ))} />
    //   </div>
    // </div>
    <></>
  );
}
