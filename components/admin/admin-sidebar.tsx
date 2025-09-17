"use client"

import { usePathname } from "next/navigation"
import { 
  Home, 
  Play, 
  Calendar, 
  Tv, 
  Newspaper, 
  Image, 
  Users, 
  Shield, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Settings 
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Navigation items organized by groups according to the story specification
const navigationGroups = [
  {
    label: "Live Operations",
    items: [
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
        title: "Schedule",
        href: "/admin/schedule",
        icon: Calendar,
      },
    ],
  },
  {
    label: "Content Management",
    items: [
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
        title: "Media",
        href: "/admin/media",
        icon: Image,
      },
    ],
  },
  {
    label: "User & Teams",
    items: [
      {
        title: "Teams",
        href: "/admin/teams",
        icon: Users,
      },
      {
        title: "User Management",
        href: "/admin/users",
        icon: Shield,
      },
      {
        title: "Chat Moderation",
        href: "/admin/chat",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Analytics & System",
    items: [
      {
        title: "Statistics",
        href: "/admin/stats",
        icon: BarChart3,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: TrendingUp,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}