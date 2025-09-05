'use client'

import { usePageTracking } from '@/hooks/usePostHog'

export function PageTracker() {
  usePageTracking()
  return null
}