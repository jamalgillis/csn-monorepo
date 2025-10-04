'use client'

import type React from "react"
import { useEffect, Suspense } from "react"
import { Inter, JetBrains_Mono, Merriweather } from "next/font/google"
import "./globals.css"
import { ConvexClientProvider } from "./providers/ConvexClientProvider"
import { ClerkProvider } from '@clerk/nextjs'
import { PostHogProvider, PostHogPageView } from "./providers/PostHogProvider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    document.title = "CSN Sports - Live Sports, Shows & News"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', 'Your ultimate destination for live sports streaming, shows, and breaking news')
    } else {
      const newMeta = document.createElement('meta')
      newMeta.name = 'description'
      newMeta.content = 'Your ultimate destination for live sports streaming, shows, and breaking news'
      document.head.appendChild(newMeta)
    }
  }, [])

  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable} dark`}>
        <body className="antialiased">
          <PostHogProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
