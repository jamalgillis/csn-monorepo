import type React from "react"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminAuthWrapper } from "@/components/admin/admin-auth-wrapper"
import { AdminSidebarProvider } from "@/components/admin/admin-sidebar-provider"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <AdminAuthWrapper>
      <AdminSidebarProvider>
        {children}
      </AdminSidebarProvider>
    </AdminAuthWrapper>
  )
}
