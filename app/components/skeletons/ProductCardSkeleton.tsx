export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg aspect-h-1 aspect-w-1 w-full h-150"></div>
      <div className="mt-4 flex justify-between">
        <div className="w-2/3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-1/4">
          <div className="h-4 bg-gray-200 rounded mb-2 ml-auto w-full"></div>
          <div className="flex items-center justify-end">
            <div className="h-3 w-3 bg-gray-200 rounded-full mr-1"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 