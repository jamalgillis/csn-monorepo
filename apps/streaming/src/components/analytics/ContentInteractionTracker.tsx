'use client'

import { usePostHog } from 'posthog-js/react'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

interface ContentInteractionTrackerProps {
  contentId: string
  contentTitle: string
  contentType: string
  viewStartTime?: number
}

export function ContentInteractionTracker({ 
  contentId, 
  contentTitle, 
  contentType,
  viewStartTime = Date.now()
}: ContentInteractionTrackerProps) {
  const posthog = usePostHog()
  const { user } = useUser()

  useEffect(() => {
    if (!posthog) return

    // Track content view started
    posthog.capture('content_view_started', {
      content_id: contentId,
      content_title: contentTitle,
      content_type: contentType,
      user_id: user?.id || 'anonymous',
      view_start_timestamp: new Date(viewStartTime).toISOString(),
      page_url: window.location.href
    })

    // Track 30 second engagement
    const engagementTimer = setTimeout(() => {
      posthog.capture('content_engaged_30s', {
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        user_id: user?.id || 'anonymous',
        engagement_duration_seconds: 30
      })
    }, 30000)

    // Track 2 minute deep engagement
    const deepEngagementTimer = setTimeout(() => {
      posthog.capture('content_deep_engagement', {
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        user_id: user?.id || 'anonymous',
        engagement_duration_seconds: 120
      })
    }, 120000)

    // Cleanup and track view end on unmount
    return () => {
      clearTimeout(engagementTimer)
      clearTimeout(deepEngagementTimer)
      
      const viewDuration = (Date.now() - viewStartTime) / 1000
      posthog.capture('content_view_ended', {
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        user_id: user?.id || 'anonymous',
        view_duration_seconds: Math.round(viewDuration),
        view_end_timestamp: new Date().toISOString()
      })
    }
  }, [posthog, contentId, contentTitle, contentType, user?.id, viewStartTime])

  return null
}