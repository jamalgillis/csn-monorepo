import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl
  
  // Define public routes
  const publicRoutes = [
    '/',
    '/games',
    '/shows', 
    '/podcasts',
  ]
  
  // Check if it's a sign-in/sign-up page
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return
  }
  
  // Check if it's an API route
  if (pathname.startsWith('/api/')) {
    return
  }
  
  // Check if it's exactly a public route (not a sub-route)
  if (publicRoutes.includes(pathname)) {
    return
  }
  
  // All other routes require authentication
  await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}