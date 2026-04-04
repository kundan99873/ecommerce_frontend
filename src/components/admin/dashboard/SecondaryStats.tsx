import { BarChart3, Activity, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/utils";

interface SecondaryStatsProps {
  loading: boolean;
  avgOrderValue: number;
  conversionRate: string;
  activeCustomers: number;
}

export const SecondaryStats = ({
  loading,
  avgOrderValue,
  conversionRate,
  activeCustomers,
}: SecondaryStatsProps) => {
  const stats = [
    {
      title: "Avg. Order Value",
      value: formatCurrency(avgOrderValue),
      icon: BarChart3,
      delay: 0.1,
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: Activity,
      delay: 0.15,
    },
    {
      title: "Active Customers",
      value: `${activeCustomers}`,
      icon: ArrowUpRight,
      delay: 0.2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
        >
          <Card>
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  {loading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : (
                    <p className="text-lg font-bold">{stat.value}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
