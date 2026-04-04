import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderStatus {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

interface OrderStatusCardProps {
  loading: boolean;
  data: OrderStatus[];
  statusColor?: Record<string, string>;
}

const defaultStatusColor: Record<string, string> = {
  PENDING: "hsl(var(--secondary-foreground))",
  PROCESSING: "hsl(var(--primary))",
  PACKED: "hsl(var(--primary))",
  SHIPPED: "hsl(var(--primary))",
  OUT_FOR_DELIVERY: "hsl(var(--accent-foreground))",
  DELIVERED: "hsl(var(--success))",
  CANCELLED: "hsl(var(--destructive))",
};

export const OrderStatusCard = ({
  loading,
  data,
  statusColor = defaultStatusColor,
}: OrderStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No order status data available for the selected range.
          </p>
        ) : (
          data.map((item) => (
            <div key={item.status} className="space-y-1.5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.count} ({item.percentage.toFixed(2)}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor:
                      statusColor[item.status] ||
                      "hsl(var(--muted-foreground))",
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
