import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left - Image Section */}
        <div className="space-y-3">
          {/* Main image */}
          <Skeleton className="aspect-3/4 w-full rounded-lg" />

          {/* Thumbnails */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-20 rounded-md" />
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col justify-center space-y-4">
          
          {/* Category */}
          <Skeleton className="h-4 w-24" />

          {/* Title */}
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />

          {/* Rating */}
          <Skeleton className="h-4 w-32" />

          {/* Price */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Quantity + Button */}
          <div className="flex items-center gap-4 mt-6">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-12 flex-1 rounded-md" />
          </div>

          {/* Extra sections */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-5 w-5 mx-auto rounded-full" />
                <Skeleton className="h-3 w-16 mx-auto" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;