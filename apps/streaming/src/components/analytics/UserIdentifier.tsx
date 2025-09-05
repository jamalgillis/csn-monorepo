'use client'

import { usePostHog } from 'posthog-js/react'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export function UserIdentifier() {
  const posthog = usePostHog()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!posthog || !isLoaded) return

    if (user) {
      // User is authenticated - identify them in PostHog
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.firstName || 'Unknown',
        clerk_user_id: user.id,
        created_at: user.createdAt?.toISOString(),
        last_sign_in_at: user.lastSignInAt?.toISOString(),
        // User engagement properties
        user_type: 'authenticated',
        registration_source: 'direct',
        account_age_days: user.createdAt ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        last_active: new Date().toISOString()
      })

      // Set user properties for engagement tracking
      posthog.setPersonProperties({
        $email: user.primaryEmailAddress?.emailAddress,
        $name: user.fullName || user.firstName || 'Unknown',
        total_sessions: posthog.getFeatureFlag('user_session_count') || 1,
        is_premium: false, // TODO: Update based on user subscription status
        preferred_content_types: [], // TODO: Track based on viewing history
        engagement_level: 'new_user'
      })

      // Track login event
      posthog.capture('user_signed_in', {
        user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        sign_in_timestamp: new Date().toISOString(),
      })
    } else {
      // User is anonymous - reset to anonymous tracking
      posthog.reset()
    }
  }, [posthog, user, isLoaded])

  return null
}