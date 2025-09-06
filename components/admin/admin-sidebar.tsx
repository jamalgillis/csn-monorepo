import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Play, Tv, Newspaper, Users, BarChart3, Calendar, MessageSquare, Settings, Shield } from "lucide-react"
import Link from "next/link"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Live Games",
    href: "/admin/games",
    icon: Play,
  },
  {
    title: "Shows",
    href: "/admin/shows",
    icon: Tv,
  },
  {
    title: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Teams",
    href: "/admin/teams",
    icon: Users,
  },
  {
    title: "Statistics",
    href: "/admin/stats",
    icon: BarChart3,
  },
  {
    title: "Schedule",
    href: "/admin/schedule",
    icon: Calendar,
  },
  {
    title: "Chat Moderation",
    href: "/admin/chat",
    icon: MessageSquare,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  return (
    <div className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-3">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", "hover:bg-accent hover:text-accent-foreground")}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
