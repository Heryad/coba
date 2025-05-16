'use client'

export default function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery Skeleton */}
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Thumbnail Column/Row */}
          <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index}
                className="min-w-[5rem] w-20 h-20 rounded-xl bg-gray-200"
              />
            ))}
          </div>
          
          {/* Main Image */}
          <div className="w-full relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl bg-gray-200" />
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col">
          {/* Title */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          
          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-4 bg-gray-200 rounded-full mx-0.5" />
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          
          {/* Price */}
          <div className="mt-6 flex items-center gap-2">
            <div className="h-6 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          
          {/* Colors */}
          <div className="mt-8">
            <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
          
          {/* Sizes */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mt-8">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
            <div className="flex items-center border border-gray-200 rounded-lg w-32 h-12 bg-gray-200" />
          </div>
          
          {/* Add to Cart Button */}
          <div className="mt-8 h-12 bg-gray-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}