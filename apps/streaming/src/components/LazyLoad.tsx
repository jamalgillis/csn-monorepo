"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyLoad({
  children,
  fallback = <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg" />,
  rootMargin = "50px",
  threshold = 0.1,
  className = "",
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={ref} className={className}>
      {isVisible || hasLoaded ? children : fallback}
    </div>
  );
}