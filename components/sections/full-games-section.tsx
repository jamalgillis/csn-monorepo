import { Film } from "lucide-react"
import { SportsCarousel } from "@/components/carousel/sports-carousel"
import { fullGames } from "@/lib/dummy-data"

const transformedFullGames = fullGames.map((game) => ({
  id: game.id.toString(),
  title: game.title,
  subtitle: game.description,
  image: game.thumbnail,
  badge: {
    text: game.featured ? "FEATURED" : "CLASSIC",
    variant: game.featured ? ("new" as const) : ("available" as const),
  },
  duration: game.duration,
  date: game.date,
}))

export function FullGamesSection() {
  return (
    <SportsCarousel
      title="Full Games & Matches"
      items={transformedFullGames}
      icon={<Film className="w-6 h-6 mr-3 text-purple-400" />}
      className="animate-fade-in"
      style={{ animationDelay: "0.5s" }}
    />
  )
}
