export function BlogGridSkeleton() {
  return (
    <div className="space-y-12">
      {/* Featured Posts Skeleton */}
      <div>
        <div className="h-8 bg-gray-700 rounded w-48 mb-6 loading-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden h-80">
              <div className="h-2/3 bg-gray-700 loading-pulse"></div>
              <div className="p-4 h-1/3">
                <div className="h-4 bg-gray-700 rounded mb-2 loading-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3 loading-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 loading-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Posts Grid Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-700 rounded w-56 loading-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-24 loading-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden h-64">
              <div className="h-2/3 bg-gray-700 loading-pulse"></div>
              <div className="p-4 h-1/3">
                <div className="h-4 bg-gray-700 rounded mb-2 loading-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3 loading-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 loading-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}