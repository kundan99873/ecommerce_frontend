import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  BarChart3,
  Activity,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDashboardStats, mockUsers } from "@/data/adminData";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import {
  useGetAdminDashboardHome,
  useGetAdminLowStockProducts,
  useGetAdminOrderStatusSummary,
  useGetAdminRecentOrders,
  useGetAdminRevenueTimeline,
  useGetAdminSalesByCategory,
} from "@/services/admin/dashboard.query";
import type { RevenueGroupBy } from "@/services/admin/dashboard.types";
import { formatCurrency } from "@/utils/utils";
import dayjs from "dayjs";

const COLORS = ["#e99b33", "#9f1f24", "#32b765", "#ea9226", "#d5d1ca"];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
};

const chartColors = {
  revenueStroke: "#e99b33",
  revenueFillTop: "rgba(233, 155, 51, 0.45)",
  revenueFillBottom: "rgba(233, 155, 51, 0.08)",
  visitors: "#7f7b76",
  conversions: "#e99b33",
};

const conversionData = [
  { day: "Mon", visitors: 1200, conversions: 48 },
  { day: "Tue", visitors: 1400, conversions: 63 },
  { day: "Wed", visitors: 1100, conversions: 41 },
  { day: "Thu", visitors: 1600, conversions: 72 },
  { day: "Fri", visitors: 1900, conversions: 95 },
  { day: "Sat", visitors: 2200, conversions: 110 },
  { day: "Sun", visitors: 1800, conversions: 81 },
];

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
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
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

const Dashboard = () => {
  const toDateInputValue = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };

  const today = useMemo(() => new Date(), []);
  const firstDayOfMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  );

  const [fromDate, setFromDate] = useState<string>(
    toDateInputValue(firstDayOfMonth),
  );
  const [toDate, setToDate] = useState<string>(toDateInputValue(today));
  const [revenueGroupBy, setRevenueGroupBy] = useState<RevenueGroupBy>("week");

  const dashboardQueryParams = useMemo(() => {
    if (!fromDate && !toDate) return undefined;

    const from = fromDate
      ? new Date(`${fromDate}T00:00:00.000Z`).toISOString()
      : undefined;
    const to = toDate
      ? new Date(`${toDate}T23:59:59.999Z`).toISOString()
      : undefined;

    return { from, to };
  }, [fromDate, toDate]);

  const {
    data: dashboardResponse,
    isLoading,
    isFetching,
  } = useGetAdminDashboardHome(dashboardQueryParams);
  const {
    data: revenueTimelineResponse,
    isLoading: isRevenueLoading,
    isFetching: isRevenueFetching,
  } = useGetAdminRevenueTimeline({
    ...dashboardQueryParams,
    group_by: revenueGroupBy,
  });
  const {
    data: salesByCategoryResponse,
    isLoading: isSalesByCategoryLoading,
    isFetching: isSalesByCategoryFetching,
  } = useGetAdminSalesByCategory(dashboardQueryParams);
  const {
    data: orderStatusResponse,
    isLoading: isOrderStatusLoading,
    isFetching: isOrderStatusFetching,
  } = useGetAdminOrderStatusSummary(dashboardQueryParams);
  const {
    data: recentOrdersResponse,
    isLoading: isRecentOrdersLoading,
    isFetching: isRecentOrdersFetching,
  } = useGetAdminRecentOrders({
    ...dashboardQueryParams,
    limit: 5,
  });
  const {
    data: lowStockResponse,
    isLoading: isLowStockLoading,
    isFetching: isLowStockFetching,
  } = useGetAdminLowStockProducts({
    limit: 5,
    stock_type: "all",
  });

  const loading = isLoading || isFetching;
  const revenueLoading = isRevenueLoading || isRevenueFetching;
  const salesByCategoryLoading =
    isSalesByCategoryLoading || isSalesByCategoryFetching;
  const orderStatusLoading = isOrderStatusLoading || isOrderStatusFetching;
  const recentOrdersLoading = isRecentOrdersLoading || isRecentOrdersFetching;
  const lowStockLoading = isLowStockLoading || isLowStockFetching;
  const stats = getDashboardStats();

  const summary = dashboardResponse?.data?.summary;
  const growth = dashboardResponse?.data?.growth_vs_previous_period;
  const revenueSeries = revenueTimelineResponse?.data?.series ?? [];
  const categorySeries = salesByCategoryResponse?.data?.categories ?? [];
  const orderStatusSeries = orderStatusResponse?.data?.statuses ?? [];
  const recentOrders = recentOrdersResponse?.data?.orders ?? [];
  const lowStockProducts = lowStockResponse?.data?.products ?? [];

  const getGrowthMeta = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return undefined;
    }

    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    const absolute = Math.abs(value);
    const formatted = Number.isInteger(absolute)
      ? `${absolute}`
      : absolute
          .toFixed(2)
          .replace(/\.0+$/, "")
          .replace(/(\.\d*[1-9])0+$/, "$1");

    return {
      change: `${sign}${formatted}%`,
      changeType: (value >= 0 ? "up" : "down") as const,
    };
  };

  const statusColor: Record<string, string> = {
    PENDING: "bg-secondary text-secondary-foreground",
    PROCESSING: "bg-primary/80 text-primary-foreground",
    PACKED: "bg-primary text-primary-foreground",
    SHIPPED: "bg-primary text-primary-foreground",
    OUT_FOR_DELIVERY: "bg-primary/70 text-primary-foreground",
    DELIVERED: "bg-success text-success-foreground",
    CANCELLED: "bg-destructive text-destructive-foreground",
  };

  const orderStatusBarColor: Record<string, string> = {
    PENDING: "hsl(var(--secondary-foreground))",
    PROCESSING: "hsl(var(--primary))",
    PACKED: "hsl(var(--primary))",
    SHIPPED: "hsl(var(--primary))",
    OUT_FOR_DELIVERY: "hsl(var(--accent-foreground))",
    DELIVERED: "hsl(var(--success))",
    CANCELLED: "hsl(var(--destructive))",
  };

  const formatOrderStatusLabel = (status: string) =>
    status
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const avgOrderValue = summary
    ? summary.avg_order_value
    : stats.totalRevenue / (stats.totalOrders || 1);

  const fallbackConversionRate = (
    (conversionData.reduce((s, d) => s + d.conversions, 0) /
      conversionData.reduce((s, d) => s + d.visitors, 0)) *
    100
  ).toFixed(1);

  const conversionRate =
    summary?.conversion_rate !== undefined && summary?.conversion_rate !== null
      ? summary.conversion_rate.toFixed(2)
      : fallbackConversionRate;

  const revenueGrowth = getGrowthMeta(growth?.total_revenue);
  const orderGrowth = getGrowthMeta(growth?.total_orders);
  const userGrowth = getGrowthMeta(growth?.total_users);
  const productGrowth = getGrowthMeta(growth?.total_products);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your store performance
          </p>
        </div>

        <div className="w-full lg:w-auto rounded-xl border bg-card p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
            <CalendarDays className="h-4 w-4" /> Date range filter
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9"
              max={toDate || undefined}
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9"
              min={fromDate || undefined}
            />
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                setFromDate(toDateInputValue(firstDayOfMonth));
                setToDate(toDateInputValue(today));
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary?.total_revenue ?? 0)}
          icon={DollarSign}
          loading={loading}
          change={revenueGrowth?.change}
          changeType={revenueGrowth?.changeType}
        />
        <StatCard
          title="Total Orders"
          value={`${summary?.total_orders ?? 0}`}
          icon={ShoppingCart}
          loading={loading}
          change={orderGrowth?.change}
          changeType={orderGrowth?.changeType}
        />
        <StatCard
          title="Total Users"
          value={`${summary?.total_users ?? 0}`}
          icon={Users}
          loading={loading}
          change={userGrowth?.change}
          changeType={userGrowth?.changeType}
        />
        <StatCard
          title="Total Products"
          value={`${summary?.total_products ?? 0}`}
          icon={Package}
          loading={loading}
          change={productGrowth?.change}
          changeType={productGrowth?.changeType}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Avg. Order Value
                  </p>
                  {loading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : (
                    <p className="text-lg font-bold">
                      {formatCurrency(avgOrderValue)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Conversion Rate
                  </p>
                  {loading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : (
                    <p className="text-lg font-bold">{conversionRate}%</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Active Customers
                  </p>
                  {loading ? (
                    <Skeleton className="h-6 w-16 mt-1" />
                  ) : (
                    <p className="text-lg font-bold">
                      {summary?.active_customers ??
                        mockUsers.filter((u) => u.status === "active").length}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-lg font-display">
              Revenue Timeline
            </CardTitle>
            <Select
              value={revenueGroupBy}
              onValueChange={(value) =>
                setRevenueGroupBy(value as RevenueGroupBy)
              }
            >
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : revenueSeries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No revenue data available for the selected range.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartColors.revenueFillTop}
                        stopOpacity={1}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColors.revenueFillBottom}
                        stopOpacity={1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="key"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    tickFormatter={(v) => formatCurrency(v)}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload as
                        | { label?: string }
                        | undefined;
                      return item?.label || "";
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={chartColors.revenueStroke}
                    fill="url(#revenueGrad)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Top Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              : stats?.topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">
                      #{i + 1}
                    </span>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.reviews} reviews
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {formatCurrency(p.price)}
                    </p>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors & Conversions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Weekly Visitors & Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={conversionData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="visitors"
                    fill={chartColors.visitors}
                    radius={[4, 4, 0, 0]}
                    name="Visitors"
                    opacity={0.9}
                  />
                  <Bar
                    dataKey="conversions"
                    fill={chartColors.conversions}
                    radius={[4, 4, 0, 0]}
                    name="Conversions"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesByCategoryLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : categorySeries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No category sales data available for the selected range.
              </p>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={categorySeries}
                      dataKey="percentage"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {categorySeries.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {categorySeries.map((item) => (
                    <div key={item.category_id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">
                          {item.percentage}%
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderStatusLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))
            ) : orderStatusSeries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No order status data available for the selected range.
              </p>
            ) : (
              orderStatusSeries.map((item) => {
                return (
                  <div key={item.status} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
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
                            orderStatusBarColor[item.status] ||
                            "hsl(var(--muted-foreground))",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrdersLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full mb-2" />
              ))
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No recent orders available for the selected range.
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div
                    key={o.order_number}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{o.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {dayjs(o.order_date).format("DD MMM YYYY, hh:mm A")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
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

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                All products are in stock!
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div
                    key={`${p.product_variant_id}-${p.product_id}`}
                    className="flex items-center gap-3 py-2 border-b last:border-0"
                  >
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-destructive font-medium">
                        {p.stock_status === "out_of_stock"
                          ? "Out of Stock"
                          : `Low Stock (${p.stock})`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...mockUsers]
                .sort((a, b) => b.spent - a.spent)
                .slice(0, 5)
                .map((u, i) => (
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
    </div>
  );
};

export default Dashboard;
