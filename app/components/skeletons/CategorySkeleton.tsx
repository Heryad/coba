export default function CategorySkeleton() {
  return (
    <div className="relative h-[300px] rounded-3xl overflow-hidden bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-transparent p-6 flex flex-col justify-end">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/5"></div>
      </div>
    </div>
  );
} 