"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SidebarKeyboardHandler } from "@/components/admin/sidebar-keyboard-handler"

interface AdminSidebarProviderProps {
  children: React.ReactNode
}

export function AdminSidebarProvider({ children }: AdminSidebarProviderProps) {
  return (
    <SidebarProvider>
      <SidebarKeyboardHandler />
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}