"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { ChevronLeft, ChevronRight, Play, Volume2, Maximize, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "../../convex/_generated/api"

interface CarouselItem {
  id: string
  type: "live_game" | "live_show" | "scheduled_game" | "featured_content" | "upcoming_game"
  priority: number
  title: string
  subtitle: string
  thumbnail: string
  isLive: boolean
  navigationUrl: string
  homeTeam?: string
  awayTeam?: string
  homeScore?: number
  awayScore?: number
  sport?: string
  quarter?: string
  timeLeft?: string
  gameTime?: string
  venue?: string
  showTitle?: string
  host?: string
  description?: string
  videoUrl?: string
}

export function HeroCarousel() {
  const router = useRouter()
  const carouselData = useQuery(api.sports.getHeroCarouselContent)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-rotation logic
  useEffect(() => {
    if (!isAutoPlaying || isPaused || !carouselData?.items.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev === carouselData.items.length - 1 ? 0 : prev + 1
      )
    }, 8000) // 8 seconds per slide

    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused, carouselData?.items.length])

  const nextSlide = useCallback(() => {
    if (!carouselData?.items.length) return
    setCurrentIndex((prev) => 
      prev === carouselData.items.length - 1 ? 0 : prev + 1
    )
  }, [carouselData?.items.length])

  const prevSlide = useCallback(() => {
    if (!carouselData?.items.length) return
    setCurrentIndex((prev) => 
      prev === 0 ? carouselData.items.length - 1 : prev - 1
    )
  }, [carouselData?.items.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsPaused(true) // Pause auto-rotation when user manually navigates
    setTimeout(() => setIsPaused(false), 15000) // Resume after 15 seconds
  }, [])

  const handleHeroClick = (item: CarouselItem) => {
    if (item.navigationUrl) {
      router.push(item.navigationUrl)
    }
  }

  const getBannerConfig = (item: CarouselItem) => {
    switch (item.type) {
      case "live_game":
        return {
          bgColor: "bg-red-600",
          indicator: "bg-green-500",
          text: `LIVE: ${item.sport} ${item.awayTeam} vs ${item.homeTeam} - ${item.quarter} ${item.timeLeft}`,
          rightText: `${item.homeTeam} ${item.homeScore} - ${item.awayScore} ${item.awayTeam}`
        }
      case "live_show":
        return {
          bgColor: "bg-blue-600", 
          indicator: "bg-blue-500",
          text: `${item.isLive ? 'LIVE SHOW' : 'FEATURED'}: ${item.showTitle} - ${item.host}`,
          rightText: item.description?.substring(0, 50) + "..." || "Featured Show"
        }
      case "scheduled_game":
        return {
          bgColor: "bg-yellow-600",
          indicator: "bg-yellow-500",
          text: `TODAY: ${item.sport} ${item.awayTeam} vs ${item.homeTeam} - ${item.gameTime}`,
          rightText: `${item.venue}`
        }
      case "upcoming_game":
        return {
          bgColor: "bg-gray-600",
          indicator: "bg-gray-500",
          text: `UPCOMING: ${item.sport} ${item.awayTeam} vs ${item.homeTeam} - ${item.gameTime}`,
          rightText: `${item.venue}`
        }
      case "featured_content":
        return {
          bgColor: "bg-purple-600",
          indicator: "bg-purple-500",
          text: `FEATURED: ${item.title}`,
          rightText: item.subtitle
        }
      default:
        return {
          bgColor: "bg-gray-600",
          indicator: "bg-gray-500", 
          text: "CSN Sports",
          rightText: "Live Content"
        }
    }
  }

  if (!carouselData?.items.length) {
    return null
  }

  const currentItem = carouselData.items[currentIndex]
  const bannerConfig = getBannerConfig(currentItem)

  return (
    <section className="relative h-screen overflow-hidden group">
      {/* Top Banner */}
      <div className={`absolute top-0 left-0 right-0 ${bannerConfig.bgColor} text-white py-2 px-4 z-20 hover:opacity-90 transition-opacity`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 ${bannerConfig.indicator} rounded-full animate-pulse shadow-lg`} />
            <span className="font-semibold">
              {bannerConfig.text}
            </span>
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
              {currentItem.type === "live_show" ? "Join" : "Chat"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Carousel Content */}
      <div className="absolute inset-0 pt-12">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Background Image */}
          <img 
            src={currentItem.thumbnail || "/placeholder-game.jpg"} 
            alt={currentItem.title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500" 
          />

          {/* Clickable Overlay */}
          <div 
            className="absolute inset-0 bg-transparent cursor-pointer z-10"
            onClick={() => handleHeroClick(currentItem)}
          />

          {/* Carousel Controls */}
          <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none z-15">
            <Button
              size="lg"
              variant="ghost"
              className="bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110 pointer-events-auto opacity-0 group-hover:opacity-100"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </Button>
            
            <Button
              size="lg"
              variant="ghost"
              className="bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110 pointer-events-auto opacity-0 group-hover:opacity-100"
              onClick={nextSlide}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Button
              size="lg"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-6 transition-all duration-300 hover:scale-110 pointer-events-auto opacity-0 group-hover:opacity-100"
              onClick={() => handleHeroClick(currentItem)}
            >
              <Play className="w-8 h-8 text-white fill-white" />
            </Button>
          </div>

          {/* Bottom Controls & Indicators */}
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-15">
            <div className="flex items-center justify-between mb-4">
              {/* Content Info */}
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 max-w-2xl pointer-events-auto">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentItem.title}
                </h2>
                <p className="text-gray-300 text-sm mb-3">
                  {currentItem.subtitle}
                </p>
                {currentItem.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {currentItem.description}
                  </p>
                )}
              </div>

              {/* Auto-play Controls */}
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full p-2 transition-colors pointer-events-auto"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? 
                    <Pause className="w-4 h-4 text-white" /> : 
                    <Play className="w-4 h-4 text-white" />
                  }
                </Button>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center justify-center space-x-2 pointer-events-auto">
              {carouselData.items.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentItem.isLive ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                  style={{ 
                    width: `${((currentIndex + 1) / carouselData.items.length) * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>
                  {currentIndex + 1} of {carouselData.items.length}
                </span>
                <span>
                  {currentItem.isLive ? "Live" : "Featured"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Indicator Badge */}
      {carouselData.hasLiveContent && (
        <div className="absolute top-16 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-20 animate-pulse">
          {carouselData.liveGameCount > 0 && `${carouselData.liveGameCount} Live Games`}
          {carouselData.liveGameCount > 0 && carouselData.featuredShowCount > 0 && " • "}
          {carouselData.featuredShowCount > 0 && `${carouselData.featuredShowCount} Live Shows`}
        </div>
      )}
    </section>
  )
}