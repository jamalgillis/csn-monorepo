'use client'

import { usePostHog } from 'posthog-js/react'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export function PostHogTest() {
  const posthog = usePostHog()
  const { user } = useUser()

  useEffect(() => {
    if (posthog && user) {
      // Identify user when authenticated
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.firstName || 'Unknown',
        clerk_user_id: user.id,
      })
    }
  }, [posthog, user])

  const testEvent = () => {
    if (posthog) {
      posthog.capture('test_button_clicked', {
        button_name: 'PostHog Test',
        page: 'test',
        timestamp: new Date().toISOString(),
      })
      console.log('PostHog test event captured')
    } else {
      console.error('PostHog not initialized')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={testEvent}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow-lg text-sm"
      >
        Test PostHog
      </button>
    </div>
  )
}