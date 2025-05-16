export default function OfferSkeleton() {
  return (
    <div className="bg-gray-100 rounded-3xl p-8 lg:p-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="bg-gray-200 p-6 rounded-xl inline-block h-16 w-48"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-40 ml-6"></div>
        </div>
        <div className="h-[400px] bg-gray-200 rounded-3xl"></div>
      </div>
    </div>
  );
} 