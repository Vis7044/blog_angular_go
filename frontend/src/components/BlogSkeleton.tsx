'use client'

export const BlogSkeleton = () => {
  // Create placeholders (e.g., 6 skeleton cards)
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="grid sm:grid-rows-2 lg:grid-rows-3 gap-8 animate-pulse">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="flex flex-col border border-gray-200 bg-white rounded-2xl shadow-sm"
        >
          {/* Image Skeleton */}
          <div className="h-56 md:h-60 rounded-t-2xl bg-gray-200" />

          {/* Content Skeleton */}
          <div className="flex flex-col justify-between p-5 flex-grow">
            <div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>

            {/* Footer Skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-5">
              <div className="flex items-center gap-4">
                <div className="h-4 w-10 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
