"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface FilterPanelProps {
  isOpen: boolean;
  filters: {
    type?: string;
    genre?: string;
    year?: string;
    rating?: string;
  };
  genres: Array<{ _id: string; name: string; }>;
  years: number[];
  onFilterChange: (key: string, value: string) => void;
  onClose: () => void;
  hideTypeFilter?: boolean;
}

export function FilterPanel({
  isOpen,
  filters,
  genres,
  years,
  onFilterChange,
  onClose,
  hideTypeFilter = false,
}: FilterPanelProps) {
  const ratings = ["G", "PG", "PG-13", "R", "NC-17", "TV-Y", "TV-Y7", "TV-G", "TV-PG", "TV-14", "TV-MA"];

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 border-r border-gray-800 lg:static lg:w-64 lg:border-r-0 lg:bg-transparent overflow-y-auto">
        <div className="p-6 lg:p-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Content Type */}
            {!hideTypeFilter && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Content Type</h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "show", label: "Shows" },
                    { value: "podcast", label: "Podcasts" },
                    { value: "highlight", label: "Highlights" },
                    { value: "clip", label: "Clips" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={(filters.type || "all") === option.value}
                        onChange={(e) => onFilterChange("type", e.target.value)}
                        className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Genre */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Genre</h3>
              <select
                value={filters.genre || "all"}
                onChange={(e) => onFilterChange("genre", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              >
                <option value="all">All Genres</option>
                {Array.isArray(genres) ? genres.map((genre) => (
                  <option key={genre._id} value={genre.name}>
                    {genre.name}
                  </option>
                )) : []}
              </select>
            </div>

            {/* Year */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Release Year</h3>
              <select
                value={filters.year || "all"}
                onChange={(e) => onFilterChange("year", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              >
                <option value="all">All Years</option>
                {Array.isArray(years) ? years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                )) : []}
              </select>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Rating</h3>
              <select
                value={filters.rating || "all"}
                onChange={(e) => onFilterChange("rating", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              >
                <option value="all">All Ratings</option>
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filters */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Quick Filters</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onFilterChange("genre", "Action");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Action Movies
                </button>
                <button
                  onClick={() => {
                    onFilterChange("genre", "Comedy");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Comedy Shows
                </button>
                <button
                  onClick={() => {
                    onFilterChange("year", new Date().getFullYear().toString());
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  This Year
                </button>
                <button
                  onClick={() => {
                    onFilterChange("rating", "R");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  R-Rated Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}