import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="group h-full animate-pulse">
      <div className="h-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="relative aspect-4/5 overflow-hidden bg-secondary">
          <Skeleton className="h-full w-full" />
          <Skeleton className="absolute top-3 left-3 h-6 w-20 rounded-full" />
          <Skeleton className="absolute top-3 right-3 h-8 w-8 rounded-full" />
          <Skeleton className="absolute left-3 bottom-3 h-6 w-20 rounded-full" />
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 w-3/5 rounded" />
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-4 w-14 rounded" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-18 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
