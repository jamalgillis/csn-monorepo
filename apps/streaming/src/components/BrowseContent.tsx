"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentGrid } from "./ContentGrid";
import { FilterPanel } from "./FilterPanel";
import { Pagination } from "./Pagination";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

interface BrowseFilters {
  type?: string;
  genre?: string;
  year?: string;
  rating?: string;
  sort?: string;
  page?: number;
}

interface BrowseContentProps {
  initialFilters: BrowseFilters;
  pageTitle?: string;
  pageDescription?: string;
}

function BrowseContentInner({ 
  initialFilters = {},
  pageTitle = "Browse",
  pageDescription = "Discover amazing movies and TV shows"
}: BrowseContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<BrowseFilters>(initialFilters);
  const [sortBy, setSortBy] = useState(initialFilters.sort || "year");
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 24;

  // Sync with URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = parseInt(params.get("page") || "1");
    const urlFilters: BrowseFilters = {
      type: params.get("type") || initialFilters.type,
      genre: params.get("genre") || initialFilters.genre,
      year: params.get("year") || initialFilters.year,
      rating: params.get("rating") || initialFilters.rating,
      sort: params.get("sort") || initialFilters.sort || "year",
      page,
    };
    
    setFilters(urlFilters);
    setSortBy(urlFilters.sort || "year");
    setCurrentPage(page);
  }, [searchParams, initialFilters]);

  // Query data
  const contentData = useQuery(api.content.getContent, {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    type: filters.type === "all" ? undefined : (filters.type as "show" | "podcast" | "feature" | "trailer" | "hype-video" | "highlight" | "clip" | "moment"),
    genre: filters.genre === "all" ? undefined : filters.genre,
    year: filters.year === "all" || !filters.year ? undefined : parseInt(filters.year) || undefined,
    rating: filters.rating === "all" ? undefined : filters.rating,
  });

  const genres = useQuery(api.content.getGenres);
  const years = useQuery(api.content.getContentYears);

  // Filter and sort content
  const filteredAndSortedContent = contentData?.content ? (() => {
    let filteredContent = [...contentData.content];
    
    // TEMPORARY: For TV shows page, only show Centex Primetime
    if (initialFilters.type === "tv_show") {
      filteredContent = filteredContent.filter(item => 
        item.title === "Centex Primetime"
      );
    }
    
    return filteredContent.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return b.year - a.year;
        case "rating":
          const ratingA = parseFloat((a.imdb_rating || "0").toString());
          const ratingB = parseFloat((b.imdb_rating || "0").toString());
          return ratingB - ratingA;
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.year - a.year; // Secondary sort by year
        default:
          return 0;
      }
    });
  })() : [];

  // Calculate pagination values
  const totalItems = contentData?.totalCount || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const updateURL = (newFilters: BrowseFilters, newSort?: string, newPage?: number) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === "page") return; // Handle page separately
      if (value && value !== "all" && value !== initialFilters[key as keyof BrowseFilters]) {
        params.set(key, value);
      }
    });
    
    if (newSort && newSort !== "year") {
      params.set("sort", newSort);
    }
    
    if (newPage && newPage > 1) {
      params.set("page", newPage.toString());
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    updateURL(newFilters, sortBy, 1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
    updateURL(filters, value, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(filters, sortBy, page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    const clearedFilters = { type: initialFilters.type };
    setFilters(clearedFilters);
    setSortBy("year");
    setCurrentPage(1);
    updateURL(clearedFilters, "year", 1);
  };

  const activeFilterCount = Object.values({
    genre: filters.genre,
    year: filters.year,
    rating: filters.rating,
  }).filter(value => value && value !== "all").length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-gray-400 mb-8">{pageDescription}</p>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center space-x-6">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-800 border border-gray-700 px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm text-gray-400">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              >
                <option value="year">Year (Newest First)</option>
                <option value="title">Title (A-Z)</option>
                <option value="rating">Rating (Highest First)</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <FilterPanel
            isOpen={showFilters}
            filters={filters}
            genres={genres || []}
            years={years || []}
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
            hideTypeFilter={!!initialFilters.type}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            {contentData && (
              <div className="mb-6">
                <p className="text-gray-400">
                  {totalItems} {totalItems === 1 ? "result" : "results"}
                  {filters.genre && filters.genre !== "all" && ` in ${filters.genre}`}
                  {filters.year && filters.year !== "all" && ` from ${filters.year}`}
                  {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>
            )}

            {/* Content Grid */}
            {contentData === undefined ? (
              <BrowseContentSkeleton />
            ) : filteredAndSortedContent.length > 0 ? (
              <>
                <ContentGrid content={filteredAndSortedContent} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                />
              </>
            ) : (
              <NoResults filters={filters} onClearFilters={clearFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrowseContent(props: BrowseContentProps) {
  return (
    <Suspense fallback={<BrowseContentSkeleton />}>
      <BrowseContentInner {...props} />
    </Suspense>
  );
}

function BrowseContentSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] bg-gray-800 rounded loading-pulse"></div>
        </div>
      ))}
    </div>
  );
}

function NoResults({ filters, onClearFilters }: { 
  filters: BrowseFilters; 
  onClearFilters: () => void;
}) {
  const hasActiveFilters = Object.values({
    genre: filters.genre,
    year: filters.year,
    rating: filters.rating,
  }).some(value => value && value !== "all");

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          No content found
        </h3>
        {hasActiveFilters ? (
          <>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={onClearFilters}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </>
        ) : (
          <p className="text-gray-500">
            No content available at the moment
          </p>
        )}
      </div>
    </div>
  );
}