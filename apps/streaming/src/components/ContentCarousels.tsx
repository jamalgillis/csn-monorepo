"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ContentCarousel } from "./ContentCarousel";

export function ContentCarousels() {
  const trendingContent = useQuery(api.content.getTrendingContent);
  const newReleases = useQuery(api.content.getNewReleases);
  const actionContent = useQuery(api.content.getContentByGenre, { genre: "Action" }) || [];
  const comedyContent = useQuery(api.content.getContentByGenre, { genre: "Comedy" }) || [];
  const dramaContent = useQuery(api.content.getContentByGenre, { genre: "Drama" }) || [];
  const sciFiContent = useQuery(api.content.getContentByGenre, { genre: "Sci-Fi" }) || [];

  return (
    <div className="relative z-10 -mt-32 pb-12">
      <div className="space-y-8 md:space-y-10">
        {/* Trending Now */}
        {trendingContent && trendingContent.length > 0 && (
          <ContentCarousel
            title="Trending Now"
            content={trendingContent}
          />
        )}

        {/* New Releases */}
        {newReleases && newReleases.length > 0 && (
          <ContentCarousel
            title="New Releases"
            content={newReleases}
          />
        )}

        {/* Action */}
        {actionContent && actionContent.length > 0 && (
          <ContentCarousel
            title="Action & Adventure"
            content={actionContent}
          />
        )}

        {/* Comedy */}
        {comedyContent && comedyContent.length > 0 && (
          <ContentCarousel
            title="Comedy"
            content={comedyContent}
          />
        )}

        {/* Drama */}
        {dramaContent && dramaContent.length > 0 && (
          <ContentCarousel
            title="Drama"
            content={dramaContent}
          />
        )}

        {/* Sci-Fi */}
        {sciFiContent && sciFiContent.length > 0 && (
          <ContentCarousel
            title="Sci-Fi & Fantasy"
            content={sciFiContent}
          />
        )}
      </div>
    </div>
  );
}