import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/utils";
import dayjs from "dayjs";

interface Order {
  order_number: string;
  order_date: string;
  status: string;
  final_amount: number;
}

interface RecentOrdersCardProps {
  loading: boolean;
  orders: Order[];
  statusColor?: Record<string, string>;
}

const defaultStatusColor: Record<string, string> = {
  PENDING: "bg-secondary text-secondary-foreground",
  PROCESSING: "bg-primary/80 text-primary-foreground",
  PACKED: "bg-primary text-primary-foreground",
  SHIPPED: "bg-primary text-primary-foreground",
  OUT_FOR_DELIVERY: "bg-primary/70 text-primary-foreground",
  DELIVERED: "bg-success text-success-foreground",
  CANCELLED: "bg-destructive text-destructive-foreground",
};

const formatOrderStatusLabel = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const RecentOrdersCard = ({
  loading,
  orders,
  statusColor = defaultStatusColor,
}: RecentOrdersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full mb-2" />
          ))
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No recent orders available for the selected range.
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.order_number}
                className="flex flex-col gap-3 border-b py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {dayjs(o.order_date).format("DD MMM YYYY, hh:mm A")}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <Badge
                    className={
                      statusColor[o.status.toUpperCase()] ||
                      "bg-secondary text-secondary-foreground"
                    }
                  >
                    {formatOrderStatusLabel(o.status)}
                  </Badge>
                  <p className="text-sm font-bold">
                    {formatCurrency(o.final_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
