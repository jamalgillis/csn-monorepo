"use client";

import type React from "react";
import Image from "next/image";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Play,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: {
    text: string;
    variant: "live" | "scheduled" | "final" | "new" | "available";
  };
  viewers?: string;
  duration?: string;
  // Enhanced sports-specific fields
  awayTeam?: string;
  homeTeam?: string;
  awayScore?: number;
  homeScore?: number;
  awayTeamLogo?: string;
  homeTeamLogo?: string;
  date?: string;
  time?: string;
  sport?: string;
  venue?: string;
  league?: string;
  network?: string;
  status?: string;
}

interface SportsCarouselProps {
  title: string;
  items: CarouselItem[];
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SportsCarousel({
  title,
  items,
  icon,
  className,
  style,
}: SportsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <Badge variant="destructive" className="bg-red-600 text-white">
            LIVE
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-600 text-white">
            SCHEDULED
          </Badge>
        );
      case "final":
        return (
          <Badge variant="secondary" className="bg-green-600 text-white">
            FINAL
          </Badge>
        );
      case "new":
        return (
          <Badge variant="secondary" className="bg-blue-600 text-white">
            NEW
          </Badge>
        );
      case "available":
        return (
          <Badge variant="secondary" className="bg-gray-600 text-white">
            AVAILABLE
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-600 text-white">
            UPCOMING
          </Badge>
        );
    }
  };

  const handleItemClick = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  return (
    <section className={cn("stagger-animation", className)} style={style}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          {icon}
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll("left")}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll("right")}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            See All
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex space-x-4 pb-4">
          {items.map((item) => (
            <div key={item.id} className="flex-none w-80">
              <Card
                className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border-border cursor-pointer"
                onClick={() => handleItemClick(item.id)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      {item.badge && getStatusBadge(item.badge.variant)}
                    </div>
                    {item.badge?.variant === "live" && item.viewers && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        <Users className="w-3 h-3" />
                        {item.viewers}
                      </div>
                    )}
                    {item.badge?.variant !== "live" && (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {item.awayTeam && item.homeTeam ? (
                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex items-center gap-2">
                          <Image
                            src={item.awayTeamLogo || "/placeholder.svg"}
                            alt={item.awayTeam}
                            width={24}
                            height={24}
                          />
                          <span className="font-semibold">
                            {typeof item.awayTeam === 'string' ? item.awayTeam.split(" ")[0] : item.awayTeam}
                          </span>
                          {item.awayScore !== undefined && (
                            <span className="text-lg font-bold text-primary">
                              {item.awayScore}
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground text-sm">@</span>
                        <div className="flex items-center gap-2">
                          {item.homeScore !== undefined && (
                            <span className="text-lg font-bold text-primary">
                              {item.homeScore}
                            </span>
                          )}
                          <span className="font-semibold">
                            {typeof item.homeTeam === 'string' ? item.homeTeam.split(" ")[0] : item.homeTeam}
                          </span>
                          <Image
                            src={item.homeTeamLogo || "/placeholder.svg"}
                            alt={item.homeTeam}
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                    ) : (
                      <h3 className="font-semibold mb-1 text-white">
                        {item.title}
                      </h3>
                    )}

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {item.league && item.sport && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {item.league}
                          </span>
                          <span>{item.sport}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        {item.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        )}
                        {item.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {item.venue && <span>{item.venue}</span>}
                        {item.network && (
                          <Badge variant="outline" className="text-xs">
                            {item.network}
                          </Badge>
                        )}
                      </div>
                      {!item.awayTeam && (
                        <p className="text-muted-foreground text-sm">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
