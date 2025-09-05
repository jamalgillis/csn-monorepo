import { Header } from "@/components/navigation/header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 pb-6 border-b border-border">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-10 w-80" />
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Results Count Skeleton */}
        <Skeleton className="h-5 w-48 mb-6" />

        {/* News Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full">
              <div className="aspect-video">
                <Skeleton className="w-full h-full rounded-t-lg" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
