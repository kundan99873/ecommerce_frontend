import { Skeleton } from "@/components/ui/skeleton";

const OrderDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse">
      {/* Back button */}
      <Skeleton className="h-4 w-28 mb-6" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Tracking */}
      <div className="mb-8">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-6 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          <Skeleton className="h-5 w-24 mb-2" />

          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-lg p-4">
              <div className="flex gap-3">
                <Skeleton className="h-20 w-16 rounded" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-28 mt-2 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-card border rounded-lg p-5 space-y-3">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Shipping */}
          <div className="bg-card border rounded-lg p-5 space-y-2">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailSkeleton;
