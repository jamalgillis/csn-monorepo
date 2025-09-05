import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/dashboard(.*)',
  '/watchlist(.*)',
  '/history(.*)',
  '/subscription(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Check if Clerk environment variables are configured
  const isClerkConfigured = !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.CLERK_SECRET_KEY
  )
  
  // If Clerk is not configured, just continue without authentication checks
  if (!isClerkConfigured) {
    return NextResponse.next()
  }
  
  // If accessing a protected route, require authentication
  if (isProtectedRoute(request)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}