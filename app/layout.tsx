import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Merriweather } from "next/font/google"
import "./globals.css"
import { ConvexClientProvider } from "./providers/ConvexClientProvider"
import { ClerkProvider } from '@clerk/nextjs'

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

export const metadata: Metadata = {
  title: "CSN Sports - Live Sports, Shows & News",
  description: "Your ultimate destination for live sports streaming, shows, and breaking news",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable} dark`}>
        <body className="antialiased">
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
