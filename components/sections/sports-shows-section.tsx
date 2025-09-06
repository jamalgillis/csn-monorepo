"use client"

import { Tv } from "lucide-react"
import { useQuery } from "convex/react"
import { SportsCarousel } from "@/components/carousel/sports-carousel"
import { StaggerAnimation } from "@/components/interactive/stagger-animation"
import { api } from "../../convex/_generated/api"

export function SportsShowsSection() {
  const showsAndPodcasts = useQuery(api.sports.getSportsShows)

  if (!showsAndPodcasts) {
    return (
      <StaggerAnimation delay={200}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Tv className="w-6 h-6 mr-3 text-blue-400" />
            Sports Shows & Talk
          </h2>
        </div>
        <div className="flex space-x-4 pb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-none w-80 h-48 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </StaggerAnimation>
    )
  }

  const transformedItems = showsAndPodcasts.map((item: any) => ({
    id: item.id,
    title: item.title,
    subtitle: item.description,
    image: item.thumbnail,
    badge: {
      text: item.badge,
      variant: item.type === "podcast" ? ("podcast" as const) : 
               item.isLive ? ("live" as const) : ("available" as const),
    },
    duration: item.duration,
    category: item.category,
    type: item.type,
  }))

  return (
    <StaggerAnimation delay={200}>
      <SportsCarousel
        title="Sports Shows & Talk"
        items={transformedItems}
        icon={<Tv className="w-6 h-6 mr-3 text-blue-400" />}
      />
    </StaggerAnimation>
  )
}
