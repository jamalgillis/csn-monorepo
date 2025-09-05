"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlayIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { ComingSoonBadge } from "./ComingSoonBadge";

export function  HeroSection() {
  const featuredContentQuery = useQuery(api.content.getFeaturedContent);
  const featuredContent = useMemo(() => featuredContentQuery || [], [featuredContentQuery]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // Auto-rotate through featured content every 8 seconds
  useEffect(() => {
    if (!featuredContent || featuredContent.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredContent, isHovered]);

  // Reset image error when content changes
  useEffect(() => {
    setImageError(false);
  }, [currentIndex]);

  if (!featuredContent || featuredContent.length === 0) {
    return <HeroSkeleton />;
  }

  const currentContent = featuredContent[currentIndex];
  
  // Use backdrop image with fallback to placeholder
  const heroImageUrl = imageError 
    ? `https://picsum.photos/1920/1080?random=${currentContent._id}` 
    : currentContent.backdrop_url;

  // Handle play button click
  const handlePlay = () => {
    try {
      if (currentContent.video_url) {
        // Navigate to video player page with full video
        router.push(`/content/${currentContent._id}?play=true`);
      } else if (currentContent.trailer_url) {
        // Navigate to content page with trailer
        router.push(`/content/${currentContent._id}?trailer=true`);
      } else {
        // Fallback to content detail page
        router.push(`/content/${currentContent._id}`);
      }
    } catch (error) {
      console.error('Error navigating to content:', error);
      // Fallback navigation
      router.push(`/content/${currentContent._id}`);
    }
  };

  // Handle more info button click
  const handleMoreInfo = () => {
    try {
      router.push(`/content/${currentContent._id}`);
    } catch (error) {
      console.error('Error navigating to content detail:', error);
    }
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImageUrl}
          alt={currentContent.title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          priority
          sizes="100vw"
        />
        {/* Netflix-style gradient: strong left fade, transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full !p-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="max-w-xl lg:max-w-2xl grid grid-rows-1 gap-2">
            {/* Title */}
            <div className="relative">
              {currentContent.coming_soon && (
                <div className="absolute -top-10 left-0 w-full flex justify-start z-50">
                  <ComingSoonBadge size="xlarge" />
                </div>
              )}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.9] mb-4">
                {currentContent.title}
              </h1>
            </div>

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-white/90 mb-4 gap-3">
              <span className="text-green-500 font-semibold">
                {Math.round(parseFloat(currentContent.imdb_rating?.toString() || "0") * 10)}% Match
              </span>
              <span className="border border-gray-400 px-1 text-xs">
                {currentContent.rating}
              </span>
              <span>{currentContent.year}</span>
              <span>{currentContent.type === 'show' ? 'Series' : currentContent.type.charAt(0).toUpperCase() + currentContent.type.slice(1)}</span>
            </div>

            {/* Description */}
            <p className="text-lg text-white/90 leading-relaxed mb-6 line-clamp-3 max-w-lg">
              {currentContent.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 gap-2">
              <button 
                onClick={handlePlay}
                className="bg-white text-black font-semibold px-8 py-3 rounded flex items-center space-x-2 hover:bg-white/80 transition-colors"
              >
                <PlayIcon className="h-6 w-6 fill-current" />
                <span className="text-lg">Play</span>
              </button>
              <button 
                onClick={handleMoreInfo}
                className="bg-gray-600/70 text-white font-semibold px-8 py-3 rounded flex items-center space-x-2 hover:bg-gray-600/50 transition-colors"
              >
                <InformationCircleIcon className="h-6 w-6" />
                <span className="text-lg">More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {featuredContent.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {featuredContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-gray-500 hover:bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Placeholder background image */}
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/1920/1080?random=hero-skeleton"
          alt="Loading hero content"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        {/* Same gradients as main hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          <div className="h-16 bg-gray-700 rounded loading-pulse"></div>
          <div className="flex space-x-4">
            <div className="h-6 w-16 bg-gray-700 rounded loading-pulse"></div>
            <div className="h-6 w-16 bg-gray-700 rounded loading-pulse"></div>
            <div className="h-6 w-16 bg-gray-700 rounded loading-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded loading-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 loading-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 loading-pulse"></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-12 w-32 bg-gray-700 rounded loading-pulse"></div>
            <div className="h-12 w-32 bg-gray-700 rounded loading-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}