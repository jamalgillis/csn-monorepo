"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { breakingNews } from "@/lib/dummy-data"

export function BreakingNewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % breakingNews.length)
        setIsVisible(true)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-red-600 text-white py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="flex items-center mr-4">
          <AlertCircle className="w-4 h-4 mr-2 animate-pulse" />
          <span className="font-bold text-sm">BREAKING:</span>
        </div>
        <div className={`transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <span className="text-sm">{breakingNews[currentIndex]}</span>
        </div>
      </div>
    </div>
  )
}
