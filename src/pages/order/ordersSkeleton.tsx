import { Skeleton } from "@/components/ui/skeleton";

const OrderSkeleton = () => {
  return (
    <div className="bg-card border rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {[1, 2].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <Skeleton className="h-14 w-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSkeleton;
