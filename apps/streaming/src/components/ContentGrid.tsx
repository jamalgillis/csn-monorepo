"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComingSoonBadge } from "./ComingSoonBadge";

interface ContentItem {
  _id: string;
  title: string;
  poster_url: string;
  backdrop_url?: string;
  year: number;
  type: "show" | "podcast" | "feature" | "trailer" | "hype-video" | "highlight" | "clip" | "moment";
  tag_names: string[];
  imdb_rating?: string | number;
  rating: string;
  coming_soon?: boolean;
}

interface ContentGridProps {
  content: ContentItem[];
  className?: string;
}

export function ContentGrid({ content, className = "" }: ContentGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1 ${className}`}>
      {Array.isArray(content) ? content.map((item) => (
        <ContentCard key={item._id} content={item} />
      )) : []}
    </div>
  );
}

function ContentCard({ content }: { content: ContentItem }) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Use backdrop if available, fallback to poster, then placeholder
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
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              loading="lazy"
            />

            {/* Coming Soon Badge */}
            {content.coming_soon && (
              <div className="absolute top-2 right-2 z-50">
                <ComingSoonBadge size="xlarge" />
              </div>
            )}

            {/* Netflix-style hover overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-3">
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