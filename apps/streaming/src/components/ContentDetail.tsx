"use client";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  PlusIcon, 
  ShareIcon, 
  ClockIcon,
  CalendarIcon,
  FilmIcon,
  TvIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { PlayIcon as PlayIconSolid } from "@heroicons/react/24/solid";
import { ContentCarousel } from "./ContentCarousel";
import { VideoPlayer } from "./VideoPlayer";
import { ComingSoonBadge } from "./ComingSoonBadge";
import { RatingButtons } from "./RatingButtons";
// import { useVideoTracking } from "@/hooks/useVideoTracking";
import { ContentInteractionTracker } from "./analytics/ContentInteractionTracker";

interface ContentDetailProps {
  contentId: string;
}

export function ContentDetail({ contentId }: ContentDetailProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [showFullVideo, setShowFullVideo] = useState(false);
  const searchParams = useSearchParams();
  const content = useQuery(api.content.getContentById, { 
    id: contentId as Id<"content"> 
  });
  const similarContent = useQuery(api.content.getSimilarContent, { 
    contentId: contentId as Id<"content">,
    limit: 8
  }) || [];

  // Video tracking hooks (for future VideoPlayer integration)
  // const videoTracking = useVideoTracking({
  //   contentId,
  //   contentTitle: content?.title || '',
  //   contentType: content?.type || '',
  //   videoUrl: content?.video_url || '',
  //   isTrailer: false
  // });

  // const trailerTracking = useVideoTracking({
  //   contentId,
  //   contentTitle: content?.title || '',
  //   contentType: content?.type || '',
  //   videoUrl: content?.trailer_url || '',
  //   isTrailer: true
  // });

  // Handle query parameters from hero section
  useEffect(() => {
    if (content) {
      const playParam = searchParams.get('play');
      const trailerParam = searchParams.get('trailer');
      
      if (playParam === 'true' && content.video_url) {
        setShowFullVideo(true);
      } else if (trailerParam === 'true' && content.trailer_url) {
        setShowTrailer(true);
      }
    }
  }, [content, searchParams]);

  if (!content) {
    return <ContentDetailSkeleton />;
  }

  const handlePlayTrailer = () => {
    if (content.trailer_url) {
      setShowTrailer(true);
      // Track trailer play intent
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('trailer_play_clicked', {
          content_id: contentId,
          content_title: content.title,
          content_type: content.type
        });
      }
    }
  };

  const handlePlayFullVideo = () => {
    if (content.video_url) {
      setShowFullVideo(true);
      // Track full video play intent
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('full_video_play_clicked', {
          content_id: contentId,
          content_title: content.title,
          content_type: content.type
        });
      }
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  const handleCloseFullVideo = () => {
    setShowFullVideo(false);
  };

  return (
    <>
      {/* Content Interaction Tracking */}
      <ContentInteractionTracker 
        contentId={contentId}
        contentTitle={content.title}
        contentType={content.type}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={content.backdrop_url}
            alt={content.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Poster */}
              <div className="lg:col-span-1">
                <div className="relative w-full max-w-sm mx-auto lg:mx-0">
                  <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={content.poster_url}
                      alt={content.title}
                      fill
                      className={`object-cover ${content.coming_soon ? 'opacity-80' : 'opacity-100'}`}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title and Metadata */}
                <div className="space-y-4">
                  <div className="relative w-full space-y-2">
                    {content.coming_soon && (
                      <div className="w-full flex justify-start z-50">
                        <ComingSoonBadge size="large" />
                      </div>
                    )}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                      {content.title}
                    </h1>
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{content.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{content.runtime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {["show"].includes(content.type) ? (
                        <FilmIcon className="h-4 w-4" />
                      ) : (
                        <TvIcon className="h-4 w-4" />
                      )}
                      <span className="capitalize">{content.type.replace('_', ' ')}</span>
                    </div>
                    <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {content.rating}
                    </span>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {content.tag_names.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-red-600/20 border border-red-600/30 text-red-300 px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Synopsis</h2>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    {content.description}
                  </p>
                </div>

                {/* Rating System - QW-1: Replace Dual Rating System */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Rate This Content</h3>
                  <RatingButtons contentId={contentId} />
                </div>

                {/* Cast and Crew */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Cast & Crew</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {content.director && (
                      <div>
                        <span className="text-gray-400">Director:</span>
                        <span className="text-white ml-2">{content.director}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Starring:</span>
                      <span className="text-white ml-2">
                        {content.cast.slice(0, 3).join(', ')}
                        {content.cast.length > 3 && '...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6">
                  {/* See More Like This Button */}
                  <button 
                    onClick={() => {
                      // Track analytics
                      if (typeof window !== 'undefined' && window.posthog) {
                        window.posthog.capture('see_more_like_this_clicked', {
                          contentId: contentId,
                          contentTitle: content.title,
                          contentType: content.type,
                          genres: content.tag_names
                        });
                      }
                      // Scroll to similar content section
                      const similarSection = document.querySelector('[data-section="similar-content"]');
                      if (similarSection) {
                        similarSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <FilmIcon className="h-5 w-5" />
                    <span>See More Like This</span>
                  </button>
                  {/* Play Full Video Button (priority if available) */}
                  {content.video_url && (
                    <button 
                      onClick={handlePlayFullVideo}
                      className="btn-primary flex items-center justify-center space-x-2"
                    >
                      <PlayIconSolid className="h-5 w-5" />
                      <span>Play</span>
                    </button>
                  )}
                  
                  {/* Watch Trailer Button */}
                  <button 
                    onClick={handlePlayTrailer}
                    disabled={!content.trailer_url}
                    className={`${content.video_url ? 'btn-secondary' : 'btn-primary'} flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <PlayIconSolid className="h-5 w-5" />
                    <span>Watch Trailer</span>
                  </button>
                  
                  <button className="btn-secondary flex items-center justify-center space-x-2">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add to Watchlist</span>
                  </button>

                  <button className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors p-3 border border-gray-600 rounded-lg hover:border-gray-400">
                    <ShareIcon className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TV Show Seasons (if applicable) */}
      {content.type === 'show' && 'seasons' in content && content.seasons && (
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Seasons & Episodes</h2>
            <div className="space-y-8">
              {('seasons' in content ? content.seasons : []).map((season) => (
                <div key={season._id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start space-x-4 mb-6">
                    {season.poster_url && (
                      <div className="w-20 h-28 relative rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={season.poster_url}
                          alt={season.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white">{season.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {season.episode_count} Episodes
                      </p>
                      {season.description && (
                        <p className="text-gray-300 text-sm">{season.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Episodes */}
                  <div className="space-y-3">
                    {season.episodes?.map((episode) => (
                      <div key={episode._id} className="flex items-start space-x-4 p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                        <div className="w-16 h-9 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">{episode.episode_number}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{episode.title}</h4>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            {episode.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <span>{episode.runtime} min</span>
                            {episode.air_date && (
                              <>
                                <span>•</span>
                                <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar Content */}
      {similarContent && similarContent.length > 0 && (
        <section className="py-16 bg-black" data-section="similar-content">
          <div className="max-w-7xl mx-auto">
            <ContentCarousel
              title="More Like This"
              content={similarContent}
            />
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      {showTrailer && content.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close trailer"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <VideoPlayer
              src={content.trailer_url}
              title={`${content.title} - Trailer`}
              autoPlay
            />
          </div>
        </div>
      )}

      {/* Full Video Modal */}
      {showFullVideo && content.video_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full max-w-6xl mx-4">
            <button
              onClick={handleCloseFullVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <VideoPlayer
              src={content.video_url}
              title={content.title}
              autoPlay
            />
          </div>
        </div>
      )}
    </>
  );
}

function ContentDetailSkeleton() {
  return (
    <section className="relative min-h-screen bg-gray-900">
      <div className="absolute inset-0 image-loading" />
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] bg-gray-700 rounded-lg loading-pulse"></div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="h-16 bg-gray-700 rounded loading-pulse"></div>
              <div className="flex space-x-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-gray-700 rounded loading-pulse"></div>
                ))}
              </div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded loading-pulse"></div>
                ))}
              </div>
              <div className="flex space-x-4">
                <div className="h-12 w-32 bg-gray-700 rounded loading-pulse"></div>
                <div className="h-12 w-32 bg-gray-700 rounded loading-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}