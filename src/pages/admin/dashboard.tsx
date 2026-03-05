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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  getDashboardStats,
  monthlyRevenue,
  salesByCategory,
  mockUsers,
} from "@/data/adminData";
import { useState, useEffect } from "react";
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

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--destructive))",
  "hsl(var(--success))",
  "hsl(var(--accent))",
  "hsl(var(--secondary-foreground))",
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
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

const orderStatusBreakdown = [
  { status: "Delivered", count: 156, color: "hsl(var(--success))" },
  { status: "Shipped", count: 42, color: "hsl(var(--primary))" },
  {
    status: "Processing",
    count: 28,
    color: "hsl(var(--secondary-foreground))",
  },
  { status: "Cancelled", count: 12, color: "hsl(var(--destructive))" },
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReturnType<
    typeof getDashboardStats
  > | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(getDashboardStats());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const statusColor: Record<string, string> = {
    delivered: "bg-success text-success-foreground",
    shipped: "bg-primary text-primary-foreground",
    processing: "bg-secondary text-secondary-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  };

  const avgOrderValue = stats
    ? (stats.totalRevenue / (stats.totalOrders || 1)).toFixed(0)
    : "0";
  const conversionRate = (
    (conversionData.reduce((s, d) => s + d.conversions, 0) /
      conversionData.reduce((s, d) => s + d.visitors, 0)) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          loading={loading}
          change="+12.5%"
          changeType="up"
        />
        <StatCard
          title="Total Orders"
          value={`${stats?.totalOrders || 0}`}
          icon={ShoppingCart}
          loading={loading}
          change="+8.2%"
          changeType="up"
        />
        <StatCard
          title="Total Users"
          value={`${stats?.totalUsers || 0}`}
          icon={Users}
          loading={loading}
          change="+15.3%"
          changeType="up"
        />
        <StatCard
          title="Total Products"
          value={`${stats?.totalProducts || 0}`}
          icon={Package}
          loading={loading}
          change="-2.1%"
          changeType="down"
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
                    <p className="text-lg font-bold">${avgOrderValue}</p>
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
                      {mockUsers.filter((u) => u.status === "active").length}
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
          <CardHeader>
            <CardTitle className="text-lg font-display">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyRevenue}>
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
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="month"
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
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    // formatter={(value: number) => [
                    //   `$${value.toLocaleString()}`,
                    //   "Revenue",
                    // ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="url(#revenueGrad)"
                    strokeWidth={2}
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
                    <p className="text-sm font-bold">${p.price}</p>
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
                    fill="hsl(var(--secondary-foreground))"
                    radius={[4, 4, 0, 0]}
                    name="Visitors"
                    opacity={0.3}
                  />
                  <Bar
                    dataKey="conversions"
                    fill="hsl(var(--primary))"
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
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      dataKey="sales"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {salesByCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {salesByCategory.map((item, i) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">
                          {item.sales}%
                        </span>
                      </div>
                      <Progress value={item.sales} className="h-1.5" />
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
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))
              : orderStatusBreakdown.map((item) => {
                  const total = orderStatusBreakdown.reduce(
                    (s, d) => s + d.count,
                    0,
                  );
                  const pct = ((item.count / total) * 100).toFixed(0);
                  return (
                    <div key={item.status} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.status}</span>
                        <span className="text-muted-foreground">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
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
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full mb-2" />
              ))
            ) : (
              <div className="space-y-3">
                {stats?.recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{o.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          statusColor[o.status] ||
                          "bg-secondary text-secondary-foreground"
                        }
                      >
                        {o.status}
                      </Badge>
                      <p className="text-sm font-bold">${o.total}</p>
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
            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : stats?.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                All products are in stock!
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 py-2 border-b last:border-0"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-destructive font-medium">
                        Out of Stock
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
                      ${u.spent.toLocaleString()}
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
