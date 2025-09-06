import { Zap, Play } from "lucide-react"
import { gameHighlights } from "@/lib/dummy-data"

// Custom component for highlights with play overlay
function HighlightCard({ item }: { item: any }) {
  return (
    <div className="flex-none w-72">
      <div className="sports-card hover:transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
        <div className="relative">
          <img
            src={item.thumbnail || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-lg opacity-0 hover:opacity-100 transition-opacity">
            <button className="bg-white/90 text-black p-3 rounded-full hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
          {item.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {item.duration}
            </div>
          )}
          {item.views && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {item.views} views
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
          <p className="text-muted-foreground text-sm">{item.description}</p>
          <div className="mt-2">
            <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs">{item.sport}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GameHighlightsSection() {
  return (
    <section className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Zap className="w-6 h-6 mr-3 text-yellow-400" />
          Game Highlights
        </h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium">See All</button>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4">
          {gameHighlights.map((item) => (
            <HighlightCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
