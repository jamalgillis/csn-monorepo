"use client"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isSignedIn } = useUser()

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMuHWia69rDRudwjaLskETVQpItPhKzM6UY0Jv"
                alt="CSN Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <Link href="/" className="text-white hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link
                href="/games"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                Live
              </Link>
              <Link href="/shows" className="text-muted-foreground hover:text-white transition-colors">
                Shows
              </Link>
              <Link
                href="/news/lakers-blockbuster-trade"
                className="text-muted-foreground hover:text-white transition-colors hidden"
              >
                News
              </Link>
              <Link href="/teams/lakers" className="text-muted-foreground hover:text-white transition-colors hidden">
                Teams
              </Link>
              <Link href="/standings" className="text-muted-foreground hover:text-white transition-colors hidden">
                Standings
              </Link>
              <Link href="/schedule" className="text-muted-foreground hover:text-white transition-colors hidden">
                Schedule
              </Link>
            </div>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search..."
                className="bg-gray-800 border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white">
                  {user?.firstName || user?.username || 'User'}
                </span>
                <SignOutButton>
                  <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
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
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden border-t border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100 py-4 pb-6" : "max-h-0 opacity-0 py-0"
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
  )
}
