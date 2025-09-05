import { Newspaper, Shuffle, HeartPulse, Users, BellIcon as Whistle, ZapIcon } from "lucide-react"

const newsCategories = {
  breaking: {
    label: "BREAKING",
    icon: <Newspaper className="w-4 h-4" />,
    color: "text-red-400",
  },
  trade: {
    label: "TRADE RUMORS",
    icon: <Shuffle className="w-4 h-4" />,
    color: "text-blue-400",
  },
  injury: {
    label: "INJURY UPDATE",
    icon: <HeartPulse className="w-4 h-4" />,
    color: "text-red-400",
  },
  draft: {
    label: "DRAFT ANALYSIS",
    icon: <Users className="w-4 h-4" />,
    color: "text-green-400",
  },
  coaching: {
    label: "COACHING",
    icon: <Whistle className="w-4 h-4" />,
    color: "text-purple-400",
  },
  fantasy: {
    label: "FANTASY",
    icon: <ZapIcon className="w-4 h-4" />,
    color: "text-cyan-400",
  },
}

export function SportsNewsSection() {
  return (
    <section className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Newspaper className="w-6 h-6 mr-3 text-orange-400" />
          Sports News & Analysis
        </h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium">See All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
        {/* Breaking News - Large Card (spans 2x2) */}
        <div className="lg:col-span-2 lg:row-span-2 sports-card card-hover-lift p-6 border-2 border-red-600/20 animate-pulse-border">
          <div className="flex items-center mb-3">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold mr-2">BREAKING</span>
            <span className="text-gray-400 text-sm">2 mins ago</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Lakers Trade for All-Star Point Guard</h3>
          <p className="text-gray-300 mb-4">
            Los Angeles Lakers have completed a blockbuster trade to acquire Russell Westbrook in exchange for multiple
            players and draft picks. The move signals their championship ambitions for the upcoming season.
          </p>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors">
            Read Full Story
          </button>
        </div>

        {/* Trade Rumors */}
        <div className="sports-card card-hover-lift p-4">
          <div className="flex items-center mb-2">
            <Shuffle className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-400 text-sm font-medium">TRADE RUMORS</span>
          </div>
          <h4 className="font-semibold mb-2">NBA Trade Deadline Buzz</h4>
          <p className="text-gray-400 text-sm">Multiple teams eyeing veteran stars...</p>
        </div>

        {/* Injury Update */}
        <div className="sports-card card-hover-lift p-4">
          <div className="flex items-center mb-2">
            <HeartPulse className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-red-400 text-sm font-medium">INJURY UPDATE</span>
          </div>
          <h4 className="font-semibold mb-2">Mahomes Cleared for Sunday</h4>
          <p className="text-gray-400 text-sm">Chiefs QB passes concussion protocol...</p>
        </div>

        {/* MVP Race - Tall Card */}
        <div className="lg:row-span-2 sports-card card-hover-lift p-4">
          <div className="flex items-center mb-3">
            <ZapIcon className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-yellow-400 text-sm font-medium">MVP RACE</span>
          </div>
          <h4 className="font-semibold mb-3">2024 MVP Candidates</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Nikola Jokić</span>
              <span className="text-yellow-400 text-sm">+120</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Luka Dončić</span>
              <span className="text-yellow-400 text-sm">+180</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Jayson Tatum</span>
              <span className="text-yellow-400 text-sm">+250</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Giannis</span>
              <span className="text-yellow-400 text-sm">+300</span>
            </div>
          </div>
        </div>

        {/* Draft Analysis */}
        <div className="sports-card card-hover-lift p-4">
          <div className="flex items-center mb-2">
            <Users className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-green-400 text-sm font-medium">DRAFT ANALYSIS</span>
          </div>
          <h4 className="font-semibold mb-2">2024 Draft Prospects</h4>
          <p className="text-gray-400 text-sm">Top college players to watch...</p>
        </div>

        {/* Coaching News */}
        <div className="sports-card card-hover-lift p-4">
          <div className="flex items-center mb-2">
            <Whistle className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-purple-400 text-sm font-medium">COACHING</span>
          </div>
          <h4 className="font-semibold mb-2">Coaches on Hot Seat</h4>
          <p className="text-gray-400 text-sm">Several coaches face pressure...</p>
        </div>

        {/* Fantasy Tips */}
        <div className="sports-card card-hover-lift p-4">
          <div className="flex items-center mb-2">
            <ZapIcon className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-cyan-400 text-sm font-medium">FANTASY</span>
          </div>
          <h4 className="font-semibold mb-2">Week 12 Sleepers</h4>
          <p className="text-gray-400 text-sm">Under-the-radar fantasy picks...</p>
        </div>

        {/* Standings - Wide Card */}
        <div className="lg:col-span-2 sports-card card-hover-lift p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <ZapIcon className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">STANDINGS</span>
            </div>
            <span className="text-gray-400 text-xs">Updated 5 mins ago</span>
          </div>
          <h4 className="font-semibold mb-3">AFC East Updated</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Buffalo Bills</span>
              <span className="text-green-400">11-3</span>
            </div>
            <div className="flex justify-between">
              <span>Miami Dolphins</span>
              <span>8-6</span>
            </div>
            <div className="flex justify-between">
              <span>New York Jets</span>
              <span>7-7</span>
            </div>
            <div className="flex justify-between">
              <span>New England</span>
              <span>4-10</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
