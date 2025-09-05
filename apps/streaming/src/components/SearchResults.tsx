"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { ContentGrid } from "./ContentGrid";
import { BlogCard } from "./BlogCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query: initialQuery }: SearchResultsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<"relevance" | "year" | "title" | "rating">("relevance");
  const [filterType, setFilterType] = useState<"all" | "show" | "podcast" | "feature" | "trailer" | "hype-video" | "highlight" | "clip" | "moment" | "blog">("all");
  const [activeTab, setActiveTab] = useState<"all" | "content" | "blog">("all");

  // Update query when initialQuery changes (from URL)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const searchResults = useQuery(
    api.content.searchContent,
    query.trim() ? { searchTerm: query.trim(), limit: 50 } : "skip"
  );

  const blogSearchResults = useQuery(
    api.blog.searchBlogPosts,
    query.trim() ? { searchTerm: query.trim(), limit: 20 } : "skip"
  );

  const allContent = useQuery(api.content.getContent, {
    limit: 50,
    type: filterType === "all" || filterType === "blog" ? undefined : (filterType as "show" | "podcast" | "feature" | "trailer" | "hype-video" | "highlight" | "clip" | "moment"),
  });

  // Use search results if we have a query, otherwise show all content
  const content = query.trim() ? searchResults : allContent?.content;
  const blogPosts = query.trim() ? blogSearchResults : [];

  // Sort content based on selected sort option
  const sortedContent = Array.isArray(content) ? [...content].sort((a, b) => {
    switch (sortBy) {
      case "year":
        return b.year - a.year;
      case "title":
        return a.title.localeCompare(b.title);
      case "rating":
        const ratingA = parseFloat((a.imdb_rating || "0").toString());
        const ratingB = parseFloat((b.imdb_rating || "0").toString());
        return ratingB - ratingA;
      case "relevance":
      default:
        return 0; // Keep original order for relevance
    }
  }) : [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                className="w-full"
                placeholder="Search movies, TV shows, articles..."
                autoFocus={!query}
              />
            </div>
            
            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Content Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Content</option>
                <option value="show">Shows</option>
                <option value="podcast">Podcasts</option>
                <option value="highlight">Highlights</option>
                <option value="clip">Clips</option>
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          {query.trim() ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">
                Search results for &quot;{query}&quot;
              </h1>
              
              {/* Search Result Tabs */}
              <div className="flex items-center space-x-1 mb-4">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "all" 
                      ? "bg-red-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  All ({(sortedContent?.length || 0) + (blogPosts?.length || 0)})
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "content" 
                      ? "bg-red-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  Sports Content ({sortedContent?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("blog")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "blog" 
                      ? "bg-red-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  Articles ({blogPosts?.length || 0})
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-2">Browse All Content</h1>
              {sortedContent && (
                <p className="text-gray-400">
                  {sortedContent.length} {filterType === "all" ? "titles" : filterType === "show" ? "shows" : filterType === "podcast" ? "podcasts" : filterType === "highlight" ? "highlights" : filterType === "clip" ? "clips" : "articles"} available
                </p>
              )}
            </div>
          )}
        </div>

        {/* Results Content */}
        {(sortedContent === undefined || blogPosts === undefined) ? (
          <SearchResultsSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Content Results */}
            {(activeTab === "all" || activeTab === "content") && sortedContent && sortedContent.length > 0 && (
              <div>
                {activeTab === "all" && <h2 className="text-xl font-bold text-white mb-4">Movies & TV Shows</h2>}
                <ContentGrid content={sortedContent} />
              </div>
            )}

            {/* Blog Results */}
            {(activeTab === "all" || activeTab === "blog") && blogPosts && blogPosts.length > 0 && (
              <div>
                {activeTab === "all" && <h2 className="text-xl font-bold text-white mb-4">Articles</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {((activeTab === "all" && (!sortedContent || sortedContent.length === 0) && (!blogPosts || blogPosts.length === 0)) ||
              (activeTab === "content" && (!sortedContent || sortedContent.length === 0)) ||
              (activeTab === "blog" && (!blogPosts || blogPosts.length === 0))) && query.trim() && (
              <NoResults query={query} />
            )}

            {/* Empty State */}
            {!query.trim() && (!sortedContent || sortedContent.length === 0) && (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-[2/3] bg-gray-700 rounded-lg loading-pulse"></div>
          <div className="h-4 bg-gray-700 rounded loading-pulse"></div>
          <div className="h-3 bg-gray-700 rounded loading-pulse w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <MagnifyingGlassIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-300 mb-2">
        No results found for &quot;{query}&quot;
      </h2>
      <p className="text-gray-500 mb-6">
        Try adjusting your search terms or browse our content library
      </p>
      <div className="space-y-2 text-sm text-gray-400">
        <p>Search suggestions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Check your spelling</li>
          <li>Try different keywords</li>
          <li>Use more general terms</li>
          <li>Browse by genre instead</li>
        </ul>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <MagnifyingGlassIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-300 mb-2">
        Discover Amazing Content
      </h2>
      <p className="text-gray-500 mb-6">
        Search for your favorite movies and TV shows, or browse our entire library
      </p>
    </div>
  );
}