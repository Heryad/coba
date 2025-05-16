export default function HeroSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center animate-pulse">
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-1/2"></div>
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-40 mt-4"></div>
      </div>
      <div className="h-[500px] bg-gray-200 rounded-3xl"></div>
    </div>
  );
} 