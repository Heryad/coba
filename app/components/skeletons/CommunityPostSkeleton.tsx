'use client'

export default function CommunityPostSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4 animate-pulse">
      {/* User info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div>
          <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-2 bg-gray-200 rounded w-16" />
        </div>
      </div>
      
      {/* Post content */}
      <div className="mb-4">
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
      
      {/* Post images */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[...Array(2)].map((_, index) => (
          <div 
            key={index}
            className="aspect-square rounded-lg bg-gray-200"
          />
        ))}
      </div>
      
      {/* Interactions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-8" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-8" />
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </div>
    </div>
  );
} 