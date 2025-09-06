"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface StaggerAnimationProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function StaggerAnimation({ children, delay = 0, className }: StaggerAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-fade-in")
              entry.target.classList.remove("opacity-0")
            }, delay)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`opacity-0 translate-y-4 transition-all duration-700 ${className}`}>
      {children}
    </div>
  )
}
