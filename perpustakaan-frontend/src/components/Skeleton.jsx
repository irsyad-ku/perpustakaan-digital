export default function Skeleton({ rows = 5 }) {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>

      {/* Form skeleton */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={i === 4 || i === 5 ? "col-span-2" : ""}>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-12 bg-blue-800 opacity-60"></div>
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 px-4 py-3 border-b border-gray-100"
          >
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
