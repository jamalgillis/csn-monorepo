'use client'

import { usePostHog } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function usePageTracking() {
  const posthog = usePostHog()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])
}

export { usePostHog }