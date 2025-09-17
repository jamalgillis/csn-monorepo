"use client"

import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarKeyboardHandler() {
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+B (Mac) or Ctrl+B (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault()
        toggleSidebar()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggleSidebar])

  // This component doesn't render anything
  return null
}