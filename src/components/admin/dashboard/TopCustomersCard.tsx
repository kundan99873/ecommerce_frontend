import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/utils";

interface Customer {
  id: string;
  name: string;
  orders: number;
  spent: number;
}

interface TopCustomersCardProps {
  loading: boolean;
  customers: Customer[];
}

export const TopCustomersCard = ({
  loading,
  customers,
}: TopCustomersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display">Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {customers.map((u, i) => (
              <motion.div
                key={u.id}
                className="text-center p-4 rounded-lg bg-muted/50 border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="h-10 w-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary mb-2">
                  {u.name.charAt(0)}
                </div>
                <p className="text-sm font-medium truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground">
                  {u.orders} orders
                </p>
                <p className="text-sm font-bold mt-1">
                  {formatCurrency(u.spent)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
