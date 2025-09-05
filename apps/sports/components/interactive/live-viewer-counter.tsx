"use client"

import { useState, useEffect } from "react"

interface LiveViewerCounterProps {
  initialCount: number
  className?: string
}

export function LiveViewerCounter({ initialCount, className }: LiveViewerCounterProps) {
  const [viewerCount, setViewerCount] = useState(initialCount)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live viewer count changes
      const change = Math.floor(Math.random() * 200) - 100
      setViewerCount((prev) => Math.max(1000, prev + change))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return <span className={className}>{viewerCount.toLocaleString()} viewers</span>
}
