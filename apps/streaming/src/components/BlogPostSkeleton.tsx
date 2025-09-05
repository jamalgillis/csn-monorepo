export function BlogPostSkeleton() {
  return (
    <article className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* Back Link Skeleton */}
      <div className="p-6 border-b border-gray-700">
        <div className="h-5 bg-gray-700 rounded w-32 loading-pulse"></div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="h-64 md:h-96 bg-gray-700 loading-pulse"></div>

      <div className="p-6 md:p-8">
        {/* Header Skeleton */}
        <header className="mb-8">
          <div className="h-10 bg-gray-700 rounded mb-6 loading-pulse"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-6 loading-pulse"></div>

          {/* Meta Skeleton */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="h-5 bg-gray-700 rounded w-24 loading-pulse"></div>
            <div className="h-5 bg-gray-700 rounded w-32 loading-pulse"></div>
            <div className="h-5 bg-gray-700 rounded w-20 loading-pulse"></div>
            <div className="h-5 bg-gray-700 rounded w-28 loading-pulse"></div>
          </div>

          {/* Excerpt Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-5 bg-gray-700 rounded loading-pulse"></div>
            <div className="h-5 bg-gray-700 rounded w-4/5 loading-pulse"></div>
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-6 bg-gray-700 rounded-full w-16 loading-pulse"></div>
            <div className="h-6 bg-gray-700 rounded-full w-20 loading-pulse"></div>
            <div className="h-6 bg-gray-700 rounded-full w-18 loading-pulse"></div>
          </div>

          {/* Share Button Skeleton */}
          <div className="pt-6 border-t border-gray-700">
            <div className="h-10 bg-gray-700 rounded w-32 loading-pulse"></div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="space-y-4 mb-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-700 rounded loading-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-11/12 loading-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5 loading-pulse"></div>
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <footer className="pt-8 border-t border-gray-700">
          {/* Author Bio Skeleton */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full loading-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-700 rounded w-32 mb-2 loading-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-48 loading-pulse"></div>
              </div>
            </div>
          </div>

          {/* Related Articles Button Skeleton */}
          <div className="text-center">
            <div className="h-12 bg-gray-700 rounded w-40 mx-auto loading-pulse"></div>
          </div>
        </footer>
      </div>
    </article>
  );
}