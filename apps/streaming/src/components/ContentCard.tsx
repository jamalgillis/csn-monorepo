"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComingSoonBadge } from "./ComingSoonBadge";

interface Content {
  _id: string;
  title: string;
  poster_url: string;
  backdrop_url?: string;
  year: number;
  rating: string;
  tag_names: string[];
  type: "show" | "podcast" | "feature" | "trailer" | "hype-video" | "highlight" | "clip" | "moment";
  imdb_rating?: number;
  coming_soon?: boolean;
}

interface ContentCardProps {
  content: Content;
  priority?: boolean;
}

export function ContentCard({ content, priority = false }: ContentCardProps) {
  console.log('Content coming_soon:', content.coming_soon, 'Title:', content.title);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use backdrop image for 16:9 format, fallback to poster, then placeholder
  const imageUrl = imageError 
    ? `https://picsum.photos/400/225?random=${content._id}` 
    : content.backdrop_url || content.poster_url;

  return (
    <div
      className="relative group cursor-pointer transition-transform duration-200 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/content/${content._id}`}>
        <div className="relative w-full bg-gray-900">
          {/* 16:9 Aspect Ratio Container */}
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={content.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? (content.coming_soon ? 'opacity-80' : 'opacity-100') : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                if (!imageError) {
                  setImageError(true);
                  setImageLoaded(false);
                }
              }}
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            />

            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 image-loading" />
            )}


            {/* Simple title overlay on hover - Netflix style */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                {/* Coming Soon Badge */}
                {content.coming_soon && (
                  <div className=" bottom-full left-0 mb-1 z-50 w-full flex justify-start">
                    <ComingSoonBadge size="large" />
                  </div>
                )}
                  <h3 className="text-white font-medium text-sm line-clamp-2">
                    {content.title}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}