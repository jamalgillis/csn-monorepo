"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ 
  className = "", 
  placeholder = "Search movies, TV shows, articles...",
  autoFocus = false 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Search results with debouncing
  const searchResults = useQuery(
    api.content.searchContent,
    query.trim().length >= 2 ? { searchTerm: query.trim(), limit: 6 } : "skip"
  );

  const blogSearchResults = useQuery(
    api.blog.searchBlogPosts,
    query.trim().length >= 2 ? { searchTerm: query.trim(), limit: 4 } : "skip"
  );

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length >= 2);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const allResults = [
      ...(searchResults || []).map(item => ({ type: 'content' as const, item })),
      ...(blogSearchResults || []).map(item => ({ type: 'blog' as const, item }))
    ];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && allResults[selectedIndex]) {
          const result = allResults[selectedIndex];
          if (result.type === 'content') {
            router.push(`/content/${result.item._id}`);
          } else {
            router.push(`/blog/${result.item.slug}`);
          }
          handleClose();
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          handleClose();
        }
        break;
      case "Escape":
        handleClose();
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={resultsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 bg-gray-800/90 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 z-50 max-h-96 overflow-y-auto">
          {((searchResults && searchResults.length > 0) || (blogSearchResults && blogSearchResults.length > 0)) ? (
            <>
              {/* Content Results */}
              {searchResults && searchResults.length > 0 && (
                <>
                  {searchResults.length > 0 && blogSearchResults && blogSearchResults.length > 0 && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-gray-700">
                      MOVIES & TV SHOWS
                    </div>
                  )}
                  {searchResults.map((item, index) => (
                    <Link
                      key={`content-${item._id}`}
                      href={`/content/${item._id}`}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 p-3 hover:bg-gray-700 transition-colors ${
                        index === selectedIndex ? "bg-gray-700" : ""
                      }`}
                    >
                      <div className="w-12 h-16 relative overflow-hidden flex-shrink-0">
                        <Image
                          src={item.poster_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{item.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>{item.year}</span>
                          <span>•</span>
                          <span className="capitalize">{item.type.replace("_", " ")}</span>
                          {item.imdb_rating && (
                            <>
                              <span>•</span>
                              <span>⭐ {item.imdb_rating}</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tag_names.slice(0, 2).map((genre) => (
                            <span
                              key={genre}
                              className="text-xs bg-gray-600 text-gray-300 px-2 py-1"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}

              {/* Blog Results */}
              {blogSearchResults && blogSearchResults.length > 0 && (
                <>
                  {searchResults && searchResults.length > 0 && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-gray-700 border-t border-gray-600">
                      ARTICLES
                    </div>
                  )}
                  {blogSearchResults.map((item, index) => {
                    const adjustedIndex = (searchResults?.length || 0) + index;
                    return (
                      <Link
                        key={`blog-${item._id}`}
                        href={`/blog/${item.slug}`}
                        onClick={handleClose}
                        className={`flex items-center space-x-3 p-3 hover:bg-gray-700 transition-colors ${
                          adjustedIndex === selectedIndex ? "bg-gray-700" : ""
                        }`}
                      >
                        <div className="w-12 h-12 relative overflow-hidden flex-shrink-0">
                          {item.featured_image ? (
                            <Image
                              src={item.featured_image}
                              alt={item.title}
                              fill
                              className="object-cover rounded"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center text-xl">
                              📝
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{item.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>Article</span>
                            {item.category && (
                              <>
                                <span>•</span>
                                <span>{item.category.name}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{item.read_time}m read</span>
                          </div>
                          {item.author && (
                            <div className="text-xs text-gray-500 mt-1">
                              By {item.author.name}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </>
              )}
              
              {/* View All Results Link */}
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={handleClose}
                className="block p-3 text-center text-red-400 hover:text-red-300 border-t border-gray-700 font-medium transition-colors"
              >
                View all results for &quot;{query}&quot;
              </Link>
            </>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}