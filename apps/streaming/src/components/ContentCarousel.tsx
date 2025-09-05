"use client";

import { useState, useRef } from "react";
import { ContentCard } from "./ContentCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Content {
  _id: string;
  title: string;
  poster_url: string;
  year: number;
  rating: string;
  tag_names: string[];
  type: "show" | "podcast" | "feature" | "trailer" | "hype-video" | "highlight" | "clip" | "moment";
  imdb_rating?: number;
  coming_soon?: boolean;
}

interface ContentCarouselProps {
  title: string;
  content: Content[];
}

export function ContentCarousel({ title, content }: ContentCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      const newPosition = Math.max(scrollPosition - 800, 0);
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const newPosition = Math.min(scrollPosition + 800, maxScroll);
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const showLeftButton = scrollPosition > 0;
  const showRightButton = containerRef.current 
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth
    : true;

  return (
    <div className="relative group">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftButton && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightButton && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}

          {/* Content Grid */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex space-x-1 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {Array.isArray(content) ? content.map((item, index) => (
              <div key={item._id} className="flex-none">
                <ContentCard
                  content={item}
                  priority={index < 6} // Prioritize first 6 images
                />
              </div>
            )) : []}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}