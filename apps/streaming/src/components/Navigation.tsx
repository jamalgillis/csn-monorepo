"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useUser, useClerk } from "@clerk/nextjs";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signOut } = useClerk();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr] h-20 items-center">
          {/* Logo */}
          <div className="w-full h-auto">
            <Link href="/" className="block">
              <div className="relative w-full max-w-[200px] h-12">
                <Image
                  src="https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMyWV5rMoSpRJNgzIn8b2G1Do0WC3csXUZFBE4"
                  alt="CSN Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center justify-center space-x-6 gap-2">
              <Link
                href="/"
                className="text-white hover:text-gray-300 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/tv-shows"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                TV Shows
              </Link>
              <Link
                href="/movies"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Movies
              </Link>
              <Link
                href="/browse"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/search"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Search
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4 justify-end">
            {/* Search Icon */}
            <Link href="/search" className="text-white hover:text-gray-300 transition-colors p-2">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </Link>

            {/* Authentication */}
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                      userButtonPopoverCard: "bg-gray-900 border border-gray-700",
                      userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700",
                      userButtonPopoverActionButtonText: "text-gray-300",
                    },
                  }}
                />
                <Link 
                  href="/profile" 
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-sm rounded-lg mt-2">
              <Link
                href="/"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/tv-shows"
                className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                TV Shows
              </Link>
              <Link
                href="/movies"
                className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/browse"
                className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/blog"
                className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/search"
                className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              
              {/* Mobile Authentication */}
              <div className="border-t border-gray-700 pt-2 mt-2">
                {isSignedIn ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2 text-gray-300">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "h-6 w-6",
                          },
                        }}
                      />
                      <span className="ml-3 text-sm">
                        {user?.fullName || user?.emailAddresses?.[0]?.emailAddress}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <SignInButton mode="modal">
                      <button className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-white transition-colors w-full text-left">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}