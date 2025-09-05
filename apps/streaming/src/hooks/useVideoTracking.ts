'use client'

import { usePostHog } from 'posthog-js/react'
import { useUser } from '@clerk/nextjs'
import { useRef, useCallback } from 'react'

interface VideoTrackingProps {
  contentId: string
  contentTitle: string
  contentType: string
  videoUrl: string
  isTrailer?: boolean
}

export function useVideoTracking({
  contentId,
  contentTitle,
  contentType,
  videoUrl,
  isTrailer = false
}: VideoTrackingProps) {
  const posthog = usePostHog()
  const { user } = useUser()
  const sessionRef = useRef<string | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)
  const lastProgressRef = useRef<number>(0)

  const trackVideoEvent = useCallback((event: string, properties: Record<string, unknown> = {}) => {
    if (!posthog) return

    const baseProperties = {
      content_id: contentId,
      content_title: contentTitle,
      content_type: contentType,
      video_url: videoUrl,
      is_trailer: isTrailer,
      user_id: user?.id || 'anonymous',
      session_id: sessionRef.current,
      timestamp: new Date().toISOString(),
      ...properties
    }

    posthog.capture(event, baseProperties)
  }, [posthog, contentId, contentTitle, contentType, videoUrl, isTrailer, user?.id])

  const trackVideoStart = useCallback((duration: number) => {
    sessionRef.current = `${contentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    startTimeRef.current = Date.now()
    lastProgressRef.current = 0

    trackVideoEvent('video_playback_started', {
      video_duration: duration
    })
  }, [trackVideoEvent, contentId])

  const trackVideoProgress = useCallback((currentTime: number, duration: number) => {
    if (!duration || duration === 0) return

    const progress = Math.round((currentTime / duration) * 100)
    const progressMilestones = [25, 50, 75, 90]
    
    for (const milestone of progressMilestones) {
      if (progress >= milestone && lastProgressRef.current < milestone) {
        trackVideoEvent('video_progress', {
          progress_percent: milestone,
          current_time: currentTime,
          video_duration: duration,
          watch_time_seconds: Math.round(currentTime)
        })
        lastProgressRef.current = milestone
        break
      }
    }
  }, [trackVideoEvent])

  const trackVideoEnd = useCallback((currentTime: number, duration: number, wasCompleted: boolean = false) => {
    const watchDuration = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0
    const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0

    trackVideoEvent('video_playback_ended', {
      current_time: currentTime,
      video_duration: duration,
      progress_percent: progress,
      watch_duration_seconds: Math.round(watchDuration),
      completed: wasCompleted || progress >= 90,
      exit_point: currentTime
    })
  }, [trackVideoEvent])

  const trackVideoPause = useCallback((currentTime: number, duration: number) => {
    const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0
    
    trackVideoEvent('video_paused', {
      current_time: currentTime,
      video_duration: duration,
      progress_percent: progress
    })
  }, [trackVideoEvent])

  const trackVideoResume = useCallback((currentTime: number, duration: number) => {
    const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0
    
    trackVideoEvent('video_resumed', {
      current_time: currentTime,
      video_duration: duration,
      progress_percent: progress
    })
  }, [trackVideoEvent])

  return {
    trackVideoStart,
    trackVideoProgress,
    trackVideoEnd,
    trackVideoPause,
    trackVideoResume,
    trackVideoEvent
  }
}