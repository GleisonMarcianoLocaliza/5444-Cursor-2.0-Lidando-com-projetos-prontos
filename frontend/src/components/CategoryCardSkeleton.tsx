export function CategoryCardSkeleton() {
  return (
    <div className="relative bg-neutral-white rounded-lg shadow-elevation-1 overflow-hidden animate-pulse">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-neutral-divisor/20" />

      {/* Content */}
      <div className="relative p-8">
        {/* Icon Skeleton */}
        <div className="w-16 h-16 bg-neutral-divisor rounded-full mb-6" />

        {/* Title Skeleton */}
        <div className="h-6 bg-neutral-divisor rounded w-3/4 mb-3" />

        {/* Description Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-neutral-divisor rounded w-full" />
          <div className="h-4 bg-neutral-divisor rounded w-5/6" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-neutral-divisor rounded w-32" />
          <div className="w-8 h-8 bg-neutral-divisor rounded-full" />
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-divisor/10 rounded-bl-full" />
    </div>
  );
}
