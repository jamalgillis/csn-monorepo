import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const url = new URL(request.url)
  
  // Forward the request to PostHog
  const postHogUrl = `https://us.posthog.com${url.pathname}${url.search}`
  
  const response = await fetch(postHogUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': request.headers.get('user-agent') || '',
    },
    body,
  })

  const responseData = await response.text()
  
  return new Response(responseData, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  
  // Forward the request to PostHog
  const postHogUrl = `https://us.posthog.com${url.pathname}${url.search}`
  
  const response = await fetch(postHogUrl, {
    method: 'GET',
    headers: {
      'User-Agent': request.headers.get('user-agent') || '',
    },
  })

  const responseData = await response.text()
  
  return new Response(responseData, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}