// app/providers.tsx
'use client'

import { useEffect } from "react"
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: '/ingest', // Use proxy route for better performance and privacy
        ui_host: 'https://us.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, // We'll manually capture pageviews
        capture_pageleave: true,
        debug: process.env.NODE_ENV === 'development',
        loaded: () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog loaded successfully')
          }
        }
      })
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
