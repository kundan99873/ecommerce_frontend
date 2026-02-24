import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="group animate-pulse">
      {/* Image Section */}
      <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary">
        <Skeleton className="h-full w-full" />

        {/* Discount badge skeleton */}
        <Skeleton className="absolute top-3 left-3 h-5 w-10 rounded" />

        {/* Optional stock overlay skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="space-y-2 w-full">
          {/* Product Name */}
          <Skeleton className="h-4 w-3/4 rounded" />

          {/* Category */}
          <Skeleton className="h-3 w-1/2 rounded" />

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="h-8 w-8 rounded-md shrink-0 mt-1" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;