"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CarouselItem {
  id: string;
  type:
    | "live_game"
    | "live_show"
    | "scheduled_game"
    | "featured_content"
    | "upcoming_game";
  priority: number;
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

export function HeroCarouselUpdate() {
  const router = useRouter();
  const carouselData = useQuery(api.sports.getHeroCarouselContent);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotation logic
  useEffect(() => {
    if (!isAutoPlaying || isPaused || !carouselData?.items.length) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) =>
          prev === carouselData.items.length - 1 ? 0 : prev + 1
        );
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, carouselData?.items.length]);

  const nextSlide = useCallback(() => {
    if (!carouselData?.items.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === carouselData.items.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
    setIsPaused(true); // Pause auto-rotation when user manually navigates
    setTimeout(() => setIsPaused(false), 15000); // Resume after 15 seconds
  }, [carouselData?.items.length]);

  const prevSlide = useCallback(() => {
    if (!carouselData?.items.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? carouselData.items.length - 1 : prev - 1
      );
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
    setIsPaused(true); // Pause auto-rotation when user manually navigates
    setTimeout(() => setIsPaused(false), 15000); // Resume after 15 seconds
  }, [carouselData?.items.length]);

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
    setIsPaused(true); // Pause auto-rotation when user manually navigates
    setTimeout(() => setIsPaused(false), 15000); // Resume after 15 seconds
  }, []);

  const handleHeroClick = (item: CarouselItem) => {
    if (item.navigationUrl) {
      router.push(item.navigationUrl);
    }
  };

  if (!carouselData?.items.length) {
    return (
      <main className="relative w-svw h-screen grid grid-rows-3 snap-start">
        <h1 className="text-2xl md:text-5xl lg:text-8xl uppercase text-slate-50 font-black justify-self-center self-center mix-blend-difference row-start-2">
          Centex Sports Network
        </h1>
        <div className="bg-slate-900 absolute top-0 bottom-0 left-0 right-0 -z-10">
          <div className="bg-black opacity-25 absolute w-full h-full"></div>
          {/* Fallback placeholder - no image when loading */}
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <p className="text-lg font-medium opacity-75">
                254 Podcast Studios
              </p>
              <p className="text-sm opacity-50">Professional Audio Recording</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-gray-900 absolute -z-20"></div>
        <div className="row-start-3 grid grid-cols-3 grid-rows-1 p-5">
          <p className="text-slate-50 content-end"></p>
        </div>
      </main>
    );
  }

  const currentItem = carouselData.items[currentIndex];

  return (
    <main
      className="relative w-svw h-dvh grid grid-rows-3 snap-start cursor-pointer"
      onClick={() => handleHeroClick(currentItem)}
    >
      <h1
        className={`text-2xl md:text-3xl lg:text-5xl uppercase z-20 text-slate-50 font-bold justify-self-center self-center row-start-2 text-center transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        {currentItem.title}
      </h1>
      <div className="bg-slate-900 absolute top-0 bottom-0 left-0 right-0">
        {/* Background image - only render if thumbnail exists */}
        {currentItem.thumbnail ? (
          <>
            <div
              className={`bg-black opacity-25 absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-25"}`}
            ></div>
            <img
              src={currentItem.thumbnail}
              alt={currentItem.title}
              className={`object-cover w-full h-full transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
              loading="eager"
            />
          </>
        ) : (
          /* Fallback placeholder when no image */
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <p className="text-lg font-medium opacity-75">
                Centex Sports Netowrk
              </p>
              <p className="text-sm opacity-50">Professional Audio Recording</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-full bg-gray-900 absolute -z-20"></div>
      <div className="row-start-3 grid grid-cols-3 grid-rows-1 p-5 relative z-10 bg-gradient-to-b">
        <p
          className={`text-slate-50 font-medium content-end transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          {currentItem.title}
        </p>
        {/* Navigation Controls */}
        <div className="col-span-2 flex items-end justify-end gap-4">
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-slate-50/10 hover:bg-slate-50/20 text-slate-50 hover:text-white transition-all duration-200 backdrop-blur-sm border border-slate-50/20 hover:border-slate-50/40 hover:scale-110 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {carouselData.items.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? "bg-slate-50 w-8"
                    : "bg-slate-50/40 hover:bg-slate-50/60 w-2 hover:w-4"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-slate-50/10 hover:bg-slate-50/20 text-slate-50 hover:text-white transition-all duration-200 backdrop-blur-sm border border-slate-50/20 hover:border-slate-50/40 hover:scale-110 cursor-pointer"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50/10 hover:bg-slate-50/20 text-slate-50 hover:text-white transition-all duration-200 backdrop-blur-sm border border-slate-50/20 hover:border-slate-50/40 hover:scale-110 cursor-pointer ml-2"
            aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
          >
            {isAutoPlaying ? (
              <svg
                className="w-5 h-5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
