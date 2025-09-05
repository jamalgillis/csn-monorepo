import { Header } from "@/components/navigation/header"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GamesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border mb-8 pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Skeleton className="h-10 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-0">
                <Skeleton className="aspect-video w-full rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-8" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="w-6 h-6 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
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
