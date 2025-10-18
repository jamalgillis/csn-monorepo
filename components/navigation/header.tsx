"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { user, isSignedIn } = useUser();
  const searchRef = useRef<HTMLDivElement>(null);

  // Search for content when query changes
  const searchResults = useQuery(
    api.content.searchContent,
    searchQuery.length >= 2 ? { searchText: searchQuery } : "skip"
  );

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              CSN
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <Link
                href="/"
                className="text-white hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/games"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                Live
              </Link>
              <Link
                href="/shows"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                Shows
              </Link>
              <Link
                href="/news/lakers-blockbuster-trade"
                className="text-muted-foreground hover:text-white transition-colors hidden"
              >
                News
              </Link>
              <Link
                href="/teams/lakers"
                className="text-muted-foreground hover:text-white transition-colors hidden"
              >
                Teams
              </Link>
              <Link
                href="/standings"
                className="text-muted-foreground hover:text-white transition-colors hidden"
              >
                Standings
              </Link>
              <Link
                href="/schedule"
                className="text-muted-foreground hover:text-white transition-colors hidden"
              >
                Schedule
              </Link>
            </div>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block" ref={searchRef}>
              <Input
                type="text"
                placeholder="Search shows, games, teams..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="bg-gray-800 border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />

              {/* Search Results Dropdown */}
              {showResults && searchQuery.length >= 2 && (
                <div className="absolute top-full mt-2 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                  {!searchResults ? (
                    <div className="p-4 text-center text-gray-400">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((result: any) => {
                        const isGame = result.type === "game";
                        const href = isGame ? `/games/${result._id}` : `/shows/${result._id}`;

                        return (
                          <Link
                            key={result._id}
                            href={href}
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
                          >
                            {result.poster_url && (
                              <img
                                src={result.poster_url}
                                alt={result.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium truncate">{result.title}</h4>
                              <p className="text-sm text-gray-400 truncate">{result.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs capitalize ${isGame ? 'text-green-400' : 'text-primary'}`}>
                                  {result.type}
                                </span>
                                {result.year && (
                                  <span className="text-xs text-gray-500">• {result.year}</span>
                                )}
                                {isGame && result.status === "in_progress" && (
                                  <span className="text-xs text-red-400">• LIVE</span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                    userButtonPopoverCard: "bg-gray-900 border border-gray-700",
                    userButtonPopoverActionButton: "text-white hover:bg-gray-800",
                    userButtonPopoverActionButtonText: "text-white",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            ) : (
              <SignInButton>
                <Button className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Sign In
                </Button>
              </SignInButton>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="transition-transform duration-200 ease-in-out">
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden border-t border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 py-4 pb-6"
              : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="flex flex-col space-y-4">
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search..."
                className="bg-gray-800 border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <Link
              href="/"
              className="text-white hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/games"
              className="text-muted-foreground hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Live
            </Link>
            <Link
              href="/shows"
              className="text-muted-foreground hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shows
            </Link>
            <Link
              href="/news/lakers-blockbuster-trade"
              className="text-muted-foreground hover:text-white transition-colors py-2 hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
            <Link
              href="/teams/lakers"
              className="text-muted-foreground hover:text-white transition-colors py-2 hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              Teams
            </Link>
            <Link
              href="/standings"
              className="text-muted-foreground hover:text-white transition-colors py-2 hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              Standings
            </Link>
            <Link
              href="/schedule"
              className="text-muted-foreground hover:text-white transition-colors py-2 hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              Schedule
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
