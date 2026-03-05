import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Back button */}
      <Skeleton className="h-4 w-32 mb-6" />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* IMAGE SECTION */}
        <div className="space-y-3 md:max-w-md lg:max-w-lg mx-auto w-full">
          {/* Main Image */}
          <Skeleton className="aspect-square w-full rounded-lg" />

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-16 h-20 rounded-md shrink-0"
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col justify-center space-y-6">

          {/* Category */}
          <Skeleton className="h-4 w-24" />

          {/* Title */}
          <Skeleton className="h-8 w-3/4" />

          {/* Rating */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Color Section */}
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* Size Section */}
          <div>
            <Skeleton className="h-4 w-12 mb-2" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-14 rounded-md" />
              ))}
            </div>
          </div>

          {/* Quantity + Button */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-12 flex-1 rounded-md" />
          </div>

          {/* Coupon Section */}
          <Skeleton className="h-20 w-full rounded-md" />

          {/* Delivery Section */}
          <Skeleton className="h-16 w-full rounded-md" />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;