export function CarCardSkeleton() {
  return (
    <div className="group relative bg-neutral-white rounded-lg shadow-elevation-1 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-neutral-divisor" />

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-neutral-divisor rounded w-3/4 mb-2" />

        {/* Subtitle Skeleton */}
        <div className="h-4 bg-neutral-divisor rounded w-1/2 mb-4" />

        {/* Price Section Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-divisor">
          <div>
            <div className="h-3 bg-neutral-divisor rounded w-16 mb-2" />
            <div className="h-6 bg-neutral-divisor rounded w-24" />
          </div>
          <div className="h-10 bg-neutral-divisor rounded w-20" />
        </div>
      </div>
    </div>
  );
}
