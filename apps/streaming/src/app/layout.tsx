import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { ClerkProvider } from '@clerk/nextjs';
import { DatabaseSeeder } from "@/components/DatabaseSeeder";
import { PostHogProvider } from './providers'
import { PageTracker } from '@/components/analytics/PageTracker'
import { Suspense } from 'react'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CSN - Content Streaming Network",
  description: "Discover and stream your favorite movies and TV shows with CSN's freemium streaming platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#dc2626", // red-600
          colorBackground: "#111827", // gray-900
          colorInputBackground: "#1f2937", // gray-800
          colorInputText: "#f9fafb", // gray-50
          colorText: "#f9fafb", // gray-50
          colorTextSecondary: "#d1d5db", // gray-300
        },
        elements: {
          card: "bg-gray-900 border border-gray-700",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-300",
          socialButtonsBlockButton: "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700",
          formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white",
          formFieldInput: "bg-gray-800 border border-gray-700 text-white",
          formFieldLabel: "text-gray-300",
          footerActionLink: "text-red-400 hover:text-red-300",
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
          <PostHogProvider>
            <Suspense fallback={null}>
              <PageTracker />
            </Suspense>
            <ConvexClientProvider>
              <DatabaseSeeder />
              {children}
            </ConvexClientProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
