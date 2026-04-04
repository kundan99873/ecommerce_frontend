import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/utils";

interface GrowthMeta {
  change: string;
  changeType: "up" | "down";
}

interface OverviewSectionProps {
  loading: boolean;
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth?: GrowthMeta;
  orderGrowth?: GrowthMeta;
  userGrowth?: GrowthMeta;
  productGrowth?: GrowthMeta;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
  change?: string;
  changeType?: "up" | "down";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card>
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold font-display mt-1">{value}</p>
            )}
            {change && !loading && (
              <div
                className={`flex items-center gap-1 mt-1 text-xs font-medium ${changeType === "up" ? "text-success" : "text-destructive"}`}
              >
                {changeType === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {change} vs last month
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const OverviewSection = ({
  loading,
  totalRevenue,
  totalOrders,
  totalUsers,
  totalProducts,
  revenueGrowth,
  orderGrowth,
  userGrowth,
  productGrowth,
}: OverviewSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={DollarSign}
        loading={loading}
        change={revenueGrowth?.change}
        changeType={revenueGrowth?.changeType}
      />
      <StatCard
        title="Total Orders"
        value={`${totalOrders}`}
        icon={ShoppingCart}
        loading={loading}
        change={orderGrowth?.change}
        changeType={orderGrowth?.changeType}
      />
      <StatCard
        title="Total Users"
        value={`${totalUsers}`}
        icon={Users}
        loading={loading}
        change={userGrowth?.change}
        changeType={userGrowth?.changeType}
      />
      <StatCard
        title="Total Products"
        value={`${totalProducts}`}
        icon={Package}
        loading={loading}
        change={productGrowth?.change}
        changeType={productGrowth?.changeType}
      />
    </div>
  );
};
